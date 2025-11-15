/* eslint-disable */
/**
 * Script to generate PWA icons from the Cloudinary logo
 * 
 * This script downloads the logo from Cloudinary and creates
 * the required icon sizes for the PWA.
 * 
 * To use this script:
 * 1. Install sharp: npm install sharp
 * 2. Run: node generate-icons.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGO_URL = 'https://res.cloudinary.com/docxvgl2f/image/upload/v1762916180/itsmycv-logo-purple_ahwc4i.svg';
const OUTPUT_DIR = __dirname;
const TEMP_FILE = path.join(OUTPUT_DIR, 'temp-logo.svg');

const SIZES = [192, 256, 384, 512];

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function generateIcons() {
    try {
        // Try to use sharp if available
        let sharp;
        try {
            sharp = require('sharp');
        } catch (e) {
            console.log('⚠️  Sharp not installed. Please install it first:');
            console.log('   npm install sharp');
            console.log('\nAlternatively, use an online tool:');
            console.log('   https://realfavicongenerator.net/');
            process.exit(1);
        }

        console.log('📥 Downloading logo from Cloudinary...');
        await downloadImage(LOGO_URL, TEMP_FILE);
        console.log('✅ Logo downloaded');

        console.log('\n🎨 Generating icons...');
        for (const size of SIZES) {
            const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
            await sharp(TEMP_FILE)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toFile(outputPath);
            console.log(`✅ Generated icon-${size}x${size}.png`);
        }

        // Generate favicon (32x32 PNG)
        console.log('\n🎨 Generating favicon...');
        await sharp(TEMP_FILE)
            .resize(32, 32, {
                fit: 'contain',
                background: { r: 26, g: 29, b: 46, alpha: 1 }
            })
            .png()
            .toFile(path.join(OUTPUT_DIR, 'favicon.png'));
        console.log('✅ Generated favicon.png');

        // Also generate 16x16 for favicon
        await sharp(TEMP_FILE)
            .resize(16, 16, {
                fit: 'contain',
                background: { r: 26, g: 29, b: 46, alpha: 1 }
            })
            .png()
            .toFile(path.join(OUTPUT_DIR, 'favicon-16x16.png'));
        console.log('✅ Generated favicon-16x16.png');

        // Clean up temp file
        fs.unlinkSync(TEMP_FILE);

        console.log('\n✨ All icons generated successfully!');
        console.log('\nYour PWA is now ready to be installed! 🚀');
    } catch (error) {
        console.error('❌ Error generating icons:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    generateIcons();
}

module.exports = { generateIcons };
