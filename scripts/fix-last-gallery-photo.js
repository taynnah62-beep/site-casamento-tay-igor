const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../index.html');
let html = fs.readFileSync(file, 'utf8');

const pattern =
  /<div class="gallery-pair gallery-pair-single">\s*<div class="gallery-photo rvl gallery-photo-centered" data-idx="10" style="aspect-ratio: 1280\/854;">([\s\S]*?)<\/div>\s*<\/div>/;

const match = html.match(pattern);
if (!match) {
  console.error('Pattern not found');
  process.exit(1);
}

const replacement =
  '<div class="gallery-featured rvl" data-idx="10" style="aspect-ratio: 1600/1066;">' +
  match[1] +
  '</div>';

html = html.replace(pattern, replacement);
fs.writeFileSync(file, html);
console.log('OK');
