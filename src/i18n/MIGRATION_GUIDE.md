# Migration Guide: New Translation Structure

## 🔄 What Changed?

The massive 1,495-line `translations.ts` file has been split into multiple organized files by language and section. **The functionality remains 100% the same** - only the file structure changed.

## ✅ No Code Changes Required

Your existing code will continue to work without any modifications:

```typescript
// This still works exactly the same
import { translations, getTranslations } from '@/i18n/translations';

const t = getTranslations('en');
console.log(t.navbar.forMe); // "For me"
```

## 📁 New File Structure

```
src/i18n/
├── translations.ts       ← Main import (still works the same!)
├── config.ts            ← No changes
├── types.ts             ← NEW: Type definitions
├── README.md            ← NEW: Documentation
└── locales/             ← NEW: Organized translations
    ├── en/              ← English translations
    ├── fr/              ← French translations
    └── nl/              ← Dutch translations
```

## 🎯 For Developers: How to Edit Translations

### Old Way (Before)
```typescript
// Had to scroll through 1,495 lines to find navbar translations
// Line 5-10: navbar
// Line 50-100: hero
// Line 500-800: blog
// ...
```

### New Way (After)
```typescript
// 1. Go to the appropriate locale folder
src/i18n/locales/en/

// 2. Open the specific section file
navbar.ts       ← For navigation translations
hero.ts         ← For hero section
footer.ts       ← For footer
blog-posts/     ← For blog content
```

## 📝 Common Tasks

### Task 1: Update English Navbar Text
**File**: `src/i18n/locales/en/navbar.ts`
```typescript
export const navbar = {
    forMe: 'For me',          ← Edit this
    forBusiness: 'For my business',
    // ...
} as const;
```

### Task 2: Update French Footer
**File**: `src/i18n/locales/fr/footer.ts`
```typescript
export const footer = {
    description: 'Votre CV numérique...',  ← Edit this
    // ...
} as const;
```

### Task 3: Add New Blog Post
1. **Create file**: `src/i18n/locales/en/blog-posts/my-new-post.ts`
2. **Export content**:
   ```typescript
   export const myNewPost = {
       title: 'My New Post',
       excerpt: 'Description...',
       // ...
   } as const;
   ```
3. **Import in** `src/i18n/locales/en/blog-posts/index.ts`:
   ```typescript
   import { myNewPost } from './my-new-post';
   
   export const blogPosts = {
       // existing posts...
       'my-new-post': myNewPost,
   } as const;
   ```

### Task 4: Add New Section to All Languages
1. Create `en/my-section.ts`, `fr/my-section.ts`, `nl/my-section.ts`
2. Add translations to each file
3. Import in each locale's `index.ts`
4. That's it! Auto-typed and ready to use.

## 🔍 Finding Translations

### By Section
- **Navbar**: `locales/{lang}/navbar.ts`
- **Hero**: `locales/{lang}/hero.ts`
- **Footer**: `locales/{lang}/footer.ts`
- **FAQ**: `locales/{lang}/faq.ts`
- **Blog Posts**: `locales/{lang}/blog-posts/`
- **Support**: `locales/{lang}/support.ts`

### By Language
- **English**: `locales/en/`
- **French**: `locales/fr/`
- **Dutch**: `locales/nl/`

## 💡 Pro Tips

### Tip 1: Use IDE Search
Instead of scrolling, use your IDE's file search (Ctrl+P / Cmd+P):
- Type "navbar.ts" → See all navbar files
- Type "en/" → See all English files
- Type "blog-posts/" → See all blog content

### Tip 2: Edit Multiple Languages at Once
Open files side-by-side:
- `en/navbar.ts`
- `fr/navbar.ts`
- `nl/navbar.ts`

Edit all at once to keep translations in sync!

### Tip 3: Use Types for Safety
```typescript
import type { NavbarTranslations } from '@/i18n/types';

// TypeScript ensures your translation matches the structure
const myNavbar: NavbarTranslations = {
    forMe: 'For me',
    forBusiness: 'For my business',
    // TypeScript will error if you miss a required field!
};
```

## ⚠️ Important Notes

### DO ✅
- ✅ Edit files in `locales/{lang}/` folders
- ✅ Keep `as const` at the end of exports (for types)
- ✅ Import new sections in `index.ts` files
- ✅ Test all languages after changes

### DON'T ❌
- ❌ Don't edit the main `translations.ts` (it's just imports)
- ❌ Don't remove `as const` (breaks type safety)
- ❌ Don't forget to update all 3 languages (en, fr, nl)
- ❌ Don't mix translation keys across sections

## 🐛 Troubleshooting

### Error: "Cannot find module './locales/en'"
**Solution**: Make sure all locale folders exist and have `index.ts` files.

### Error: "Property 'navbar' does not exist"
**Solution**: Check that the section is imported in `locales/{lang}/index.ts`.

### Error: "Module has no exported member 'enWithPosts'"
**Solution**: Check that `locales/en/index.ts` exports `enWithPosts`.

### Translations not updating
**Solution**: 
1. Clear your Next.js cache: `npm run dev` (restart)
2. Check you edited the correct language file
3. Verify the import chain (section → locale index → main translations.ts)

## 📞 Questions?

See the detailed documentation in `src/i18n/README.md` or ask the team!

---

**Summary**: Same functionality, better organization. Edit specific files instead of scrolling through 1,495 lines! 🎉
