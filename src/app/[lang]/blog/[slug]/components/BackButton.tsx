import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    href: string;
    label: string;
}

export default function BackButton({ href, label }: BackButtonProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Link
                href={href}
                className="inline-flex items-center text-gray-600 hover:text-[#ff007a] font-medium transition-colors mb-6"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {label}
            </Link>
        </div>
    );
}
