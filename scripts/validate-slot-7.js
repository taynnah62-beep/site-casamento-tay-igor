const fs = require('fs');
const path = require('path');

function getSlot(html, n) {
  const marker = `data-idx="${n}"`;
  const idx = html.indexOf(marker);
  if (idx < 0) return null;
  const lineStart = html.lastIndexOf('<div', idx);
  const lineEnd = html.indexOf('</div>', idx) + 6;
  return html.slice(lineStart, lineEnd);
}

function validateBlock(label, block) {
  if (!block) {
    console.log(label, 'NOT FOUND');
    return;
  }
  const src = (block.match(/src="([^"]+)"/) || [])[1];
  const cls = (block.match(/class="([^"]+)"/) || [])[1];
  console.log('\n===', label, '===');
  console.log('classes:', cls);
  console.log('src type:', src?.startsWith('data:') ? 'base64' : src?.startsWith('assets/') ? 'file' : 'other');
  if (src?.startsWith('data:')) {
    const b64 = src.split(',')[1];
    const buf = Buffer.from(b64, 'base64');
    const magic = buf.slice(0, 4).toString('hex');
    const isJpeg = magic.startsWith('ffd8');
    const isPng = magic === '89504e47';
    console.log('decoded bytes:', buf.length);
    console.log('magic:', magic, isJpeg ? '(valid JPEG)' : isPng ? '(valid PNG)' : '(INVALID)');
    console.log('text sample:', buf.slice(100, 200).toString('utf8').replace(/[^\x20-\x7e]/g, '.'));
  } else {
    console.log('src:', src);
  }
}

const indexPath = path.join(__dirname, '../index.html');
const previewPath = path.join(__dirname, '../fase1-preview-ajustes_1.html');

const index = fs.readFileSync(indexPath, 'utf8');
const preview = fs.readFileSync(previewPath, 'utf8');

validateBlock('index slot 7', getSlot(index, '7'));
validateBlock('preview slot 7', getSlot(preview, '7'));
validateBlock('index slot 5', getSlot(index, '5'));
