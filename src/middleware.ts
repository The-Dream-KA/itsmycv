import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n/config';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // Redirect to default locale
        return NextResponse.redirect(
            new URL(`/${i18n.defaultLocale}${pathname}`, request.url)
        );
    }
}

export const config = {
    // Matcher ignoring `/_next/`, `/api/`, `/auth/callback`, `/favicon.ico`, static files, etc.
    matcher: ['/((?!api|_next/static|_next/image|favicon|manifest|sw|workbox|icon-|auth/callback|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.js).*)'],
};
