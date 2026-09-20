// Stories page: loads a Google Sheets CSV, shows cards with reactions.
const s = ctx.settings;
const sheetUrl = s.sheetUrl || 'https://docs.google.com/spreadsheets/d/1YgOhoUvNbKBH1Um-WRvUE5GVkj1_PS77JQPt0hvbjUU/gviz/tq?tqx=out:csv';

ctx.root.innerHTML = `
<div class="section-title" style="margin-top:0"><i class="fas fa-book"></i> Elite Stories</div>
<div id="storiesList"><div class="spinner"></div></div>
<div class="footer" style="margin-top:20px"><i class="fas fa-fire"></i> ELITE PROFILE &bull; SAIF BABY <i class="fas fa-crown"></i></div>
`;

const list = ctx.root.querySelector('#storiesList');

function parseCsv(text) {
  const lines = text.replace(/\r/g,'').split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // take the last cell (usually the story text)
    const cells = [];
    let cur = '', inQ = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { cells.push(cur); cur = ''; continue; }
      cur += ch;
    }
    cells.push(cur);
    const txt = (cells[cells.length-1] || '').trim();
    if (txt) rows.push({ id: i, text: txt });
  }
  return rows;
}

(async () => {
  try {
    const res = await fetch(sheetUrl);
    const text = await res.text();
    const rows = parseCsv(text);
    if (!rows.length) { list.innerHTML = '<div class="page-err"><i class="fas fa-book-open"></i><h3>No stories yet</h3><p>Add rows to your Google Sheet.</p></div>'; return; }
    list.innerHTML = rows.map(r => `
      <div class="story-card">
        <p>${ctx.esc(r.text)}</p>
        <div class="react-box">
          <button class="react-btn" data-id="s_${r.id}" data-type="love">❤️ <span id="love-s_${r.id}">0</span></button>
          <button class="react-btn" data-id="s_${r.id}" data-type="sad">😢 <span id="sad-s_${r.id}">0</span></button>
          <button class="react-btn" data-id="s_${r.id}" data-type="care">🥰 <span id="care-s_${r.id}">0</span></button>
        </div>
      </div>`).join('');

    list.querySelectorAll('.react-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.dataset.id, type = btn.dataset.type;
        ctx.db.ref('data/reacts/' + sid + '/' + type).transaction(c => (c || 0) + 1);
      });
    });

    rows.forEach(r => {
      ['love','sad','care'].forEach(type => {
        ctx.db.ref('data/reacts/s_' + r.id + '/' + type).on('value', snap => {
          const el = list.querySelector('#\\' + type + '-s_' + r.id) || ctx.root.querySelector('#' + type + '-s_' + r.id);
          if (el) el.textContent = snap.val() || 0;
        });
      });
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = '<div class="page-err"><i class="fas fa-triangle-exclamation"></i><h3>Could not load stories</h3><p>' + ctx.esc(err.message) + '</p></div>';
  }
});
