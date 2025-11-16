import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state') || '/'
    const error = searchParams.get('error')

    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/auth?error=${error}`)
    }

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/auth?error=no_code`)
    }

    try {
        // Exchange code for tokens with Google
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID!,
                client_secret: process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        })

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for tokens')
        }

        const tokens = await tokenResponse.json()

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        })

        if (!userInfoResponse.ok) {
            throw new Error('Failed to get user info')
        }

        const userInfo = await userInfoResponse.json()

        // Create Supabase admin client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        )

        // Sign in or create user in Supabase
        const { data: signInData, error: signInError } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: tokens.id_token,
        })

        if (signInError) {
            throw signInError
        }

        // Redirect with session in URL for client to pick up
        const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_SITE_URL}${state}`)

        if (signInData.session) {
            // Add session info to URL so client can establish session
            redirectUrl.searchParams.set('access_token', signInData.session.access_token)
            redirectUrl.searchParams.set('refresh_token', signInData.session.refresh_token)
        }

        return NextResponse.redirect(redirectUrl.toString())

    } catch (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/auth?error=callback_failed`)
    }
}
