'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, use } from 'react'
import { Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import Link from 'next/link'
import Image from 'next/image'
import { ASSETS } from '@/lib/constants'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'

export default function AuthPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = use(params)
  const t = getTranslations(lang)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  // Logo rotation animation (same as Hero)
  const [currentLogo, setCurrentLogo] = useState(0)
  const logos = [
    ASSETS.logo,
    'https://res.cloudinary.com/docxvgl2f/image/upload/v1762921046/yourdigitalcv-logo-black_tec1du.svg',
    'https://res.cloudinary.com/docxvgl2f/image/upload/v1762921449/create-edit-transfer-logo-black_tffrar.svg'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogo((prev) => (prev + 1) % logos.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [logos.length])

  useEffect(() => {
    // Check for tokens in URL (from OAuth callback)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const searchParams = new URLSearchParams(window.location.search)
    const accessToken = hashParams.get('access_token') || searchParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token')

    if (accessToken && refreshToken) {
      // Set the session with tokens from OAuth callback
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(() => {
        // SECURITY: Verify user with server after setting session
        void supabase.auth.getUser().then(({ data: { user }, error }) => {
          if (!error && user) {
            // Clean URL
            window.history.replaceState({}, document.title, `/${lang}/auth`)
            // Redirect to dashboard
            router.push(`/${lang}/dashboard`)
          }
        })
      }).catch((error) => {
        console.error('[AUTH] Error setting session:', error)
      })
      return
    }

    // SECURITY: Verify authentication with Supabase Auth server
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      const currentUser = (!error && user) ? user : null
      setUser(currentUser)
      setLoading(false)

      // Redirect to dashboard if already authenticated
      if (currentUser) {
        router.push(`/${lang}/dashboard`)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void supabase.auth.getUser().then(({ data: { user }, error }) => {
        const currentUser = (!error && user) ? user : null
        setUser(currentUser)

        if (currentUser) {
          router.push(`/${lang}/dashboard`)
        }
      })
    })

    return () => subscription.unsubscribe()
  }, [lang, router, supabase.auth])

  const handleGoogleSignIn = async () => {
    setAuthLoading(true)
    setError('')
    try {
      // Use custom OAuth flow that shows itsmycv.be domain
      window.location.href = `/api/auth/google?redirectTo=/${lang}/auth`
    } catch (error: any) {
      setError(error.message)
      setAuthLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setError('')

    // Validation
    if (!email.includes('@')) {
      setError(t.auth.errors.invalidEmail)
      setAuthLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t.auth.errors.passwordTooShort)
      setAuthLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/${lang}/auth/callback`,
          },
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error: any) {
      setError(isSignUp ? t.auth.errors.signUpFailed : t.auth.errors.signInFailed)
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error: any) {
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar lang={lang} />
        <div className="min-h-screen flex items-center justify-center bg-white pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff007a] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">{t.auth.loading}</p>
          </div>
        </div>
        <Footer lang={lang} />
      </>
    )
  }

  if (user) {
    return (
      <>
        <Navbar lang={lang} />
        <div className="min-h-screen flex items-center justify-center bg-white p-4 pt-24">
          <div className="max-w-md w-full">
            {/* Logo */}
            <Link href={`/${lang}`} className="block mb-8">
              <Image
                src={ASSETS.logo}
                alt="ItsMyCV"
                width={200}
                height={60}
                className="mx-auto"
              />
            </Link>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#ff007a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-[#ff007a]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {t.auth.success.title}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t.auth.success.subtitle}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-gray-500 min-w-[60px]">{t.auth.success.email}:</span>
                    <span className="text-sm text-gray-900 font-medium break-all">{user.email}</span>
                  </div>
                  {user.user_metadata?.full_name && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-500 min-w-[60px]">Name:</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {user.user_metadata.full_name}
                      </span>
                    </div>
                  )}
                  {user.user_metadata?.avatar_url && (
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-sm font-semibold text-gray-500 min-w-[60px]">Avatar:</span>
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full bg-black hover:bg-[#ff007a] text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 shadow-sm"
              >
                {t.auth.success.signOutButton}
              </button>

              <Link
                href={`/${lang}`}
                className="block mt-4 text-center text-gray-600 hover:text-[#ff007a] font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer lang={lang} />
      </>
    )
  }

  return (
    <>
      <Navbar lang={lang} />
      <div className="min-h-screen flex items-center justify-center bg-white p-4 pt-28 lg:pt-32 pb-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Side - Animated Logo */}
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
            <div className="relative h-64 sm:h-80 lg:h-96 flex items-center justify-center">
              <Image
                src={logos[currentLogo]}
                alt="ItsMyCV"
                width={400}
                height={400}
                className="h-full w-auto object-contain animate-logo-rotate"
                priority
                key={currentLogo}
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t.auth.title}
                </h1>
                <p className="text-gray-600">
                  {t.auth.subtitle}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              {/* Google Sign In Button - Primary */}
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-[#ff007a] text-gray-700 font-semibold py-4 px-6 rounded-full transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="group-hover:text-[#ff007a] transition-colors">{t.auth.googleButton}</span>
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">{t.auth.divider}</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.auth.emailTitle}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.emailPlaceholder}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff007a] focus:border-transparent transition-all outline-none"
                    required
                    disabled={authLoading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff007a] focus:border-transparent transition-all outline-none"
                    required
                    disabled={authLoading}
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#ff007a] hover:bg-black text-white font-semibold py-4 px-6 rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {authLoading ? t.auth.loading : (isSignUp ? t.auth.signUpButton : t.auth.signInButton)}
                </button>
              </form>

              {/* Toggle Sign Up/Sign In */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isSignUp ? t.auth.toggleSignIn : t.auth.toggleSignUp}{' '}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError('')
                    }}
                    className="text-[#ff007a] hover:text-black font-semibold transition-colors"
                  >
                    {isSignUp ? t.auth.toggleSignInLink : t.auth.toggleSignUpLink}
                  </button>
                </p>
              </div>

              {/* Back to Home Link */}
              <div className="mt-8 text-center">
                <Link
                  href={`/${lang}`}
                  className="text-sm text-gray-500 hover:text-[#ff007a] transition-colors font-medium"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
