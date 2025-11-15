import { APP_CONFIG } from '@/lib/constants';
import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

export default function Services({ lang }: { lang: Locale }) {
    const t = getTranslations(lang);

    const services = [
        {
            title: t.services.service1.title,
            features: [
                t.services.service1.feature1,
                t.services.service1.feature2,
                t.services.service1.feature3,
                t.services.service1.feature4,
                t.services.service1.feature5,
                t.services.service1.feature6,
                t.services.service1.feature7,
                t.services.service1.feature8
            ]
        },
        {
            title: t.services.service2.title,
            features: [
                t.services.service2.feature1,
                t.services.service2.feature2,
                t.services.service2.feature3,
                t.services.service2.feature4,
                t.services.service2.feature5,
                t.services.service2.feature6
            ]
        },
        {
            title: t.services.service3.title,
            features: [
                t.services.service3.feature1,
                t.services.service3.feature2,
                t.services.service3.feature3,
                t.services.service3.feature4,
                t.services.service3.feature5,
                t.services.service3.feature6
            ]
        }
    ];

    return (
        <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white">
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4 rubik-mono-one-regular px-2">
                        {t.services.title} <span className="text-[#ff007a]">{APP_CONFIG.domain}</span>?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-800 max-w-2xl mx-auto px-4">
                        {t.services.subtitle}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-[#96ff70] rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center space-y-4 sm:space-y-6"
                        >
                            <div className="bg-white rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 min-h-[100px] sm:min-h-[120px] lg:h-32 flex items-center justify-center w-full">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black leading-tight">
                                    {service.title}
                                </h3>
                            </div>
                            <ul className="space-y-2 sm:space-y-3 w-full text-left">
                                {service.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start text-black text-sm sm:text-base">
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 text-black mr-2 sm:mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gray-50 px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl border border-gray-200">
                        <span className="text-base sm:text-lg font-medium text-gray-700 text-center sm:text-left">
                            {t.services.cta.ready}
                        </span>
                        <Link
                            href={`/${lang}/signup`}
                            className="bg-[#ff007a] hover:bg-black text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-colors touch-manipulation active:scale-95"
                        >
                            {t.services.cta.button}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
