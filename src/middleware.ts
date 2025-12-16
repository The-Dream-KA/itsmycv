import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n/config';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
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

    // SECURITY ENHANCEMENT: Refresh Supabase session to prevent auth state drift
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // SECURITY: Verify session authenticity by contacting Supabase Auth server
    // This prevents accepting tampered session data from cookies
    await supabase.auth.getUser();

    return response;
}

export const config = {
    // Matcher ignoring `/_next/`, `/api/`, `/auth/callback`, `/favicon.ico`, static files, etc.
    matcher: ['/((?!api|_next/static|_next/image|favicon|manifest|sw|workbox|icon-|auth/callback|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.js).*)'],
};
