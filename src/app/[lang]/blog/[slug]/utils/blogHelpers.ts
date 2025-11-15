export interface BlogContent {
    title: string;
    excerpt: string;
    image: string;
    date: string;
    readTime: string;
    author: string;
}

export const getBlogContent = (post: any): BlogContent => {
    // Determine metadata based on post title/slug
    const metadata: Record<string, { image: string; date: string; readTime: string }> = {
        'The Future of Digital CVs': {
            image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop',
            date: '2025-11-10',
            readTime: '5 min read',
        },
        '10 CV Tips for 2025': {
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop',
            date: '2025-11-05',
            readTime: '7 min read',
        },
        'Secure Job Applications Made Easy': {
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop',
            date: '2025-10-28',
            readTime: '6 min read',
        },
        'Candidatures Sécurisées Simplifiées': {
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop',
            date: '2025-10-28',
            readTime: '6 min read',
        },
        'Veilige Sollicitaties Eenvoudig Gemaakt': {
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop',
            date: '2025-10-28',
            readTime: '6 min read',
        },
    };

    const postMetadata = metadata[post.title] || metadata['The Future of Digital CVs'];

    return {
        title: post.title,
        excerpt: post.excerpt,
        image: postMetadata.image,
        date: postMetadata.date,
        readTime: postMetadata.readTime,
        author: 'author' in post ? post.author : 'itsmycv Team',
    };
};

export const getArticleContent = (post: any, t: any) => {
    const hasContent = 'content' in post && post.content;

    if (hasContent && post.content) {
        return post.content;
    }

    // Fallback to English if translation not available
    const enPost = t.blog.posts['digital-cv-future'];
    if ('content' in enPost && enPost.content) {
        return enPost.content;
    }

    return null;
};

export const supportedSlugs = ['digital-cv-future', 'cv-tips-2025', 'secure-job-applications'];

export const allArticles = [
    {
        slug: 'digital-cv-future',
        title: 'The Future of Digital CVs',
        excerpt: 'Discover how digital CVs are revolutionizing the job application process.',
    },
    {
        slug: 'cv-tips-2025',
        title: '10 CV Tips for 2025',
        excerpt: 'Essential tips to make your CV stand out in the modern job market.',
    },
    {
        slug: 'secure-job-applications',
        title: 'Secure Job Applications Made Easy',
        excerpt: 'Learn how to protect your personal information while applying for jobs online.',
    },
];

export const getRelatedArticles = (currentSlug: string, translations?: any) => {
    // Filter out the current article
    const filtered = allArticles.filter(article => article.slug !== currentSlug);

    // If translations are provided, use them, otherwise use default English titles
    if (translations && translations.blog && translations.blog.posts) {
        return filtered.map(article => {
            const post = translations.blog.posts[article.slug as keyof typeof translations.blog.posts];
            return {
                slug: article.slug,
                title: post?.title || article.title,
                excerpt: post?.excerpt || article.excerpt,
            };
        });
    }

    return filtered;
};

// Backwards compatibility - deprecated
export const relatedArticles = allArticles.slice(1, 3);
