import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Locale } from '@/i18n/config';

interface ComingSoonViewProps {
    lang: Locale;
    backLabel: string;
    title: string;
    description: string;
}

export default function ComingSoonView({ lang, backLabel, title, description }: ComingSoonViewProps) {
    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />
            <div className="pt-24 pb-12 text-center">
                <h1 className="text-3xl font-bold text-black mb-4">{title}</h1>
                <p className="text-gray-600 mb-6">{description}</p>
                <Link
                    href={`/${lang}/blog`}
                    className="inline-flex items-center text-[#ff007a] hover:text-black font-semibold"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {backLabel}
                </Link>
            </div>
            <Footer lang={lang} />
        </div>
    );
}
