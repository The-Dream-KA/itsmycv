/**
 * Translation type definitions
 * Automatically inferred from the English translations
 */

import type { enWithPosts } from './locales/en';

// Infer the translation structure type from English translations
export type TranslationStructure = typeof enWithPosts;

// Type for individual sections
export type NavbarTranslations = TranslationStructure['navbar'];
export type HeroTranslations = TranslationStructure['hero'];
export type PainsTranslations = TranslationStructure['pains'];
export type ServicesTranslations = TranslationStructure['services'];
export type FooterTranslations = TranslationStructure['footer'];
export type AboutTranslations = TranslationStructure['about'];
export type FaqTranslations = TranslationStructure['faq'];
export type BlogTranslations = TranslationStructure['blog'];
export type SupportTranslations = TranslationStructure['support'];
export type ComingSoonTranslations = TranslationStructure['comingSoon'];

// Helper type for getting nested translation keys
export type TranslationKeys = keyof TranslationStructure;
export type NestedTranslationKeys<T extends TranslationKeys> = keyof TranslationStructure[T];
