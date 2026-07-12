const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

function getSlot(html, n) {
  const marker = `data-idx="${n}"`;
  const idx = html.indexOf(marker);
  if (idx < 0) return null;
  const lineStart = html.lastIndexOf('<div', idx);
  const lineEnd = html.indexOf('</div>', idx) + 6;
  return html.slice(lineStart, lineEnd);
}

function ensureIn(block) {
  if (block.includes(' rvl in') || block.includes(' rvl in ')) return block;
  return block.replace('gallery-photo rvl"', 'gallery-photo rvl in"');
}

const slots = ['5', '6', '7', '8'].map((n) => ensureIn(getSlot(html, n)));
if (slots.some((s) => !s)) throw new Error('missing gallery slots');

const slot7 = slots[2].replace(
  'class="gallery-photo rvl in"',
  'class="gallery-photo rvl in gallery-photo-span"'
);
const slot8 = slots[3].replace(
  'class="gallery-photo rvl in"',
  'class="gallery-photo rvl in gallery-photo-span"'
);

const mosaic = `      <div class="gallery-pair gallery-pair-mosaic">
        ${slots[0]}
        ${slots[1]}
        ${slot7}
        ${slot8}
      </div>`;

const pairStart = html.indexOf('<div class="gallery-pair">', html.indexOf('gallery-abraco'));
const pairEnd = html.indexOf('</div>', html.indexOf('data-idx="8"')) + 6;
const afterPair = html.indexOf('\n', pairEnd) + 1;
// pair block ends after closing gallery-pair div
let depth = 0;
let pos = pairStart;
let pairClose = -1;
while (pos < html.length) {
  if (html.startsWith('<div', pos)) {
    depth++;
    pos = html.indexOf('>', pos) + 1;
    continue;
  }
  if (html.startsWith('</div>', pos)) {
    depth--;
    if (depth === 0) {
      pairClose = pos + 6;
      break;
    }
    pos += 6;
    continue;
  }
  pos++;
}
if (pairClose < 0) throw new Error('gallery pair block not found');

html = html.slice(0, pairStart) + mosaic + html.slice(pairClose);
fs.writeFileSync(indexPath, html);
console.log('reorganized second gallery-pair as mosaic');
