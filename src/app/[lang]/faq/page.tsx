'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, MessageCircle, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

export default function FAQPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = use(params);
    const t = getTranslations(lang);
    const faqs: FAQItem[] = [...t.faq.items];

    const categories = Array.from(new Set(faqs.map(faq => faq.category)));

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>(t.faq.all);
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());
    const toggleItem = (index: number) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(index)) {
            newOpenItems.delete(index);
        } else {
            newOpenItems.add(index);
        }
        setOpenItems(newOpenItems);
    };

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === t.faq.all || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />

            {/* Hero Section */}
            <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-3 sm:space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black px-2">
                            {t.faq.title}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                            {t.faq.subtitle}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                                type="text"
                                placeholder={t.faq.search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-full focus:border-[#ff007a] focus:outline-none text-sm sm:text-base text-gray-900"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                        <button
                            onClick={() => setActiveCategory(t.faq.all)}
                            className={`px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base transition-colors touch-manipulation ${activeCategory === t.faq.all
                                ? 'bg-[#ff007a] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {t.faq.all}
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base transition-colors touch-manipulation ${activeCategory === category
                                    ? 'bg-[#ff007a] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 mb-4">
                                    {t.faq.notFound} <Link href={`/${lang}/support`} className="text-[#ff007a] hover:underline">{t.faq.contactUs}</Link>
                                </p>
                            </div>
                        ) : (
                            filteredFaqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#ff007a] transition-colors"
                                >
                                    <button
                                        onClick={() => toggleItem(index)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <div className="flex-1">
                                            <span className="text-sm text-[#ff007a] font-medium mb-2 block">
                                                {faq.category}
                                            </span>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        {openItems.has(index) ? (
                                            <ChevronUp className="w-6 h-6 text-[#ff007a] flex-shrink-0 ml-4" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                                        )}
                                    </button>
                                    {openItems.has(index) && (
                                        <div className="px-6 pb-6">
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Support CTA */}
            <section className="py-12 lg:py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <MessageCircle className="w-12 h-12 text-[#ff007a] mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-black mb-4">
                        {t.faq.stillNeedHelp}
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        {t.faq.stillNeedHelpDesc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={`/${lang}/support`}
                            className="inline-flex items-center justify-center bg-[#ff007a] text-white px-8 py-4 rounded-full font-semibold hover:bg-black transition-colors"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            {t.faq.contactSupport}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer lang={lang} />
        </div>
    );
}
