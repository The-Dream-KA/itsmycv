# 🎉 Google OAuth Custom Domain Setup - SUCCESS!

## Problem Statement

When using Supabase's built-in Google OAuth, the Google consent screen displayed:
```
"to continue to zhqsfsqklskcvjqrpodn.supabase.co"
```

**We wanted:**
```
"to continue to itsmycv.be" ✅
```

## Why This Happened

Google displays the domain from the **OAuth initiator** (the service that starts the OAuth flow). Since Supabase initiates the OAuth request, Google shows Supabase's domain - not your custom domain.

## The Solution: Custom OAuth Proxy

Instead of using Supabase's OAuth flow, we created our own OAuth endpoints that:
1. **Initiate OAuth from YOUR domain** (`itsmycv.be`)
2. Handle the Google callback
3. Create a Supabase session after authentication

This way, Google sees YOUR domain and shows it to users!

---

## What We Built

### 1. OAuth Initiation Endpoint
**File:** `src/app/api/auth/google/route.ts`

This endpoint:
- Builds the Google OAuth URL directly
- Uses YOUR domain as the redirect URI
- Sends users to Google for authentication

```typescript
// Key parts:
redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`
// This is YOUR domain, not Supabase's!
```

### 2. OAuth Callback Handler
**File:** `src/app/api/auth/google/callback/route.ts`

This endpoint:
- Receives the OAuth code from Google
- Exchanges it for user tokens
- Gets user information from Google
- Creates a Supabase session
- Sets authentication cookies
- Redirects user to your app

### 3. Updated Auth Page
**File:** `src/app/[lang]/auth/page.tsx`

Changed from:
```typescript
// Old: Uses Supabase's OAuth (shows Supabase domain)
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
})
```

To:
```typescript
// New: Uses our custom OAuth (shows YOUR domain)
window.location.href = '/api/auth/google?redirectTo=/auth/callback'
```

---

## Configuration Steps

### 1. Google Cloud Console Setup

**Navigate to:** Google Cloud Console → APIs & Services → Credentials → Your OAuth Client

#### A. Authorized JavaScript Origins
```
http://localhost:3000           (for local testing)
https://itsmycv.be             (for production)
```

#### B. Authorized Redirect URIs
```
http://localhost:3000/api/auth/google/callback    (local)
https://itsmycv.be/api/auth/google/callback       (production)
```

**❌ REMOVED:** `https://zhqsfsqklskcvjqrpodn.supabase.co/auth/v1/callback`

#### C. Authorized Domains (Branding Page)
```
itsmycv.be   (ONLY THIS ONE!)
```

This is the domain Google will show users: **"to continue to itsmycv.be"** ✅

### 2. Environment Variables

**Local (.env.local):**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Production (Vercel):**
```env
NEXT_PUBLIC_SITE_URL=https://itsmycv.be
# (same Google credentials)
# (same Supabase credentials)
```

### 3. Vercel Domain Configuration

- Primary domain: `itsmycv.be` ✅
- Alias: `www.itsmycv.be` ✅
- Both properly configured and verified

---

## How It Works - The Flow

### User Authentication Flow

```mermaid
User clicks "Sign in with Google"
        ↓
Redirects to: /api/auth/google
        ↓
Redirects to: Google OAuth
(Shows: "to continue to itsmycv.be" ✅)
        ↓
User selects Google account
        ↓
Google redirects to: /api/auth/google/callback
        ↓
Exchange code for tokens
        ↓
Get user info from Google
        ↓
Create Supabase session
        ↓
Set auth cookies
        ↓
Redirect to app (authenticated!)
```

---

## Key Benefits

✅ **Custom Branding:** Users see YOUR domain, not Supabase's  
✅ **No Pro Plan Needed:** No need for Supabase custom domain (saves $25/month)  
✅ **Full Control:** You control the entire OAuth flow  
✅ **Same Security:** Still uses Supabase for session management  
✅ **Better UX:** Professional appearance for users  

---

## Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000/en/auth`
3. Click "Sign in with Google"
4. ✅ Should see: "to continue to itsmycv.be"

### Production Testing
1. Deploy to Vercel
2. Go to: `https://itsmycv.be/en/auth`
3. Click "Sign in with Google"
4. ✅ Should see: "to continue to itsmycv.be"

---

## Files Created/Modified

### New Files ✨
- `src/app/api/auth/google/route.ts` - OAuth initiation
- `src/app/api/auth/google/callback/route.ts` - OAuth callback handler
- `public/auth/index.html` - Standalone auth page (alternative)
- `public/auth/callback.html` - Standalone callback page (alternative)
- `public/auth/README.md` - Standalone auth documentation

### Modified Files 🔧
- `src/app/[lang]/auth/page.tsx` - Updated to use custom OAuth endpoint

---

## Important Notes

### 🔒 Security
- The service role key is used server-side only (never exposed to client)
- OAuth secrets are kept secure in environment variables
- Tokens are exchanged server-side, never in the browser

### 🚀 Deployment
- Make sure to set `NEXT_PUBLIC_SITE_URL=https://itsmycv.be` in Vercel
- All environment variables must be set in Vercel dashboard
- Redeploy after updating environment variables

### 🐛 Troubleshooting
If you get "redirect_uri_mismatch":
1. Check that Google Console redirect URIs match exactly
2. Verify `NEXT_PUBLIC_SITE_URL` is correct
3. Make sure there are no trailing slashes

If authentication fails:
1. Check Google Console credentials are correct
2. Verify Supabase service role key is valid
3. Check browser console for errors

---

## Alternative: Standalone Auth Pages

We also created standalone HTML pages that can be hosted separately:
- `public/auth/index.html` - Can be deployed to `auth.itsmycv.be`
- Uses CDN for Supabase JS
- No build process needed
- Fully self-contained

---

## Success Criteria - ALL MET! ✅

- [x] Google consent screen shows "to continue to itsmycv.be"
- [x] Authentication works locally
- [x] Authentication works in production
- [x] Users are properly authenticated in Supabase
- [x] Session persists across page reloads
- [x] No Supabase Pro plan required
- [x] Professional appearance maintained

---

## Credits

**Solution Date:** November 16, 2025  
**Problem:** Supabase domain shown in Google OAuth  
**Solution:** Custom OAuth proxy through our own domain  
**Result:** Perfect branding with "itsmycv.be" ✅

---

## Quick Reference

### Start Local Development
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Test Auth Flow
```bash
# Open browser to:
http://localhost:3000/en/auth
```

### Deploy to Production
```bash
git push origin main
# Vercel auto-deploys
```

---

## What Makes This Solution Special

🎯 **No compromises:** Full custom branding without expensive Pro plans  
🔧 **Complete control:** You own the OAuth flow  
🚀 **Production-ready:** Secure, tested, and working  
💰 **Cost-effective:** Free tier Supabase is enough  
📱 **Works everywhere:** Local, staging, production  

---

**🎉 MISSION ACCOMPLISHED! 🎉**

Your users now see "to continue to itsmycv.be" instead of the Supabase domain!
