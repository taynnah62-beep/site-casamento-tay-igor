const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, '../assets/images/dress-code-inspiracoes.png');
const output = path.join(__dirname, '../assets/images/dress-code-inspiracoes-fixed.png');
const bg = { r: 247, g: 245, b: 241 };
const hardCutoff = 32;
const softCutoff = 85;

async function main() {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dark = Math.max(r, g, b);

    if (dark <= hardCutoff) {
      data[i] = bg.r;
      data[i + 1] = bg.g;
      data[i + 2] = bg.b;
      data[i + 3] = 255;
      continue;
    }

    if (dark < softCutoff) {
      const t = (dark - hardCutoff) / (softCutoff - hardCutoff);
      data[i] = Math.round(r * t + bg.r * (1 - t));
      data[i + 1] = Math.round(g * t + bg.g * (1 - t));
      data[i + 2] = Math.round(b * t + bg.b * (1 - t));
      data[i + 3] = 255;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);

  console.log('OK:', output, info.width + 'x' + info.height);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
