const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1x1 transparent PNG
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const files = [
    'icon.png',
    'android-icon-foreground.png',
    'android-icon-background.png',
    'android-icon-monochrome.png',
    'favicon.png',
    'splash-icon.png'
];

files.forEach((name) => {
    const filePath = path.join(outDir, name);
    if (fs.existsSync(filePath)) return;
    fs.writeFileSync(filePath, Buffer.from(pngBase64, 'base64'));
    console.log('Created', filePath);
});

console.log('Placeholder images created in', outDir);
