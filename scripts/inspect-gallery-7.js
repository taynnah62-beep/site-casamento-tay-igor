const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const re = /<div class="gallery-photo[^"]*" data-idx="7"[^>]*>[\s\S]*?<\/div>/;
const match = html.match(re);
if (!match) {
  console.log('slot 7 not found');
  process.exit(1);
}
const block = match[0];
console.log('length', block.length);
console.log('classes', (block.match(/class="([^"]+)"/) || [])[1]);
console.log('style', (block.match(/style="([^"]+)"/) || [])[1]);
console.log('has img', block.includes('<img'));
console.log('src type', block.includes('base64') ? 'base64' : block.includes('assets/') ? 'file' : 'other');
