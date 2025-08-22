const fs = require('fs');
const fg = require('fast-glob');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');

// Windows için path'leri forward slash'e dönüştür (fast-glob için)
const normalizePattern = (pattern) => pattern.replace(/\\/g, '/');

// Relative path oluşturmak için güvenli fonksiyon
const getRelativePath = (fullPath, rootPath) => {
  const relativePath = path.relative(rootPath, fullPath);
  return '/' + relativePath.replace(/\\/g, '/');
};

const bgImages = fg.sync(normalizePattern(path.join(ROOT, 'bg', '**', 'bg-*.jpg')), {dot: true}).map((p) => getRelativePath(p, ROOT));
const vrmList = fg.sync(normalizePattern(path.join(ROOT, 'vrm', '**', '*.vrm')), {dot: true}).map((p) => getRelativePath(p, ROOT));
const speechT5SpeakerEmbeddingsList = fg.sync(normalizePattern(path.join(ROOT, 'speecht5_speaker_embeddings', '**', '*.bin')), {dot: true}).map((p) => getRelativePath(p, ROOT));
const animationList = [].concat(
  fg.sync(normalizePattern(path.join(ROOT, 'animations', '**', '*.vrma')), {dot: true}).map((p) => getRelativePath(p, ROOT)),
  fg.sync(normalizePattern(path.join(ROOT, 'animations', '**', '*.fbx')), {dot: true}).map((p) => getRelativePath(p, ROOT))
);

let str = "";
str += `export const bgImages = ${JSON.stringify(bgImages)};\n`;
str += `export const vrmList = ${JSON.stringify(vrmList)};\n`;
str += `export const speechT5SpeakerEmbeddingsList = ${JSON.stringify(speechT5SpeakerEmbeddingsList)};\n`;
str += `export const animationList = ${JSON.stringify(animationList)};\n`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'paths.ts'), str);
