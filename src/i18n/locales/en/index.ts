import { navbar } from './navbar';
import { comingSoon } from './coming-soon';
import { hero } from './hero';
import { pains } from './pains';
import { services } from './services';
import { footer } from './footer';
import { about } from './about';
import { faq } from './faq';
import { blog } from './blog';
import { blogPosts } from './blog-posts';
import { support } from './support';

export const en = {
    navbar,
    comingSoon,
    hero,
    pains,
    services,
    footer,
    about,
    faq,
    blog,
    support,
} as const;

// Merge blog posts into blog section
export const enWithPosts = {
    ...en,
    blog: {
        ...blog,
        posts: blogPosts,
    },
} as const;
