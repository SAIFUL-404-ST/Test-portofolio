// Home / Personal info. Edit here or in the admin panel.
const s = ctx.settings, e = ctx.esc, u = ctx.safeUrl;
const name = s.name || 'Your name';
const rows = [
  ['fa-user-tag','Nickname',s.nickname],
  ['fa-cake-candles','Birthday',s.birthday],
  ['fa-briefcase','Status',s.status],
  ['fa-code','Skills',s.skills],
  ['fa-house','Home town',s.hometown],
  ['fa-location-dot','Lives in',s.current]
].filter(r => r[2]);
const wa = String(s.wa || '').replace(/\D/g, '');
const links = [];
if (s.fb) links.push(['fab fa-facebook-f','Facebook',u(s.fb),'#1877f2',true]);
if (wa) links.push(['fab fa-whatsapp','WhatsApp','https://wa.me/'+wa,'#1fa855',true]);
if (s.ig) links.push(['fab fa-instagram','Instagram',u(s.ig),'#d6336c',true]);
if (s.email) links.push(['fas fa-envelope','Email','mailto:'+e(s.email),'#d93025',false]);
const go = ctx.nav.filter(n => n.route !== 'home');

ctx.css(`
.hero{position:relative;border-radius:var(--r3);overflow:hidden;background:var(--surface);border:1px solid var(--line)}
.cover{position:relative;height:172px;background:linear-gradient(135deg,#3a1300,#120a04)}
.cover img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.8) saturate(1.15)}
.cover::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(255,90,0,.10),var(--surface))}
.who{position:relative;display:flex;gap:28px;align-items:flex-end;padding:0 32px 32px;margin-top:-66px}
.ring{position:relative;flex:none;width:132px;height:132px;isolation:isolate}
.rg{position:absolute;inset:-7px;border-radius:50%;z-index:0;background:conic-gradient(#ff2200,#ff6600,#ffaa00,#ffdd00,#ffaa00,#ff6600,#ff2200);filter:blur(2px);animation:spin 5s linear infinite}
.ring::before{content:'';position:absolute;inset:-3px;border-radius:50%;background:var(--surface);z-index:1}
.ring::after{content:'';position:absolute;inset:-38px;border-radius:50%;z-index:-1;background:radial-gradient(circle,rgba(255,102,0,.34),transparent 66%);animation:glow 2.8s ease-in-out infinite alternate}
.av{position:relative;z-index:2;width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
.noav{display:grid;place-items:center;background:var(--surface2);color:var(--gold);font-size:2.4rem}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes glow{from{opacity:.5;transform:scale(.94)}to{opacity:1;transform:scale(1.06)}}
h1{font-family:var(--display);font-weight:800;font-size:clamp(1.6rem,4.6vw,2.5rem);line-height:1.1;letter-spacing:-.01em;overflow-wrap:anywhere;background:linear-gradient(90deg,var(--fire1),var(--gold));-webkit-background-clip:text;background-clip:text;color:transparent}
.badge{display:inline-block;margin-top:12px;padding:6px 14px;border-radius:99px;border:1px solid var(--line);font-size:.84rem;font-weight:600}
.quote{margin-top:12px;color:var(--muted);font-size:.96rem;line-height:1.65;max-width:52ch;font-style:italic}
.sec{margin-top:42px}
h2{font-family:var(--display);font-size:1.15rem;font-weight:700;color:var(--gold);margin-bottom:14px}
.about{display:grid;grid-template-columns:repeat(2,1fr);gap:0 40px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r2);padding:4px 26px}
.row{display:flex;align-items:center;gap:14px;padding:15px 0;border-bottom:1px solid var(--line)}
.row:nth-last-child(-n+2){border-bottom:0}
.row>i{flex:none;width:36px;height:36px;border-radius:var(--r1);display:grid;place-items:center;background:rgba(255,153,0,.13);color:var(--gold);font-size:.85rem}
.row small{display:block;color:var(--muted);font-size:.76rem;margin-bottom:1px}
.row b{font-weight:600;font-size:.95rem;overflow-wrap:anywhere}
.go-list{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.go{display:flex;align-items:center;gap:16px;padding:18px;border-radius:var(--r2);background:var(--surface);border:1px solid var(--line);transition:border-color .2s,transform .2s}
.go:hover{border-color:var(--gold);transform:translateY(-2px)}
.go .ic{flex:none;width:48px;height:48px;border-radius:var(--r1);display:grid;place-items:center;font-size:1.2rem;background:linear-gradient(135deg,var(--fire1),var(--fire2));color:#160800}
.go b{display:block;font-weight:700}
.go .d{display:block;color:var(--muted);font-size:.85rem;margin-top:2px}
.go .ch{margin-left:auto;color:var(--muted);font-size:.85rem}
.mk{display:flex;gap:22px;align-items:center;padding:24px;border-radius:var(--r3);background:linear-gradient(135deg,rgba(255,153,0,.11),rgba(255,102,0,.04));border:1px solid var(--line)}
.mk img{flex:none;width:76px;height:76px;border-radius:50%;object-fit:cover;border:2px solid var(--gold)}
.mk h3{font-size:1.05rem;margin-bottom:6px}
.mk p{color:var(--muted);line-height:1.65;font-size:.92rem}
.mkbtn{display:inline-flex;align-items:center;gap:8px;margin-top:14px;padding:10px 18px;border-radius:var(--r1);background:linear-gradient(135deg,var(--fire1),var(--fire2));color:#160800;font-weight:700;font-size:.9rem}
.links{display:flex;flex-wrap:wrap;gap:10px}
.lk{display:inline-flex;align-items:center;gap:10px;padding:10px 20px 10px 10px;border-radius:99px;background:var(--surface);border:1px solid var(--line);font-weight:600;font-size:.92rem;transition:border-color .2s}
.lk:hover{border-color:var(--gold)}
.lk i{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:.88rem}
@media(max-width:640px){
  .who{flex-direction:column;align-items:center;text-align:center;padding:0 20px 28px}
  .about,.go-list{grid-template-columns:1fr}
  .row:nth-last-child(2){border-bottom:1px solid var(--line)}
  .mk{flex-direction:column;text-align:center;padding:22px 18px}
}
`);

ctx.root.innerHTML = `
  <section class="hero">
    <div class="cover">${s.cover ? `<img src="${e(u(s.cover))}" alt="">` : ''}</div>
    <div class="who">
      <div class="ring"><span class="rg"></span>${s.avatar ? `<img class="av" src="${e(u(s.avatar))}" alt="">` : `<div class="av noav"><i class="fas fa-user"></i></div>`}</div>
      <div class="txt">
        <h1>${e(name)}</h1>
        ${s.badge ? `<p class="badge">${e(s.badge)}</p>` : ''}
        ${s.quote ? `<p class="quote">${e(s.quote)}</p>` : ''}
      </div>
    </div>
  </section>
  ${rows.length ? `<section class="sec"><h2>About</h2><div class="about">${rows.map(r => `<div class="row"><i class="fas ${r[0]}"></i><div><small>${r[1]}</small><b>${e(r[2])}</b></div></div>`).join('')}</div></section>` : ''}
  ${go.length ? `<section class="sec"><h2>Explore</h2><div class="go-list">${go.map(n => `<a class="go" href="#/${e(n.route)}"><span class="ic"><i class="${e(n.icon)}"></i></span><span><b>${e(n.title)}</b>${n.desc ? `<span class="d">${e(n.desc)}</span>` : ''}</span><i class="fas fa-chevron-right ch"></i></a>`).join('')}</div></section>` : ''}
  ${s.mikasaText ? `<section class="sec"><div class="mk">${s.mikasaImage ? `<img src="${e(u(s.mikasaImage))}" alt="">` : ''}<div><h3>${e(s.mikasaTitle || 'Mikasa')}</h3><p>${e(s.mikasaText)}</p>${s.mikasaLink ? `<a class="mkbtn" href="${e(u(s.mikasaLink))}" target="_blank" rel="noopener"><i class="fab fa-facebook-messenger"></i> ${e(s.mikasaButton || 'Join')}</a>` : ''}</div></div></section>` : ''}
  ${links.length ? `<section class="sec"><h2>Find me</h2><div class="links">${links.map(l => `<a class="lk" href="${e(l[2])}"${l[4] ? ' target="_blank" rel="noopener"' : ''}><i class="${l[0]}" style="background:${l[3]}"></i>${l[1]}</a>`).join('')}</div></section>` : ''}
`;
