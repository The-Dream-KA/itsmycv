import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

export default async function ComingSoon({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const t = getTranslations(lang);

    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />
            <main className="min-h-screen pt-16 flex items-center justify-center px-4">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 sm:mb-6 rubik-mono-one-regular leading-tight">
                        {t.comingSoon.title}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 px-2">
                        {t.comingSoon.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="cursor-default">
                            <Image
                                src="https://res.cloudinary.com/docxvgl2f/image/upload/v1762922279/Store_Google_Play_Type_Dark_Language_English_dvv7ka.svg"
                                alt="Get it on Google Play"
                                width={180}
                                height={54}
                                className="h-12 sm:h-14 w-auto"
                            />
                        </div>

                        <div className="cursor-default">
                            <Image
                                src="https://res.cloudinary.com/docxvgl2f/image/upload/v1762922278/Component_2_czb9fl.svg"
                                alt="Download on App Store"
                                width={180}
                                height={54}
                                className="h-12 sm:h-14 w-auto"
                            />
                        </div>
                    </div>

                    <Link
                        href={`/${lang}`}
                        className="inline-flex items-center justify-center bg-[#ff007a] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg border-2 border-black hover:bg-black hover:text-white hover:border-black transition-all touch-manipulation active:scale-95"
                    >
                        {t.comingSoon.backToHome}
                    </Link>
                </div>
            </main>
            <Footer lang={lang} />
        </div>
    );
}
