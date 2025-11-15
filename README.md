# itsmycv.be - Your CV in Your Pocket 📱

A Digital CV/Portfolio Identity Platform built with Next.js and Supabase. Instant, secure, and transferable for Belgian users.

## ✨ Features

- 🚀 **Progressive Web App (PWA)** - Install on any device, works offline
- 📱 **Mobile-First Design** - Responsive and touch-friendly
- 🔒 **Secure** - Data encrypted and GDPR compliant
- 🇧🇪 **Multi-Language** - English, French, and Dutch support
- ⚡ **Lightning Fast** - Optimized with Next.js 16 and Turbopack

## 🚀 Getting Started

### Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build

Build and run the production version:

```bash
npm run build
npm start
```

The production build includes PWA functionality with service workers.

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout with PWA metadata
│   │   ├── page.tsx      # Landing page
│   │   └── offline/      # Offline fallback page
│   ├── components/       # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   └── Footer.tsx
│   └── lib/             # Utility functions
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker (auto-generated)
│   └── icons/          # PWA icons
└── prisma/             # Database schema
```

## 🎨 Design

- **Primary Color**: `#ff007a` (Pink)
- **Typography**: Geist Sans & Geist Mono
- **Logo**: [View on Cloudinary](https://res.cloudinary.com/docxvgl2f/image/upload/v1762906548/itsmycv_mtrcbq.png)

See [DESIGN.md](./DESIGN.md) for full design documentation.

## 🔧 PWA Setup

This app is a fully functional Progressive Web App. See [PWA_README.md](./PWA_README.md) for detailed PWA documentation.

### PWA Features

- ✅ Offline support
- ✅ Install to home screen
- ✅ App-like experience
- ✅ Fast loading with caching
- ✅ Auto-updates

### Regenerate PWA Icons

If you need to regenerate the PWA icons:

```bash
npm run generate-icons
```

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA**: @ducanh2912/next-pwa
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js
- **Image Processing**: Sharp
- **Deployment**: Vercel

## 📦 Scripts

```bash
npm run dev              # Start development server with Turbopack
npm run build           # Build for production (with webpack for PWA)
npm start               # Start production server
npm run lint            # Run ESLint
npm run generate-icons  # Generate PWA icons from logo
```

## 🌐 Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## 📚 Documentation

- [CONTEXT.md](./CONTEXT.md) - Full project context and features
- [DESIGN.md](./DESIGN.md) - UI/UX design guidelines
- [PWA_README.md](./PWA_README.md) - PWA implementation details
- [PWA_BUILD_SUCCESS.md](./PWA_BUILD_SUCCESS.md) - Build status and testing

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

Vercel will automatically:
1. Install dependencies
2. Build with webpack (for PWA support)
3. Generate service workers
4. Deploy with HTTPS

### Environment Setup

Configure environment variables in Vercel:
- Dashboard → Settings → Environment Variables
- Add all variables from `.env.local`

## 🧪 Testing PWA

After building for production:

1. Visit `http://localhost:3000`
2. Open DevTools → Application
3. Check "Manifest" and "Service Workers"
4. Try installing the app
5. Test offline mode

## 📄 License

Private project - All rights reserved

## 👥 Contributors

Built for Belgian professionals seeking modern CV management.

---

**Made with ❤️ in Belgium 🇧🇪**


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
