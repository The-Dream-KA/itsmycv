import { digitalCvFuture } from './digital-cv-future';
import { cvTips2025 } from './cv-tips-2025';
import { secureJobApplications } from './secure-job-applications';
import { otherBlogPosts } from './other-posts';

export const blogPosts = {
    'digital-cv-future': digitalCvFuture,
    'cv-tips-2025': cvTips2025,
    'secure-job-applications': secureJobApplications,
    ...otherBlogPosts,
} as const;
