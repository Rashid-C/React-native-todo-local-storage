const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        crc = crc ^ buf[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
        }
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function createMinimalPNG() {
    const width = 100;
    const height = 100;
    const bitDepth = 8;
    const colorType = 2; // RGB

    // PNG signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR chunk
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = bitDepth;
    ihdr[9] = colorType;
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const ihdrType = Buffer.from('IHDR');
    const ihdrChunk = Buffer.concat([ihdrType, ihdr]);
    const ihdrCrc = Buffer.alloc(4);
    ihdrCrc.writeUInt32BE(crc32(ihdrChunk), 0);

    // IDAT chunk (compressed image data)
    const scanlines = Buffer.alloc(height * (width * 3 + 1));
    let pos = 0;
    for (let y = 0; y < height; y++) {
        scanlines[pos++] = 0; // filter type none
        for (let x = 0; x < width; x++) {
            scanlines[pos++] = 200; // R
            scanlines[pos++] = 200; // G
            scanlines[pos++] = 200; // B
        }
    }

    const compressed = zlib.deflateSync(scanlines);
    const idatType = Buffer.from('IDAT');
    const idatChunk = Buffer.concat([idatType, compressed]);
    const idatCrc = Buffer.alloc(4);
    idatCrc.writeUInt32BE(crc32(idatChunk), 0);

    // IEND chunk
    const iendType = Buffer.from('IEND');
    const iendChunk = iendType;
    const iendCrc = Buffer.alloc(4);
    iendCrc.writeUInt32BE(crc32(iendChunk), 0);

    // Assemble full PNG
    return Buffer.concat([
        signature,
        Buffer.alloc(4).fill(0), ihdrType, ihdr, ihdrCrc,
        Buffer.alloc(4).fill(0), idatChunk, idatCrc,
        Buffer.alloc(4).fill(0), iendChunk, iendCrc
    ]);
}

function writePNG(length, type, data, crc) {
    return Buffer.concat([
        Buffer.alloc(4).writeUInt32BE(length, 0) && Buffer.alloc(4).writeUInt32BE(length, 0),
        Buffer.from(type),
        data,
        Buffer.alloc(4).writeUInt32BE(crc, 0) && Buffer.alloc(4).writeUInt32BE(crc, 0)
    ]);
}

const pngData = createMinimalPNG();

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
    fs.writeFileSync(filePath, pngData);
    console.log('Created', filePath);
});

console.log('Placeholder images created in', outDir);
