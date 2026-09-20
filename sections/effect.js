// Rain and fire sparks. Very light on phones.
const s = ctx.settings;
if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
ctx.host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0';
const cv = document.createElement('canvas');
cv.style.cssText = 'width:100%;height:100%;display:block';
ctx.root.appendChild(cv);
const g = cv.getContext('2d');
if (!g) return;
const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
let W = 0, H = 0;
const size = () => { W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); g.setTransform(dpr, 0, 0, dpr, 0, 0); };
size();
addEventListener('resize', size);
ctx.onDestroy(() => removeEventListener('resize', size));

const low = (navigator.hardwareConcurrency || 4) <= 4;
const k = Math.max(0, Math.min(100, s.density == null ? 60 : +s.density)) / 100 * (low ? 0.55 : 1);
const nRain = s.rain === false ? 0 : Math.round(110 * k);
const nSpark = s.sparks === false ? 0 : Math.round(34 * k);
const cols = ['255,80,0', '255,120,0', '255,170,0', '255,210,40'];
const newDrop = init => ({ x: Math.random() * W, y: init ? Math.random() * H : -20, l: 8 + Math.random() * 16, v: 3 + Math.random() * 4, a: 0.08 + Math.random() * 0.16 });
const newSpark = init => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: 1 + Math.random() * 2.4, v: 0.4 + Math.random() * 1.1, d: (Math.random() - 0.5) * 0.5, life: 0, max: 180 + Math.random() * 220, c: cols[(Math.random() * cols.length) | 0] });
const rain = [], sparks = [];
for (let i = 0; i < nRain; i++) rain.push(newDrop(true));
for (let i = 0; i < nSpark; i++) sparks.push(newSpark(true));

let raf = 0, last = 0;
const frame = t => {
  raf = requestAnimationFrame(frame);
  if (t - last < 33) return;
  last = t;
  g.clearRect(0, 0, W, H);
  const light = document.documentElement.dataset.mode === 'light';
  g.lineWidth = 1.1;
  for (let i = 0; i < rain.length; i++) {
    const d = rain[i];
    g.strokeStyle = light ? 'rgba(160,90,0,' + d.a + ')' : 'rgba(255,180,0,' + (d.a * 0.7) + ')';
    g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x - 1.5, d.y + d.l); g.stroke();
    d.y += d.v * 2; d.x -= 0.5;
    if (d.y > H) Object.assign(d, newDrop(false));
  }
  for (let i = 0; i < sparks.length; i++) {
    const p = sparks[i];
    p.life++; p.y -= p.v * 2; p.x += p.d + Math.sin(p.life / 25) * 0.3;
    const f = p.life / p.max;
    const al = f < 0.15 ? f / 0.15 : 1 - f;
    g.fillStyle = 'rgba(' + p.c + ',' + (Math.max(0, al) * 0.55) + ')';
    g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
    if (p.life >= p.max || p.y < -10) Object.assign(p, newSpark(false));
  }
};
raf = requestAnimationFrame(frame);
const vis = () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(frame); };
document.addEventListener('visibilitychange', vis);
ctx.onDestroy(() => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', vis); });
