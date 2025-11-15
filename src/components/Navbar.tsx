'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, ChevronDown, Menu, X } from 'lucide-react';
import { ASSETS } from '@/lib/constants';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

export default function Navbar({ lang }: { lang: Locale }) {
    const t = getTranslations(lang);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', name: 'English', display: 'EN' },
        { code: 'fr', name: 'Français', display: 'FR' },
        { code: 'nl', name: 'Nederlands', display: 'NL' }
    ];

    const currentLanguage = languages.find(l => l.code === lang) || languages[0];

    // Close dropdown and mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleLanguageSelect = (langCode: string) => {
        setIsLanguageDropdownOpen(false);

        // Get the current path without the language prefix
        const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '');

        // Navigate to the new language path
        router.push(`/${langCode}${pathWithoutLang || ''}`);
    };

    const getNavLinkClass = (path: string, isMobile: boolean = false) => {
        const baseClass = isMobile
            ? 'text-sm text-white hover:text-white transition-colors font-medium relative'
            : 'text-white hover:text-white transition-colors font-medium relative';
        const activeClass = pathname === `/${lang}${path}`
            ? 'after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-white text-white'
            : '';
        return `${baseClass} ${activeClass}`;
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#ff007a] backdrop-blur-sm border-b border-[#cc0062]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href={`/${lang}`} className="flex items-center space-x-2">
                                <Image
                                    src="https://res.cloudinary.com/docxvgl2f/image/upload/v1763148541/itsmycv-logo-black_pqgk4y.svg"
                                    alt="itsmycv.be"
                                    width={100}
                                    height={33}
                                    className="h-8 sm:h-10 w-auto"
                                    priority
                                />
                                <span className="text-lg sm:text-xl font-bold text-white">itsmycv</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-6">
                            <Link
                                href={`/${lang}`}
                                className={getNavLinkClass('')}
                            >
                                {t.navbar.forMe}
                            </Link>
                            <Link
                                href={`/${lang}/for-business`}
                                className={getNavLinkClass('/for-business')}
                            >
                                {t.navbar.forBusiness}
                            </Link>
                            <div className="text-white">|</div>
                            <Link
                                href={`/${lang}/coming-soon`}
                                className={getNavLinkClass('/coming-soon')}
                            >
                                {t.navbar.comingSoon}
                            </Link>
                            <div className="text-white">|</div>
                            <Link
                                href={`/${lang}/blog`}
                                className={getNavLinkClass('/blog')}
                            >
                                {t.navbar.blog}
                            </Link>
                        </div>

                        {/* Right Side - Language & CTA */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Language Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors min-w-[60px] sm:min-w-[80px] justify-center"
                                    aria-label="Select language"
                                >
                                    <span className="text-xs sm:text-sm font-medium text-white">{currentLanguage.display}</span>
                                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-white transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isLanguageDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-xl border-2 border-gray-200 overflow-hidden z-50">
                                        {languages.map((language) => (
                                            <button
                                                key={language.code}
                                                onClick={() => handleLanguageSelect(language.code)}
                                                className={`w-full text-left px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm transition-colors flex items-center justify-between ${lang === language.code
                                                    ? 'bg-[#ff007a]/20 text-[#ff007a] font-semibold'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="font-bold">{language.display}</span>
                                                <span className="text-xs sm:text-sm">{language.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Get Started Button - Desktop */}
                            <Link
                                href={`/${lang}/signup`}
                                className="hidden sm:inline-flex bg-black hover:bg-white text-white hover:text-black px-4 sm:px-6 py-2 rounded-full font-medium transition-colors shadow-sm border-2 border-black text-sm"
                            >
                                {t.navbar.getStarted}
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="fixed top-16 left-0 right-0 bg-[#ff007a] border-b border-[#cc0062] shadow-xl">
                        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
                            <Link
                                href={`/${lang}`}
                                className="block text-white hover:text-black hover:bg-white/10 px-4 py-3 rounded-lg font-medium text-base transition-colors"
                            >
                                {t.navbar.forMe}
                            </Link>
                            <Link
                                href={`/${lang}/for-business`}
                                className="block text-white hover:text-black hover:bg-white/10 px-4 py-3 rounded-lg font-medium text-base transition-colors"
                            >
                                {t.navbar.forBusiness}
                            </Link>
                            <Link
                                href={`/${lang}/coming-soon`}
                                className="block text-white hover:text-black hover:bg-white/10 px-4 py-3 rounded-lg font-medium text-base transition-colors"
                            >
                                {t.navbar.comingSoon}
                            </Link>
                            <Link
                                href={`/${lang}/blog`}
                                className="block text-white hover:text-black hover:bg-white/10 px-4 py-3 rounded-lg font-medium text-base transition-colors"
                            >
                                {t.navbar.blog}
                            </Link>
                            <div className="pt-4 border-t border-white/20">
                                <Link
                                    href={`/${lang}/signup`}
                                    className="block text-center bg-black text-white px-4 py-3 rounded-full font-semibold text-base hover:bg-white hover:text-black border-2 border-black transition-colors"
                                >
                                    {t.navbar.getStarted}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
