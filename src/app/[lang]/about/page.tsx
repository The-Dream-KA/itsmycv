'use client';

import { use } from 'react';
import Link from 'next/link';
import { Target, Users, Shield, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

export default function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = use(params);
    const t = getTranslations(lang);

    const values = [
        {
            icon: <Target className="w-8 h-8" />,
            title: t.about.mission.title,
            description: t.about.mission.description
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: t.about.userCentric.title,
            description: t.about.userCentric.description
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: t.about.privacy.title,
            description: t.about.privacy.description
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: t.about.innovation.title,
            description: t.about.innovation.description
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />

            {/* Hero Section */}
            <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 sm:space-y-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black px-2">
                            {t.about.title} <span className="text-[#ff007a]">itsmycv.be</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                            {t.about.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-6">
                            {t.about.story.title}
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                            <p>
                                {t.about.story.description}
                            </p>
                            <p>
                                {t.about.solution.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4 px-2">
                            {t.about.belgian.title}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            {t.about.belgian.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#ff007a] transition-all"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ff007a]/10 rounded-full flex items-center justify-center text-[#ff007a] mb-3 sm:mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-[#ff007a] to-[#cc0062] rounded-3xl p-8 lg:p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            {t.about.cta.title}
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            {t.about.cta.description}
                        </p>
                        <Link
                            href={`/${lang}`}
                            className="inline-flex items-center justify-center bg-white text-[#ff007a] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
                        >
                            {t.about.cta.button}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer lang={lang} />
        </div>
    );
}
