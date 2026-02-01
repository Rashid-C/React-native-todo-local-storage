const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Minimal valid 1x1 PNG (white pixel) - valid CRC
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAACQd3PaAAAADElEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

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
    fs.writeFileSync(filePath, Buffer.from(pngBase64, 'base64'));
    console.log('Created', filePath);
});

console.log('Placeholder images created in', outDir);
