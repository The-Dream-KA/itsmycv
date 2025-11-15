import Link from 'next/link';

interface CTASectionProps {
    lang: string;
    title: string;
    description: string;
    buttonText: string;
}

export default function CTASection({ lang, title, description, buttonText }: CTASectionProps) {
    return (
        <div className="bg-black text-white rounded-2xl p-8 my-12 text-center">
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                {description}
            </p>
            <Link
                href={`/${lang}/coming-soon`}
                className="inline-flex items-center justify-center bg-[#ff007a] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-colors border-2 border-[#ff007a]"
            >
                {buttonText}
            </Link>
        </div>
    );
}
