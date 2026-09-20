// Tools page — loads your old plugins from the saif/ folder.
const s = ctx.settings, e = ctx.esc;
const folder = String(s.folder || 'saif').replace(/^\/+|\/+$/g, '');
ctx.css(`
.tools-head{margin-bottom:22px}
.tools-head h1{font-family:var(--display);font-size:1.7rem;font-weight:800;color:var(--gold)}
.tools-head p{color:var(--muted);margin-top:6px}
#toolsPluginZone{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr));gap:20px;align-items:start;
  --card-bg:var(--surface);--card:var(--surface);--info-bg:rgba(255,215,0,.04);--info-border:var(--line);--value-color:var(--text);
  --label-opacity:.55;--input-bg:rgba(127,127,127,.12);--input-color:var(--text);--dl-bg:rgba(0,0,0,.25);--primary:var(--gold);
  --danger:#ff416c;--success:#25d366;--warning:#ffa726;--panel-bg:var(--surface);--footer-bg:rgba(0,0,0,.25);--footer-border:var(--line);
  --stat-bg:rgba(0,0,0,.25);--story-card-bg:rgba(255,215,0,.04)}
#toolsPluginZone input,#toolsPluginZone textarea,#toolsPluginZone select{width:100%;padding:13px 15px;margin:8px 0;border-radius:13px;border:1.5px solid rgba(255,215,0,.2);background:var(--input-bg);color:var(--input-color);outline:none;font-size:.92rem;font-family:inherit}
#toolsPluginZone input:focus,#toolsPluginZone textarea:focus,#toolsPluginZone select:focus{border-color:var(--gold)}
#toolsPluginZone .dl-box{padding:20px;background:var(--dl-bg);border-radius:20px;border:1.5px solid rgba(255,215,0,.18)}
#toolsPluginZone .dl-btn{width:100%;padding:13px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--fire1),var(--fire2));color:#000;font-weight:900;cursor:pointer;font-size:.92rem;font-family:inherit}
#toolsPluginZone .section-title{font-size:.78rem;color:var(--gold);font-weight:900;text-transform:uppercase;margin:6px 0 13px;padding-left:12px;letter-spacing:2px;border-left:3px solid var(--fire2)}
#toolsPluginZone .spinner{width:44px;height:44px;border:4px solid rgba(255,215,0,.1);border-left-color:var(--gold);border-radius:50%;animation:tspin 1s linear infinite;margin:18px auto}
@keyframes tspin{to{transform:rotate(360deg)}}
#toolsPluginZone .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left}
#toolsPluginZone .info{background:var(--info-bg);padding:13px;border-radius:13px;border:1px solid var(--info-border)}
#toolsPluginZone .info i{color:var(--gold);margin-right:8px;font-size:.85rem}
#toolsPluginZone .label{display:block;font-size:.57rem;opacity:var(--label-opacity);font-weight:900;letter-spacing:1px;margin-bottom:4px}
#toolsPluginZone .value{font-size:.82rem;font-weight:700}
#toolsPluginZone .btn{padding:12px 24px;border-radius:13px;border:none;cursor:pointer;font-weight:900;font-size:.86rem;display:inline-flex;align-items:center;gap:8px;font-family:inherit;margin:0}
#toolsPluginZone .btn-primary{background:linear-gradient(135deg,var(--fire1),var(--fire2));color:#000}
#toolsPluginZone .btn-success{background:linear-gradient(135deg,#25d366,#00a352);color:#fff}
#toolsPluginZone .btn-danger{background:linear-gradient(135deg,#ff416c,#ff4b2b);color:#fff}
#toolsNote .tn{max-width:520px;padding:26px;border-radius:var(--r3);background:var(--surface);border:1px solid var(--line)}
#toolsNote .tn i{font-size:1.4rem;color:var(--gold);display:block;margin-bottom:10px}
#toolsNote .tn p{color:var(--muted);margin-top:6px;line-height:1.6}
`);
ctx.root.innerHTML = '<div class="tools-head"><h1>' + e(s.title || 'Tools') + '</h1>' + (s.subtitle ? '<p>' + e(s.subtitle) + '</p>' : '') + '</div><div id="toolsPluginZone"></div><div id="toolsNote"></div>';
const zone = ctx.root.querySelector('#toolsPluginZone');
const note = ctx.root.querySelector('#toolsNote');
const w = window, scripts = [];
let dead = false;

w.getSaifToolZone = () => zone;
w.getSaifPluginAnchor = w.getSaifToolZone;
if (!w.db) w.db = ctx.db;
if (!w.showNotification) w.showNotification = m => ctx.toast(String(m).replace(/<[^>]*>/g, ''));
if (!w.logUserActivity) w.logUserActivity = () => {};
if (!w.currentUser) { try { w.currentUser = localStorage.getItem('saifUser'); } catch (err) {} }
if (!w.Swal) {
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
  document.head.appendChild(l);
  const sw = document.createElement('script');
  sw.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
  document.head.appendChild(sw);
}
const say = (icon, title, text) => {
  note.innerHTML = '<div class="tn"><i class="fas ' + icon + '"></i><b>' + e(title) + '</b><p>' + e(text) + '</p></div>';
};
(async () => {
  let list = [];
  try {
    const r = await fetch(folder + '/manifest.json?v=' + Date.now());
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    list = Array.isArray(j.plugins) ? j.plugins : [];
  } catch (err) {
    console.warn('[tools] manifest problem', err);
    say('fa-folder-open', 'No tools found', 'Upload the "' + folder + '" folder (manifest.json and the plugin files) next to index.html.');
    return;
  }
  list.forEach(f => {
    if (!/^[\w.-]+\.js$/.test(f)) return;
    const sc = document.createElement('script');
    sc.src = folder + '/' + f + '?v=' + Date.now();
    sc.onerror = () => console.warn('[tools] could not load ' + f);
    document.body.appendChild(sc);
    scripts.push(sc);
  });
  setTimeout(() => {
    if (!dead && !zone.children.length) say('fa-toolbox', 'No tools loaded', 'The plugin files did not load. Check the file names inside ' + folder + '/manifest.json.');
  }, 5000);
})();
ctx.onDestroy(() => {
  dead = true;
  scripts.forEach(sc => sc.remove());
  if (w.getSaifToolZone && w.getSaifToolZone() === zone) { delete w.getSaifToolZone; delete w.getSaifPluginAnchor; }
});
