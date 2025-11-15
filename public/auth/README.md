# Auth Subdomain Setup

This folder contains standalone authentication pages designed to be hosted at `auth.itsmycv.be`.

## Files

- `index.html` - Main sign-in page
- `callback.html` - OAuth callback handler
- `README.md` - This file

## Deployment Options

### Option 1: Deploy to Vercel/Netlify as Separate Project

1. Create a new project in Vercel/Netlify
2. Point it to this `public/auth` folder
3. Set custom domain to `auth.itsmycv.be`
4. Deploy

### Option 2: Use Next.js Rewrites (Recommended)

Add to your `next.config.ts`:

```typescript
async rewrites() {
  return [
    {
      source: '/auth',
      destination: '/auth/index.html',
    },
    {
      source: '/auth/callback',
      destination: '/auth/callback.html',
    },
  ];
},
```

Then configure your DNS:
- Add CNAME record: `auth.itsmycv.be` → your Vercel/Netlify domain
- Configure domain in your hosting platform

### Option 3: Cloudflare Pages

1. Create a new Cloudflare Pages project
2. Upload these files
3. Set custom domain to `auth.itsmycv.be`

## Google OAuth Configuration

Update your Google OAuth Client settings:

**Authorized JavaScript origins:**
- `https://auth.itsmycv.be`

**Authorized redirect URIs:**
- `https://auth.itsmycv.be/auth/callback.html`
- `https://zhqsfsqklskcvjqrpodn.supabase.co/auth/v1/callback` (keep for Supabase)

**Authorized domains (in Branding):**
- `itsmycv.be` (first - users will see this)
- `auth.itsmycv.be`
- `zhqsfsqklskcvjqrpodn.supabase.co`

## Environment Variables

Update the JavaScript constants in both HTML files:

```javascript
const SUPABASE_URL = 'https://zhqsfsqklskcvjqrpodn.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

## Testing Locally

You can test these pages locally:

```bash
# Using Python
cd public/auth
python -m http.server 8080

# Using Node.js
npx serve public/auth

# Using PHP
php -S localhost:8080 -t public/auth
```

Then visit: `http://localhost:8080`

## Features

- ✅ Clean, professional design
- ✅ Google OAuth sign-in
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback
- ✅ Mobile responsive
- ✅ No dependencies (uses CDN for Supabase)
- ✅ Works as standalone pages

## Customization

You can easily customize the colors, branding, and redirect URLs in the HTML files. Look for:

- Color scheme (CSS variables)
- Logo and branding text
- Redirect URLs after sign-in
- Error messages
