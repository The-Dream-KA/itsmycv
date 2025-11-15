import Image from 'next/image';

interface FeaturedImageProps {
    src: string;
    alt: string;
}

export default function FeaturedImage({ src, alt }: FeaturedImageProps) {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="relative h-64 sm:h-96 lg:h-[500px] rounded-3xl overflow-hidden border-2 border-gray-200">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}
