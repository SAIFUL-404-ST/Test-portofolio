// Home card: fire ring avatar, info grid, Mikasa, social, footer.
const s = ctx.settings, e = ctx.esc, u = ctx.safeUrl;
const name = s.name || 'Your name';
const infoRows = [
  ['fa-user-tag','Nickname',s.nickname],
  ['fa-cake-candles','Birthday',s.birthday],
  ['fa-briefcase','Status',s.status],
  ['fa-code','Skills',s.skills],
  ['fa-house','Home Town',s.hometown],
  ['fa-location-dot','Current',s.current]
].filter(r => r[2]);
const wa = String(s.wa || '').replace(/\D/g,'');
const social = [];
if (s.fb) social.push(['fb','fab fa-facebook-f',u(s.fb)]);
if (wa) social.push(['wa','fab fa-whatsapp','https://wa.me/'+wa]);
if (s.ig) social.push(['ig','fab fa-instagram',u(s.ig)]);
if (s.email) social.push(['mail','fas fa-envelope','mailto:'+e(s.email)]);

ctx.root.innerHTML = `
<div class="card">
  <div class="card-cover">${s.cover ? `<img src="${e(u(s.cover))}" alt="Cover">` : ''}</div>
  <div class="avatarBox">
    <div class="fire-ring"></div>
    <div class="fire-ring-2"></div>
    <div class="fire-ring-3"></div>
    <img src="${e(u(s.avatar) || 'https://i.imgur.com/58L6IZM.jpeg')}" class="avatar" alt="${e(name)}">
  </div>
  <div style="margin-top:84px"></div>
  <h1>${e(name)}</h1>
  ${s.badge ? `<div class="profile-badge">${e(s.badge)}</div>` : ''}
  ${s.quote ? `<p class="quote">${e(s.quote)}</p>` : ''}

  ${infoRows.length ? `
  <div class="section-title">Personal Profile</div>
  <div class="info-grid">
    ${infoRows.map(r => `<div class="info"><i class="fas ${r[0]}"></i><span class="label">${r[1]}</span><span class="value">${e(r[2])}</span></div>`).join('')}
  </div>` : ''}

  ${s.mikasaText ? `
  <div class="section-title">Your Mikasa Baby</div>
  <div class="mikasa">
    <div class="mikasaHead">
      ${s.mikasaImage ? `<img src="${e(u(s.mikasaImage))}" alt="">` : ''}
      <div>
        <h3>${e(s.mikasaTitle || 'Mikasa Baby')}</h3>
        <p>Loyalty is her nature baby.</p>
      </div>
    </div>
    <p class="text">${e(s.mikasaText)}</p>
    ${s.mikasaLink ? `<a class="mkbtn" href="${e(u(s.mikasaLink))}" target="_blank" rel="noopener"><i class="fab fa-facebook-messenger"></i> ${e(s.mikasaButton || 'JOIN MIKASA WORLD')}</a>` : ''}
  </div>` : ''}

  ${social.length ? `
  <div class="section-title">Connect With Me</div>
  <div class="social">
    ${social.map(x => `<a class="${x[0]}" href="${e(x[2])}" target="_blank" rel="noopener"><i class="${x[1]}"></i></a>`).join('')}
  </div>` : ''}

  <div class="footer"><i class="fas fa-fire"></i> ELITE PROFILE &bull; SAIF BABY <i class="fas fa-crown"></i></div>
</div>`;
