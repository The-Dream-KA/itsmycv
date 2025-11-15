# PWA Configuration for itsmycv.be

This document explains the Progressive Web App (PWA) setup for itsmycv.be.

## ✨ Features Enabled

- **Offline Access**: Users can access the app even without internet connection
- **Install to Device**: Users can install the app on their mobile devices or desktops
- **App-like Experience**: Runs in standalone mode without browser UI
- **Fast Loading**: Service Worker caches assets for faster load times
- **Background Sync**: Data syncs automatically when connection is restored

## 📁 PWA Files

### Configuration Files
- `next.config.ts` - Next.js configuration with PWA plugin
- `public/manifest.json` - Web App Manifest with app metadata
- `src/app/layout.tsx` - PWA meta tags and theme configuration
- `src/app/offline/page.tsx` - Offline fallback page

### Icons
All required PWA icons are in `/public`:
- `icon-192x192.png` - Android home screen
- `icon-256x256.png` - Various devices
- `icon-384x384.png` - High-res displays
- `icon-512x512.png` - Splash screens
- `favicon.ico` - Browser tab icon

### Generated Files (Auto-created by next-pwa)
- `public/sw.js` - Service Worker
- `public/workbox-*.js` - Workbox runtime files
- `.next/` - Build cache

## 🚀 How to Test PWA

### In Development
The PWA is disabled in development mode for easier debugging. To test:

1. Build for production:
```bash
npm run build
npm start
```

2. Open in browser: `http://localhost:3000`

3. Open DevTools > Application > Manifest
   - Verify manifest loads correctly
   - Check all icons are present

4. Open DevTools > Application > Service Workers
   - Verify service worker is registered
   - Check status shows "activated and running"

### Install PWA

#### On Desktop (Chrome/Edge)
1. Visit the site in production
2. Look for install icon in address bar
3. Click "Install" or use menu > "Install itsmycv.be"

#### On Mobile (Android)
1. Visit the site in Chrome
2. Tap menu (⋮) > "Add to Home Screen"
3. App icon appears on home screen

#### On Mobile (iOS)
1. Visit the site in Safari
2. Tap Share button
3. Tap "Add to Home Screen"

## 🧪 Testing Offline Functionality

1. Open the installed PWA
2. Open DevTools > Network
3. Check "Offline" checkbox
4. Refresh the page
5. You should see the offline page or cached content

## 🔧 Customization

### Update App Colors
Edit `public/manifest.json`:
```json
{
  "theme_color": "#ff007a",
  "background_color": "#ffffff"
}
```

### Update App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "App"
}
```

### Update Icons
1. Replace icons in `/public/` folder
2. Ensure sizes match: 192x192, 256x256, 384x384, 512x512
3. Rebuild the app

### Regenerate Icons
If you need to regenerate icons from the logo:
```bash
cd public
node generate-icons.js
```

## 📱 App Shortcuts

The PWA includes shortcuts to common features:
- Create CV - Quick access to CV creation
- My Dashboard - View dashboard

Edit shortcuts in `public/manifest.json`.

## 🔒 Security & HTTPS

PWAs require HTTPS in production. Vercel automatically provides HTTPS.

For local HTTPS testing:
```bash
npm install -g local-ssl-proxy
local-ssl-proxy --source 3001 --target 3000
```

Then visit `https://localhost:3001`

## 📊 PWA Audit

Check PWA quality using Lighthouse:
1. Open DevTools > Lighthouse
2. Select "Progressive Web App"
3. Click "Generate report"
4. Review and fix any issues

## 🐛 Troubleshooting

### Service Worker Not Updating
1. Clear browser cache
2. Unregister old service worker
3. Hard refresh (Ctrl+Shift+R)

### Icons Not Showing
1. Check file paths in manifest.json
2. Verify icons exist in /public
3. Check icon sizes are correct

### App Not Installable
1. Verify HTTPS is enabled
2. Check manifest.json is valid
3. Ensure all required icons are present
4. Check service worker is registered

## 📚 Additional Resources

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Web App Manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

## 🎯 Next Steps

1. Deploy to production (Vercel)
2. Test PWA installation on real devices
3. Monitor service worker performance
4. Add push notifications (future enhancement)
5. Implement background sync for forms
