const fs = require('fs');
const path = require('path');

function jpegDimensions(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error('JPEG SOF not found');
}

const src =
  'C:/Users/taynn/.cursor/projects/c-Users-taynn-OneDrive-Documentos-site-casamento/assets/c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_Tay_Igor-336-bd1f0d4e-c37c-4634-9201-9d73051ed976.png';
const imgPath = 'assets/images/gallery-slot-7.jpg';
const out = path.join(__dirname, '..', imgPath);
const indexPath = path.join(__dirname, '../index.html');

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.copyFileSync(src, out);

const buf = fs.readFileSync(out);
const { width, height } = jpegDimensions(buf);
const aspect = `${width}/${height}`;

let html = fs.readFileSync(indexPath, 'utf8');
const marker = 'data-idx="7"';
const idx = html.indexOf(marker);
if (idx < 0) throw new Error('slot 7 not found');
const lineStart = html.lastIndexOf('<div', idx);
const lineEnd = html.indexOf('</div>', idx) + 6;
const newBlock =
  `<div class="gallery-photo rvl in" data-idx="7" style="aspect-ratio: ${aspect};"><img src="${imgPath}" alt="Tay e Igor"></div>`;
html = html.slice(0, lineStart) + newBlock + html.slice(lineEnd);
fs.writeFileSync(indexPath, html);

console.log('updated', width, 'x', height, 'aspect', aspect);
