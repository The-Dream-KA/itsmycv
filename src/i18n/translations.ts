import { Locale } from './config';
import { enWithPosts } from './locales/en';
import { frWithPosts } from './locales/fr';
import { nlWithPosts } from './locales/nl';

export const translations = {
    en: enWithPosts,
    fr: frWithPosts,
    nl: nlWithPosts,
} as const;

// Helper function to get translations
export function getTranslations(locale: Locale) {
    return translations[locale] || translations.en;
}
