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

export default function DashboardPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = use(params)
    const t = getTranslations(lang)
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null
            setUser(currentUser)
            setLoading(false)

            // Redirect to auth if not authenticated
            if (!currentUser) {
                router.push(`/${lang}/auth`)
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null
            setUser(currentUser)

            // Redirect to auth if logged out
            if (!currentUser) {
                router.push(`/${lang}/auth`)
            }
        })

        return () => subscription.unsubscribe()
    }, [lang, router, supabase.auth])

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            router.push(`/${lang}`)
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
                        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                    </div>
                </div>
                <Footer lang={lang} />
            </>
        )
    }

    if (!user) {
        return null // Will redirect in useEffect
    }

    return (
        <>
            <Navbar lang={lang} />
            <div className="min-h-screen bg-white pt-28 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                        <div className="flex items-center gap-6">
                            {user.user_metadata?.avatar_url && (
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    width={80}
                                    height={80}
                                    className="rounded-full border-4 border-[#ff007a]/10"
                                />
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back, {user.user_metadata?.full_name || 'User'}! 👋
                                </h1>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                                <span className="text-sm font-semibold text-gray-500 min-w-[100px]">Email:</span>
                                <span className="text-sm text-gray-900 font-medium break-all">{user.email}</span>
                            </div>
                            {user.user_metadata?.full_name && (
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                                    <span className="text-sm font-semibold text-gray-500 min-w-[100px]">Name:</span>
                                    <span className="text-sm text-gray-900 font-medium">{user.user_metadata.full_name}</span>
                                </div>
                            )}
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                                <span className="text-sm font-semibold text-gray-500 min-w-[100px]">User ID:</span>
                                <span className="text-xs text-gray-900 font-mono break-all">{user.id}</span>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                                <span className="text-sm font-semibold text-gray-500 min-w-[100px]">Joined:</span>
                                <span className="text-sm text-gray-900 font-medium">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${lang}`}
                            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-full transition-colors"
                        >
                            ← Back to Home
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="flex-1 bg-black hover:bg-[#ff007a] text-white font-semibold py-4 px-6 rounded-full transition-colors shadow-sm"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
            <Footer lang={lang} />
        </>
    )
}
