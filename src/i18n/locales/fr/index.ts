import { navbar } from './navbar';
import { comingSoon } from './coming-soon';
import { hero } from './hero';
import { pains } from './pains';
import { services } from './services';
import { footer } from './footer';
import { about } from './about';
import { faq } from './faq';
import { blog } from './blog';
import { support } from './support';
import { digitalCvFuture, cvTips2025, secureJobApplications, otherPosts } from './blog-posts';

export const fr = {
    navbar,
    comingSoon,
    hero,
    pains,
    services,
    footer,
    about,
    faq,
    blog: {
        ...blog,
        posts: {
            'digital-cv-future': digitalCvFuture,
            'cv-tips-2025': cvTips2025,
            'secure-job-applications': secureJobApplications,
            ...otherPosts,
        },
    },
    support,
} as const;

export const frWithPosts = fr;
