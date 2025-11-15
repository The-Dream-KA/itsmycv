'use client';

import { use } from 'react';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPageProps {
    params: Promise<{
        lang: Locale;
    }>;
}

type BlogPostSlug =
    | 'digital-cv-future'
    | 'cv-tips-2025'
    | 'secure-job-applications'
    | 'gdpr-compliance'
    | 'career-success-stories'
    | 'professional-networking';

// Sample blog posts data
const blogPosts: Array<{
    id: number;
    slug: BlogPostSlug;
    image: string;
    date: string;
    readTime: string;
}> = [
        {
            id: 1,
            slug: 'digital-cv-future',
            image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
            date: '2025-11-10',
            readTime: '5 min read',
        },
        {
            id: 2,
            slug: 'cv-tips-2025',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
            date: '2025-11-05',
            readTime: '7 min read',
        },
        {
            id: 3,
            slug: 'secure-job-applications',
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
            date: '2025-10-28',
            readTime: '6 min read',
        },
    ];

export default function BlogPage({ params }: BlogPageProps) {
    const { lang } = use(params);
    const t = getTranslations(lang).blog;

    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />

            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black rubik-mono-one-regular">
                            {t.title}
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {t.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-8 sm:py-12 lg:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {blogPosts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-[#ff007a] transition-all duration-300 hover:shadow-lg group"
                            >
                                <div className="relative h-40 sm:h-48 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={t.posts[post.slug].title}
                                        width={800}
                                        height={400}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-5 sm:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-3">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2 sm:mb-3 group-hover:text-[#ff007a] transition-colors">
                                        {t.posts[post.slug].title}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                                        {t.posts[post.slug].excerpt}
                                    </p>
                                    <Link
                                        href={`/${lang}/blog/${post.slug}`}
                                        className="inline-flex items-center text-sm sm:text-base text-[#ff007a] hover:text-black font-semibold transition-colors touch-manipulation"
                                    >
                                        {t.readMore}
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <Footer lang={lang} />
        </div>
    );
}
