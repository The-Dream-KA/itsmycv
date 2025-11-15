'use client';

import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

export default function Pains({ lang }: { lang: Locale }) {
    const t = getTranslations(lang);

    const painCards = [
        {
            title: t.pains.pain1.title,
            points: [
                t.pains.pain1.point1,
                t.pains.pain1.point2,
                t.pains.pain1.point3
            ]
        },
        {
            title: t.pains.pain2.title,
            points: [
                t.pains.pain2.point1,
                t.pains.pain2.point2,
                t.pains.pain2.point3
            ]
        },
        {
            title: t.pains.pain3.title,
            points: [
                t.pains.pain3.point1,
                t.pains.pain3.point2,
                t.pains.pain3.point3
            ]
        }
    ];

    return (
        <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden bg-black">
            {/* White Grid Background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, white 1px, transparent 1px),
                        linear-gradient(to bottom, white 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16 rubik-mono-one-regular px-2">
                    {t.pains.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
                    {painCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-[#ff003b] rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center space-y-4 sm:space-y-6"
                        >
                            <div className="bg-white rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] px-4 sm:px-6 py-3 sm:py-4 min-h-[100px] sm:min-h-[120px] lg:h-32 flex items-center justify-center w-full">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black leading-tight">
                                    {card.title}
                                </h3>
                            </div>
                            <ul className="space-y-2 sm:space-y-3 w-full text-left">
                                {card.points.map((point, pointIndex) => (
                                    <li key={pointIndex} className="flex items-start text-white text-sm sm:text-base lg:text-lg">
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        <span className="leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
