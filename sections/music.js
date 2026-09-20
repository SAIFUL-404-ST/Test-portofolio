// Background music with a play button.
const s = ctx.settings;
if (!s.url) return;
ctx.host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:60';
ctx.css(`
.b{position:fixed;right:14px;bottom:calc(84px + env(safe-area-inset-bottom));pointer-events:auto;width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(255,215,0,.35);background:rgba(18,17,16,.82);backdrop-filter:blur(12px);color:var(--gold);font-size:1rem;cursor:pointer;display:grid;place-items:center;transition:transform .2s,border-color .2s}
.b:hover{transform:scale(1.08);border-color:var(--gold)}
.b.on{border-color:var(--gold);box-shadow:0 0 18px rgba(255,153,0,.35)}
@media(min-width:900px){.b{bottom:24px;right:24px}}
`);
const a = new Audio();
a.loop = true; a.preload = 'none'; a.src = ctx.safeUrl(s.url);
a.volume = Math.max(0, Math.min(1, (s.volume == null ? 30 : +s.volume) / 100));
const b = document.createElement('button');
b.className = 'b'; b.type = 'button'; b.setAttribute('aria-label', 'Background music');
const paint = () => {
  b.innerHTML = '<i class="fas ' + (a.paused ? 'fa-volume-xmark' : 'fa-volume-high') + '"></i>';
  b.classList.toggle('on', !a.paused);
};
b.onclick = () => {
  if (a.paused) a.play().then(paint).catch(() => { ctx.toast('Could not play the audio.'); paint(); });
  else { a.pause(); paint(); }
};
paint();
ctx.root.appendChild(b);
ctx.onDestroy(() => { a.pause(); a.removeAttribute('src'); a.load(); });
