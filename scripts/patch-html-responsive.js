const fs = require('fs');
const p = require('path').join(__dirname, '../index.html');
let h = fs.readFileSync(p, 'utf8');

h = h.replaceAll(
  '<section class="section" style="background:#F7F5F1;">',
  '<section class="section section-cream">'
);
h = h.replaceAll(
  '<section class="section" style="background:#F7F5F1; padding:120px 24px;">',
  '<section class="section section-cream section-spacious">'
);
h = h.replace(
  '<div class="rvl wd-btn" style="margin-top:40px;">',
  '<div class="rvl wd-btn">'
);
h = h.replace(
  "<h2 class=\"rvl\" style=\"font-family:'Fraunces',Georgia,serif; font-weight:300; font-size:34px; margin-bottom:12px;\">Nossa Historia</h2>",
  '<h2 class="rvl gallery-title">Nossa Historia</h2>'
);
h = h.replace(
  '<div class="gallery-featured rvl in gallery-abraco" data-idx="4" style="aspect-ratio: 4/3; max-height: 420px;">',
  '<div class="gallery-featured rvl in gallery-abraco" data-idx="4">'
);
h = h.replace(
  '<div class="gallery-pair" style="grid-template-columns: 1fr;">',
  '<div class="gallery-pair gallery-pair-single">'
);
h = h.replace(
  '<div class="gallery-photo rvl" data-idx="10" style="aspect-ratio: 1280/854; max-width: 700px; margin: 0 auto;">',
  '<div class="gallery-photo rvl gallery-photo-centered" data-idx="10" style="aspect-ratio: 1280/854;">'
);

fs.writeFileSync(p, h);
console.log('OK');
