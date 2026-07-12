const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const marker = 'data-idx="7"';
const idx = html.indexOf(marker);
const lineStart = html.lastIndexOf('<div', idx);
const lineEnd = html.indexOf('</div>', idx) + 6;
const block = html.slice(lineStart, lineEnd);
const src = block.match(/src="([^"]+)"/)[1];
const b64 = src.split(',')[1];
const buf = Buffer.from(b64, 'base64');
const out = path.join(__dirname, '../assets/images/gallery-slot-7-temp.jpg');
fs.writeFileSync(out, buf);
console.log('written', out, buf.length);
