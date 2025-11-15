import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BottomCTAProps {
    href: string;
    label: string;
}

export default function BottomCTA({ href, label }: BottomCTAProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <Link
                    href={href}
                    className="inline-flex items-center text-[#ff007a] hover:text-black font-semibold text-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {label}
                </Link>
            </div>
        </div>
    );
}
