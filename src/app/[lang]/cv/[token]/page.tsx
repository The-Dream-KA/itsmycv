'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, use } from 'react'
import { Locale } from '@/i18n/config'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CVDataDisplay from '@/components/CVDataDisplay'
import { ArrowLeft, Download, Trash2, Star, FileText } from 'lucide-react'
import Link from 'next/link'

interface CVVariant {
    id: string
    name: string
    fileName: string | null
    fileSize: number | null
    isPrimary: boolean
    createdAt: string
    updatedAt: string
}

export default function SecureCVViewerPage({ params }: { params: Promise<{ lang: Locale, token: string }> }) {
    const { lang, token } = use(params)
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [cvData, setCvData] = useState<any>(null)
    const [variant, setVariant] = useState<CVVariant | null>(null)
    const [error, setError] = useState<string>('')
    const supabase = createClient()

    useEffect(() => {
        // SECURITY: Verify authentication with Supabase Auth server
        supabase.auth.getUser().then(({ data: { user }, error }) => {
            const currentUser = (!error && user) ? user : null
            setUser(currentUser)

            if (!currentUser) {
                router.push(`/${lang}/auth`)
                return
            }

            // Load CV data
            loadCVData()
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            void supabase.auth.getUser().then(({ data: { user }, error }) => {
                const currentUser = (!error && user) ? user : null
                setUser(currentUser)

                if (!currentUser) {
                    router.push(`/${lang}/auth`)
                } else {
                    loadCVData()
                }
            })
        })

        return () => subscription.unsubscribe()
    }, [lang, router, supabase.auth, token])

    const loadCVData = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/cv/secure/${token}`)
            const result = await response.json()

            if (result.success && result.data) {
                setCvData(result.data)
                setVariant(result.variant)
            } else {
                setError(result.error || 'Failed to load CV')
            }
        } catch (err) {
            setError('Failed to load CV variant')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this CV variant? This action cannot be undone.')) {
            return
        }

        try {
            const response = await fetch(`/api/cv/secure/${token}`, {
                method: 'DELETE'
            })

            const result = await response.json()

            if (result.success) {
                router.push(`/${lang}/dashboard`)
            } else {
                alert(result.error || 'Failed to delete CV')
            }
        } catch (err) {
            alert('Failed to delete CV variant')
            console.error(err)
        }
    }

    const handleTogglePrimary = async () => {
        try {
            const response = await fetch(`/api/cv/secure/${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPrimary: !variant?.isPrimary })
            })

            const result = await response.json()

            if (result.success) {
                setVariant(prev => prev ? { ...prev, isPrimary: !prev.isPrimary } : null)
            } else {
                alert(result.error || 'Failed to update primary status')
            }
        } catch (err) {
            alert('Failed to update CV')
            console.error(err)
        }
    }

    const handleDownloadJSON = () => {
        if (!cvData || !variant) return

        const dataStr = JSON.stringify(cvData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${variant.name.replace(/\s+/g, '-')}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <>
                <Navbar lang={lang} />
                <div className="min-h-screen flex items-center justify-center bg-white pt-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff007a] mx-auto"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading CV...</p>
                    </div>
                </div>
                <Footer lang={lang} />
            </>
        )
    }

    if (error || !cvData || !variant) {
        return (
            <>
                <Navbar lang={lang} />
                <div className="min-h-screen bg-white pt-28 pb-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                            <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">CV Not Found</h2>
                            <p className="text-gray-600 mb-6">
                                {error || 'The CV you are looking for does not exist, has expired, or you do not have permission to view it.'}
                            </p>
                            <Link
                                href={`/${lang}/dashboard`}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Dashboard
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Navigation Breadcrumb */}
                    <div className="mb-6">
                        <Link
                            href={`/${lang}/dashboard`}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ff007a] transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Dashboard</span>
                        </Link>
                    </div>

                    {/* Modern Header Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        {/* Top Section with CV Name and Status */}
                        <div className="bg-gradient-to-r from-[#00c8ff] via-[#00c8ff] to-[#00c8ff] px-8 py-6">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{variant.name}</h1>
                                        {variant.isPrimary && (
                                            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                Primary CV
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-800 flex-wrap">
                                        {variant.fileName && (
                                            <div className="flex items-center gap-1.5">
                                                <FileText className="w-4 h-4" />
                                                <span className="truncate max-w-xs">{variant.fileName}</span>
                                                {variant.fileSize && (
                                                    <span className="text-gray-500">• {(variant.fileSize / 1024).toFixed(2)} KB</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Meta Information */}
                        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-6 text-xs text-gray-600 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    <span className="font-medium">Created:</span>
                                    <span>{new Date(variant.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    <span className="text-gray-400">{new Date(variant.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span className="font-medium">Last Updated:</span>
                                    <span>{new Date(variant.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    <span className="text-gray-400">{new Date(variant.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Section */}
                        <div className="px-8 py-5 bg-white">
                            <div className="flex items-center gap-3 flex-wrap">
                                {/* Primary Actions */}
                                <button
                                    onClick={handleDownloadJSON}
                                    className="inline-flex items-center gap-2 bg-[#00e5ff] hover:bg-[#00d4ee] text-gray-900 font-medium py-2.5 px-5 rounded-lg transition-colors shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download JSON
                                </button>
                                <button
                                    onClick={handleTogglePrimary}
                                    className={`inline-flex items-center gap-2 font-medium py-2.5 px-5 rounded-lg transition-all shadow-sm ${variant.isPrimary
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                                        : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200'
                                        }`}
                                >
                                    <Star className={`w-4 h-4 ${variant.isPrimary ? 'fill-current' : ''}`} />
                                    {variant.isPrimary ? 'Remove Primary' : 'Set as Primary'}
                                </button>

                                {/* Danger Zone */}
                                <div className="ml-auto flex items-center gap-3">
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-medium py-2.5 px-5 rounded-lg transition-all shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CV Data Display */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <CVDataDisplay data={cvData} />
                    </div>
                </div>
            </div>
            <Footer lang={lang} />
        </>
    )
}
