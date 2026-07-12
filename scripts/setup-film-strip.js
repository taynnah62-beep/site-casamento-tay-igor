const fs = require('fs');
const path = require('path');

const srcBase =
  'C:/Users/taynn/.cursor/projects/c-Users-taynn-OneDrive-Documentos-site-casamento/assets';
const outDir = path.join(__dirname, '../assets/images/film-strip');
const patternSrc =
  srcBase +
  '/c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_ChatGPT_Image_12_de_jul._de_2026__01_32_28-55c7f97d-4815-4897-be97-ce7ceb6a59a6.png';
const patternOut = path.join(__dirname, '../assets/images/athos-pattern.png');

const photos = [
  'c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_WhatsApp_Image_2026-07-12_at_01.08.22-809df397-8ad5-4b7a-9b2d-78f6e0eafbf4.png',
  'c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_WhatsApp_Image_2026-07-12_at_01.08.23__1_-2bb6967c-a96a-43b5-995c-fde56e085667.png',
  'c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_WhatsApp_Image_2026-07-12_at_01.08.23-921116ba-cfc8-439a-8db4-1ddcb02315da.png',
  'c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_WhatsApp_Image_2026-07-12_at_01.08.24__1_-f0a0766f-9f72-4004-a795-889219095c1b.png',
  'c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_WhatsApp_Image_2026-07-12_at_01.08.24__2_-ef36825f-3dad-4926-a60d-a23e2bf549ef.png',
  'c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_WhatsApp_Image_2026-07-12_at_01.08.24__4_-7a804065-aa5a-4864-8dfe-7102b1f7a7d1.png',
  'c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_WhatsApp_Image_2026-07-12_at_01.08.24-5bbdfdb6-f0e6-4f0c-9347-ddd63099061f.png',
  'c__Users_taynn_AppData_Roaming_Cursor_User_workspaceStorage_9855ff17955649e5d2f886472775a064_images_WhatsApp_Image_2026-07-12_at_01.08.24__5_-3fd13db9-c329-4333-9619-7088aa5f5f06.png',
];

fs.mkdirSync(outDir, { recursive: true });
photos.forEach((name, i) => {
  const src = path.join(srcBase, name);
  const ext = name.toLowerCase().includes('.png') ? '.jpg' : '.jpg';
  const out = path.join(outDir, `film-${String(i + 1).padStart(2, '0')}${ext}`);
  fs.copyFileSync(src, out);
  console.log('copied', out, fs.statSync(out).size);
});
if (fs.existsSync(patternSrc)) {
  fs.copyFileSync(patternSrc, patternOut);
  console.log('pattern', patternOut);
}
