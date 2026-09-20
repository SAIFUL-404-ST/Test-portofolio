// Contact page: quick links + message form.
const s = ctx.settings, e = ctx.esc, u = ctx.safeUrl;
const home = ctx.nav && ctx.nav.length ? null : null;

// Pull social links from the home module's settings
const homeMod = (window.__saifHomeSettings) || {};
const fb = homeMod.fb || 'https://www.facebook.com/saiful.404.st';
const wa = String(homeMod.wa || '8801823772045').replace(/\D/g,'');
const ig = homeMod.ig || 'https://www.instagram.com/saiful_404_st';
const em = homeMod.email || 'saifmorse04@gmail.com';

ctx.root.innerHTML = `
<div class="section-title" style="margin-top:0"><i class="fas fa-satellite-dish"></i> Contact Me</div>

<div style="background:var(--card-bg);border-radius:24px;padding:22px;border:1px solid rgba(255,215,0,0.12);backdrop-filter:blur(20px)">
  <a class="contact-link" href="${e(u(fb))}" target="_blank" rel="noopener">
    <div class="c-icon" style="background:linear-gradient(135deg,#1877f2,#0d5fcc)"><i class="fab fa-facebook-f" style="color:#fff"></i></div>
    <div><span class="c-label">Facebook</span><span class="c-value">${e(fb.replace('https://www.facebook.com/',''))}</span></div>
    <i class="fas fa-chevron-right" style="margin-left:auto;color:var(--gold);opacity:.5"></i>
  </a>
  ${wa ? `<a class="contact-link" href="https://wa.me/${e(wa)}" target="_blank" rel="noopener">
    <div class="c-icon" style="background:linear-gradient(135deg,#25d366,#1ea952)"><i class="fab fa-whatsapp" style="color:#fff"></i></div>
    <div><span class="c-label">WhatsApp</span><span class="c-value">+${e(wa)}</span></div>
    <i class="fas fa-chevron-right" style="margin-left:auto;color:var(--gold);opacity:.5"></i>
  </a>` : ''}
  <a class="contact-link" href="${e(u(ig))}" target="_blank" rel="noopener">
    <div class="c-icon" style="background:linear-gradient(135deg,#e4405f,#c13584)"><i class="fab fa-instagram" style="color:#fff"></i></div>
    <div><span class="c-label">Instagram</span><span class="c-value">${e(ig.replace('https://www.instagram.com/',''))}</span></div>
    <i class="fas fa-chevron-right" style="margin-left:auto;color:var(--gold);opacity:.5"></i>
  </a>
  <a class="contact-link" href="mailto:${e(em)}">
    <div class="c-icon" style="background:linear-gradient(135deg,#ea4335,#d02c1e)"><i class="fas fa-envelope" style="color:#fff"></i></div>
    <div><span class="c-label">Email</span><span class="c-value">${e(em)}</span></div>
    <i class="fas fa-chevron-right" style="margin-left:auto;color:var(--gold);opacity:.5"></i>
  </a>
</div>

<div style="background:var(--card-bg);border-radius:24px;padding:22px;border:1px solid rgba(255,215,0,0.12);backdrop-filter:blur(20px);margin-top:16px">
  <div class="section-title" style="margin:0 0 16px 0;font-size:.75rem"><i class="fas fa-paper-plane"></i> Send Message</div>
  <input type="text" id="cName" placeholder="Your name..." maxlength="40" style="margin:0 0 8px 0">
  <textarea id="cMsg" rows="4" placeholder="Write your message..." maxlength="500" style="margin:0 0 12px 0"></textarea>
  <button class="btn primary" id="cSend" type="button"><i class="fas fa-paper-plane"></i> SEND MESSAGE</button>
</div>

<div class="footer" style="margin-top:20px"><i class="fas fa-fire"></i> ELITE PROFILE &bull; SAIF BABY <i class="fas fa-crown"></i></div>
`;

ctx.root.querySelector('#cName').value = ctx.user.name || '';

ctx.root.querySelector('#cSend').addEventListener('click', async () => {
  const name = ctx.root.querySelector('#cName').value.trim();
  const text = ctx.root.querySelector('#cMsg').value.trim();
  if (name.length < 1 || text.length < 1) { ctx.toast('Please fill your name and message.'); return; }
  if (text.length > 500) { ctx.toast('Message is too long (max 500).'); return; }
  try {
    const uid = (await ctx.db.ref('.info/connected').once('value')) ? 'guest_' + Math.random().toString(36).slice(2,10) : 'guest';
    await ctx.db.ref('data/messages').push({
      uid, name, text, ts: firebase.database.ServerValue.TIMESTAMP
    });
    ctx.root.querySelector('#cMsg').value = '';
    ctx.toast('Message sent! I will reply soon.');
  } catch (err) {
    console.error(err);
    ctx.toast('Could not send. Try again later.');
  }
});
