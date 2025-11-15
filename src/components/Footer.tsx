'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Mail, Facebook } from 'lucide-react';
import { ASSETS, APP_CONFIG, SOCIAL_LINKS } from '@/lib/constants';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

export default function Footer({ lang }: { lang?: Locale }) {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();
    const router = useRouter();

    // Extract current language from pathname or use prop
    const currentLang = lang || (pathname.split('/')[1] as Locale) || 'en';
    const t = getTranslations(currentLang);

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'fr', label: 'FR' },
        { code: 'nl', label: 'NL' }
    ];

    const handleLanguageChange = (langCode: string) => {
        const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '');
        router.push(`/${langCode}${pathWithoutLang || ''}`);
    };

    const footerLinks = {
        platform: [
            { label: t.footer.platform.forMe, href: '#for-me' },
            { label: t.footer.platform.forBusiness, href: '#for-business' },
            { label: t.footer.platform.features, href: '#services' }
        ],
        company: [
            { label: t.footer.company.about, href: `/${currentLang}/about` },
            { label: t.footer.company.blog, href: `/${currentLang}/blog` }
        ],
        legal: [
            { label: t.footer.legal.privacy, href: `/${currentLang}/privacy` },
            { label: t.footer.legal.terms, href: `/${currentLang}/terms` },
            { label: t.footer.legal.cookies, href: `/${currentLang}/cookies` },
            { label: t.footer.legal.gdpr, href: `/${currentLang}/gdpr` }
        ],
        support: [
            { label: t.footer.support.faq, href: `/${currentLang}/faq` },
            { label: t.footer.support.contact, href: `/${currentLang}/support` }
        ]
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 xl:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        <Link href="/">
                            <Image
                                src={ASSETS.logo}
                                alt="itsmycv.be"
                                width={120}
                                height={40}
                                className="h-10 sm:h-12 w-auto"
                            />
                        </Link>
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-xs">
                            {t.footer.description}
                        </p>
                        <div className="flex items-center space-x-3">
                            <a
                                href={SOCIAL_LINKS.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#ff007a] transition-colors p-1"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a
                                href={SOCIAL_LINKS.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#ff007a] transition-colors p-1"
                                aria-label="X (Twitter)"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href={SOCIAL_LINKS.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#ff007a] transition-colors p-1"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={`mailto:${APP_CONFIG.email}`}
                                className="text-gray-400 hover:text-[#ff007a] transition-colors p-1"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t.footer.platform.title}</h3>
                        <ul className="space-y-3">
                            {footerLinks.platform.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-[#ff007a] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t.footer.company.title}</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-[#ff007a] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t.footer.support.title}</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-[#ff007a] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t.footer.legal.title}</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-[#ff007a] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-6 sm:pt-8">
                    {/* Bottom Section: copyright left, languages right on sm+ */}
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
                        {/* Copyright */}
                        <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                            © {currentYear} {APP_CONFIG.domain}. {t.footer.copyright}
                        </div>

                        {/* Language selector (only) */}
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                                {languages.map((lang, index) => (
                                    <div key={lang.code} className="flex items-center">
                                        <button
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`hover:text-[#ff007a] transition-colors p-2 touch-manipulation ${currentLang === lang.code ? 'text-[#ff007a] font-semibold' : ''}`}
                                        >
                                            {lang.label}
                                        </button>
                                        {index < languages.length - 1 && <span className="mx-1">/</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
