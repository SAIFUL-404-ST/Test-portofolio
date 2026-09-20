// Style: fonts, corner roundness, page width.
const s = ctx.settings;
ctx.site.setStyle({ bodyFont: s.bodyFont, displayFont: s.displayFont, roundness: s.roundness, width: s.width });
ctx.onDestroy(() => ctx.site.resetStyle());
