import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const redirectTo = searchParams.get('redirectTo') || '/'

    // Build Google OAuth URL directly
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

    googleAuthUrl.searchParams.set('client_id', process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID!)
    googleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'openid email profile')
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'consent')
    googleAuthUrl.searchParams.set('state', redirectTo)

    return NextResponse.redirect(googleAuthUrl.toString())
}
