# Translations Structure

This directory contains all internationalization (i18n) translations for the itsmycv application, organized in a scalable and maintainable structure.

## Directory Structure

```
i18n/
├── config.ts                 # i18n configuration (supported locales)
├── translations.ts           # Main translations export
├── types.ts                  # TypeScript type definitions
└── locales/                  # Locale-specific translations
    ├── en/                   # English translations
    │   ├── index.ts          # Main English export
    │   ├── navbar.ts         # Navigation translations
    │   ├── hero.ts           # Hero section
    │   ├── pains.ts          # Pain points section
    │   ├── services.ts       # Services section
    │   ├── footer.ts         # Footer translations
    │   ├── about.ts          # About page
    │   ├── faq.ts            # FAQ page
    │   ├── blog.ts           # Blog metadata
    │   ├── support.ts        # Support page
    │   ├── coming-soon.ts    # Coming soon page
    │   └── blog-posts/       # Blog post content
    │       ├── index.ts
    │       ├── digital-cv-future.ts
    │       ├── cv-tips-2025.ts
    │       └── other-posts.ts
    ├── fr/                   # French translations (same structure)
    │   └── ...
    └── nl/                   # Dutch translations (same structure)
        └── ...
```

## Features

- ✅ **Modular Structure**: Each section has its own file
- ✅ **Type-Safe**: Full TypeScript support with type inference
- ✅ **Scalable**: Easy to add new languages or sections
- ✅ **Maintainable**: Small, focused files instead of one large file
- ✅ **Professional**: Clear organization by feature and locale
- ✅ **DRY**: No code duplication across translations

## Usage

### Importing Translations

```typescript
import { translations, getTranslations } from '@/i18n/translations';

// Get all translations for a locale
const t = getTranslations('en');

// Access specific sections
console.log(t.navbar.forMe); // "For me"
console.log(t.hero.title); // "Your CV in Your"
```

### Adding a New Section

1. Create a new file in each locale directory: `en/new-section.ts`, `fr/new-section.ts`, `nl/new-section.ts`
2. Export a const with your translations:
   ```typescript
   export const newSection = {
       title: 'My Title',
       description: 'My Description',
   } as const;
   ```
3. Import and add to the locale's `index.ts`:
   ```typescript
   import { newSection } from './new-section';
   
   export const en = {
       // ... other sections
       newSection,
   } as const;
   ```

### Adding a New Language

1. Create a new directory: `locales/de/` (for German, for example)
2. Copy the structure from `en/`
3. Translate all content
4. Add to `config.ts`:
   ```typescript
   export const locales = ['en', 'fr', 'nl', 'de'] as const;
   ```
5. Import and export in `translations.ts`:
   ```typescript
   import { deWithPosts } from './locales/de';
   
   export const translations = {
       en: enWithPosts,
       fr: frWithPosts,
       nl: nlWithPosts,
       de: deWithPosts,
   } as const;
   ```

## Type Safety

All translations are fully typed using TypeScript's `as const` assertion. This provides:

- **Autocomplete**: IDE suggestions for all translation keys
- **Type Checking**: Compile-time errors for missing or incorrect keys
- **Refactoring Safety**: Easy to rename or restructure

```typescript
import type { TranslationStructure, NavbarTranslations } from '@/i18n/types';

// Types are automatically inferred
const navbar: NavbarTranslations = t.navbar;
```

## Best Practices

1. **Keep files small**: Each file should contain translations for one logical section
2. **Use consistent naming**: File names should match the section they represent
3. **Add comments**: Document complex translation structures
4. **Test all locales**: Ensure all translations have the same structure
5. **Use const assertions**: Always end exports with `as const` for type safety

## Migration Notes

This structure replaces the previous single large `translations.ts` file (1495 lines) with:
- **3 locale directories** (en, fr, nl)
- **~15 files per locale** (navbar, hero, pains, services, etc.)
- **Much smaller, focused files** (typically 20-100 lines each)

The functionality remains **100% the same** - only the organization has changed for better maintainability.
