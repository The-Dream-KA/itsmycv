import Link from 'next/link';

interface RelatedArticle {
    slug: string;
    title: string;
    excerpt: string;
}

interface RelatedArticlesProps {
    lang: string;
    title: string;
    articles: RelatedArticle[];
}

export default function RelatedArticles({ lang, title, articles }: RelatedArticlesProps) {
    return (
        <div className="border-t-2 border-gray-200 mt-8 sm:mt-12 pt-8 sm:pt-12">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {articles.map((article) => (
                    <Link
                        key={article.slug}
                        href={`/${lang}/blog/${article.slug}`}
                        className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#ff007a] transition-colors"
                    >
                        <h4 className="text-base sm:text-lg font-bold text-black mb-2">{article.title}</h4>
                        <p className="text-gray-600 text-xs sm:text-sm">{article.excerpt}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
