'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ASSETS } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';
import { useAuth } from '@/context/AuthContext';

interface HeroProps {
    lang: Locale;
}

export default function Hero({ lang }: HeroProps) {
    const t = getTranslations(lang);
    const { isAuthenticated } = useAuth();
    const [currentLogo, setCurrentLogo] = useState(0);
    const logos = [
        ASSETS.logo,
        'https://res.cloudinary.com/docxvgl2f/image/upload/v1762921046/yourdigitalcv-logo-black_tec1du.svg',
        'https://res.cloudinary.com/docxvgl2f/image/upload/v1762921449/create-edit-transfer-logo-black_tffrar.svg'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLogo((prev) => (prev + 1) % logos.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [logos.length]);

    return (
        <section className="min-h-screen bg-white flex items-center overflow-hidden pt-20 sm:pt-24 pb-8 sm:pb-12 lg:pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                    {/* Left Side - Content */}
                    <div className="space-y-4 sm:space-y-5 lg:space-y-8 text-center lg:text-left">
                        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight rubik-mono-one-regular">
                                {t.hero.title}{' '}
                                <span className="text-black">{t.hero.titleHighlight}</span>
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 leading-relaxed">
                                <span className="text-[#ff007a] font-semibold">{t.hero.subtitle}</span> {t.hero.subtitleAnd} <span className="text-[#ff007a] font-semibold">{t.hero.subtitleTransfer}</span> {t.hero.subtitleEnd} <span className="text-[#ff007a] font-semibold">{t.hero.subtitleFree}</span>
                            </p>
                        </div>

                        <div className="flex justify-center lg:justify-start">
                            <Link
                                href={isAuthenticated ? `/${lang}/dashboard` : `/${lang}/auth`}
                                className="inline-flex items-center justify-center bg-[#ff007a] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-black hover:text-white hover:border-black transition-all touch-manipulation active:scale-95"
                            >
                                {isAuthenticated ? t.hero.dashboard : t.hero.getStarted}
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center justify-center lg:justify-start flex-wrap gap-3 sm:gap-4 lg:gap-8">
                            <div className="text-center min-w-[70px] sm:min-w-[80px]">
                                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">100%</div>
                                <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-0.5 sm:mt-1">{t.hero.trustSecure}</div>
                            </div>
                            <div className="text-center min-w-[70px] sm:min-w-[80px]">
                                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">1-Click</div>
                                <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-0.5 sm:mt-1">{t.hero.trustTransfer}</div>
                            </div>
                            <div className="text-center min-w-[70px] sm:min-w-[80px]">
                                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">🇧🇪</div>
                                <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-0.5 sm:mt-1">{t.hero.trustBelgian}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Logo */}
                    <div className="flex items-center justify-center order-first lg:order-last lg:justify-end w-full h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-[70vh]">
                        <div className="relative h-full flex items-center justify-center max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-none mx-auto">
                            <Image
                                src={logos[currentLogo]}
                                alt="itsmycv.be Logo"
                                width={500}
                                height={500}
                                className="relative z-10 h-full w-auto object-contain animate-logo-rotate"
                                priority
                                key={currentLogo}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
