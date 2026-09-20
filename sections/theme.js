// Theme: colors, site name, light/dark toggle.
const s = ctx.settings;
ctx.site.setTheme({
  brand: s.brand,
  mode: s.mode,
  toggle: s.toggle !== false,
  vars: { gold: s.gold, fire1: s.fire1, fire2: s.fire2, bg: s.bg, surface: s.surface, text: s.text }
});
ctx.onDestroy(() => ctx.site.resetTheme());
