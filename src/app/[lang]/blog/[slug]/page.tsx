'use client';

import { use } from 'react';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Components
import BackButton from './components/BackButton';
import ArticleHeader from './components/ArticleHeader';
import FeaturedImage from './components/FeaturedImage';
import ShareSection from './components/ShareSection';
import RelatedArticles from './components/RelatedArticles';
import CTASection from './components/CTASection';
import BottomCTA from './components/BottomCTA';
import ComingSoonView from './components/ComingSoonView';

// Sections
import DigitalCVFutureSections from './sections/DigitalCVFutureSections';
import CVTips2025Sections from './sections/CVTips2025Sections';
import SecureJobApplicationsSections from './sections/SecureJobApplicationsSections';
import ConclusionSection from './sections/ConclusionSection';

// Utils
import { supportedSlugs, getBlogContent, getArticleContent, getRelatedArticles } from './utils/blogHelpers';

interface BlogPostPageProps {
    params: Promise<{
        lang: Locale;
        slug: string;
    }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const { lang, slug } = use(params);
    const t = getTranslations(lang);

    // Check if slug is supported
    if (!supportedSlugs.includes(slug)) {
        return (
            <ComingSoonView
                lang={lang}
                backLabel={t.blog.backToBlog}
                title={t.blog.comingSoon}
                description={t.blog.comingSoonDesc}
            />
        );
    }

    const post = t.blog.posts[slug as 'digital-cv-future' | 'cv-tips-2025' | 'secure-job-applications'];
    const blogContent = getBlogContent(post);
    const articleContent = getArticleContent(post, t);

    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />

            <article className="pt-16">
                {/* Back Button */}
                <BackButton href={`/${lang}/blog`} label={t.blog.backToBlog} />

                {/* Article Header */}
                <ArticleHeader
                    title={blogContent.title}
                    excerpt={blogContent.excerpt}
                    date={blogContent.date}
                    readTime={blogContent.readTime}
                    author={blogContent.author}
                />

                {/* Featured Image */}
                <FeaturedImage src={blogContent.image} alt={blogContent.title} />

                {/* Article Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        {articleContent && (
                            <>
                                {/* Render content based on slug */}
                                {slug === 'digital-cv-future' && (
                                    <DigitalCVFutureSections content={articleContent} />
                                )}

                                {slug === 'cv-tips-2025' && (
                                    <CVTips2025Sections content={articleContent} />
                                )}

                                {slug === 'secure-job-applications' && (
                                    <SecureJobApplicationsSections content={articleContent} />
                                )}

                                {/* CTA Section */}
                                {'cta' in articleContent.sections && (
                                    <CTASection
                                        lang={lang}
                                        title={articleContent.sections.cta.title}
                                        description={articleContent.sections.cta.desc}
                                        buttonText={articleContent.sections.cta.button}
                                    />
                                )}

                                {/* Conclusion */}
                                {'conclusion' in articleContent.sections && (
                                    <ConclusionSection
                                        title={articleContent.sections.conclusion.title}
                                        content={articleContent.sections.conclusion.content}
                                    />
                                )}
                            </>
                        )}

                        {/* Share Section */}
                        <ShareSection title={t.blog.shareArticle} />

                        {/* Related Articles */}
                        <RelatedArticles
                            lang={lang}
                            title={t.blog.relatedArticles}
                            articles={getRelatedArticles(slug, t)}
                        />
                    </div>
                </div>

                {/* Bottom CTA */}
                <BottomCTA href={`/${lang}/blog`} label={t.blog.backToAllArticles} />
            </article>

            <Footer lang={lang} />
        </div>
    );
}
