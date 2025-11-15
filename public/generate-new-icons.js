const sharp = require('sharp');
const https = require('https');
const fs = require('fs');

const logoUrl = 'https://res.cloudinary.com/docxvgl2f/image/upload/v1763148966/itsmycv-logo-pink_dkyfav.svg';
const sizes = [16, 32, 192, 256, 384, 512];

// Download SVG
https.get(logoUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', async () => {
        console.log('✓ Downloaded logo SVG');

        // Save the SVG
        fs.writeFileSync('icon.svg', data);
        console.log('✓ Saved icon.svg');

        // Generate PNG icons
        for (const size of sizes) {
            await sharp(Buffer.from(data))
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toFile(size === 16 ? 'favicon-16x16.png' :
                    size === 32 ? 'favicon.png' :
                        `icon-${size}x${size}.png`);
            console.log(`✓ Generated ${size}x${size} icon`);
        }

        // Generate ICO file (16x16 and 32x32)
        await sharp(Buffer.from(data))
            .resize(32, 32, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .png()
            .toFile('favicon-temp.png');

        // Rename to ico (basic approach - for proper ICO, you'd need a specialized library)
        fs.renameSync('favicon-temp.png', 'favicon.ico');
        console.log('✓ Generated favicon.ico');

        console.log('\n✅ All icons generated successfully!');
    });
}).on('error', (err) => {
    console.error('Error downloading logo:', err);
});
