# Icon Generation Script

This directory needs PNG icons for the PWA to work properly.

## Quick Setup

You have two options:

### Option 1: Download from Cloudinary (Recommended)
Use your existing logo from Cloudinary and resize it:
```bash
# You can use an online tool or imagemagick:
# Install imagemagick first, then run:
magick convert https://res.cloudinary.com/docxvgl2f/image/upload/v1762906548/itsmycv_mtrcbq.png -resize 192x192 icon-192x192.png
magick convert https://res.cloudinary.com/docxvgl2f/image/upload/v1762906548/itsmycv_mtrcbq.png -resize 256x256 icon-256x256.png
magick convert https://res.cloudinary.com/docxvgl2f/image/upload/v1762906548/itsmycv_mtrcbq.png -resize 384x384 icon-384x384.png
magick convert https://res.cloudinary.com/docxvgl2f/image/upload/v1762906548/itsmycv_mtrcbq.png -resize 512x512 icon-512x512.png
```

### Option 2: Use Online Tool (Easiest)
1. Go to https://realfavicongenerator.net/
2. Upload your logo
3. Download the generated package
4. Extract and copy the icon files to this directory

### Option 3: Use PWA Builder
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo
3. Download and extract the icons
4. Copy to this directory

## Required Files
- icon-192x192.png
- icon-256x256.png
- icon-384x384.png
- icon-512x512.png
- favicon.ico

Once you have these files, your PWA will be ready to install!
