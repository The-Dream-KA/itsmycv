'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, use } from 'react'
import { Locale } from '@/i18n/config'
import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'
import CVUploader from '@/components/CVUploader'
import Notification from '@/components/Notification'
import ConfirmDialog from '@/components/ConfirmDialog'
import RenameCVDialog from '@/components/RenameCVDialog'
import {
    Scan,
    FileText,
    Trash2,
    Star,
    Edit,
    Eye,
    Upload,
    Clock,
    ArrowRight,
    Grid,
    List,
    Search,
    FileEdit,
    PenTool,
    ArrowUpDown,
    ChevronDown,
    Check,
    CalendarDays,
    ArrowDownAZ,
    ArrowUpZA
} from 'lucide-react'

type SavedVariant = {
    id: string
    name: string
    fileName?: string | null
    createdAt: string
    isPrimary?: boolean
}

type VariantsResponse = {
    success: boolean
    variants: SavedVariant[]
}

type TokenResponse = {
    success: boolean
    token?: string
    error?: string
}

type MutationResponse = {
    success: boolean
    error?: string
}

export default function DashboardPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = use(params)
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [savedVariants, setSavedVariants] = useState<SavedVariant[]>([])
    const [loadingVariants, setLoadingVariants] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string } | null>(null)
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; variantId?: string } | null>(null)
    const [signOutDialog, setSignOutDialog] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [orderBy, setOrderBy] = useState<'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'primary-first'>('date-newest')
    const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false)
    const [renameDialog, setRenameDialog] = useState<{ isOpen: boolean; variantId?: string; currentName?: string } | null>(null)
    const supabase = createClient()

    useEffect(() => {
        // SECURITY: Verify authentication with Supabase Auth server
        supabase.auth.getUser().then(({ data: { user }, error }) => {
            const currentUser = (!error && user) ? user : null
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
        } = supabase.auth.onAuthStateChange(() => {
            void supabase.auth.getUser().then(({ data: { user }, error }) => {
                const currentUser = (!error && user) ? user : null
                setUser(currentUser)

                // Redirect to auth if logged out
                if (!currentUser) {
                    router.push(`/${lang}/auth`)
                }
            })
        })

        return () => subscription.unsubscribe()
    }, [lang, router, supabase.auth])

    const handleSignOutClick = () => {
        setSignOutDialog(true)
    }

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            router.push(`/${lang}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to sign out. Please try again.'
            alert(message)
        }
    }

    const loadSavedVariants = async () => {
        setLoadingVariants(true)
        try {
            const response = await fetch('/api/cv/variants')
            const result: VariantsResponse = await response.json()

            if (result.success && Array.isArray(result.variants)) {
                setSavedVariants(result.variants)
            }
        } catch (error) {
            console.error('Error loading CV variants:', error)
        } finally {
            setLoadingVariants(false)
        }
    }

    useEffect(() => {
        if (user) {
            loadSavedVariants()
        }
    }, [user])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest('.order-dropdown')) {
                setIsOrderDropdownOpen(false)
            }
        }

        if (isOrderDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOrderDropdownOpen])

    const handleScanComplete = (data: Record<string, unknown>) => {
        // Store CV data in sessionStorage for the new editor
        sessionStorage.setItem('unsavedCVData', JSON.stringify(data))

        // Redirect to new CV editor
        router.push(`/${lang}/cv/edit/new`)
    }

    const handleError = (errorMessage: string) => {
        setError(errorMessage)
    }

    const handleStartFromScratch = () => {
        // Clear any existing unsaved CV data
        sessionStorage.removeItem('unsavedCVData')
        // Navigate to the new CV editor with empty data
        router.push(`/${lang}/cv/edit/new`)
    }

    const handleViewCV = async (variantId: string) => {
        try {
            // Generate secure token
            const response = await fetch(`/api/cv/token/${variantId}`)
            const result: TokenResponse = await response.json()

            if (result.success && result.token) {
                // Navigate to secure CV viewer with token
                router.push(`/${lang}/cv/${result.token}`)
            } else {
                setNotification({
                    type: 'error',
                    title: 'Failed to Open CV',
                    message: 'Could not generate secure access link.'
                })
            }
        } catch (error) {
            console.error('Error generating token:', error)
            setNotification({
                type: 'error',
                title: 'Error Opening CV',
                message: 'An unexpected error occurred. Please try again.'
            })
        }
    }

    const handleEditCV = async (variantId: string) => {
        try {
            // Generate secure edit token - no CV IDs in URLs
            const response = await fetch(`/api/cv/edit-token/${variantId}`)
            const result: TokenResponse = await response.json()

            if (result.success && result.token) {
                // Navigate to secure CV editor with token
                router.push(`/${lang}/cv/edit/${result.token}`)
            } else {
                setNotification({
                    type: 'error',
                    title: 'Failed to Open Editor',
                    message: 'Could not generate secure edit link.'
                })
            }
        } catch (error) {
            console.error('Error generating edit token:', error)
            setNotification({
                type: 'error',
                title: 'Error Opening Editor',
                message: 'An unexpected error occurred. Please try again.'
            })
        }
    }

    const handleRenameVariant = (variantId: string, currentName: string) => {
        setRenameDialog({ isOpen: true, variantId, currentName })
    }

    const confirmRename = async (newName: string) => {
        if (!renameDialog?.variantId) return

        try {
            const response = await fetch(`/api/cv/${renameDialog.variantId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ variantName: newName })
            })

            const result: MutationResponse = await response.json()

            if (result.success) {
                await loadSavedVariants()
                setNotification({
                    type: 'success',
                    title: 'CV Renamed',
                    message: 'Your CV variant name has been successfully updated.'
                })
            } else {
                throw new Error(result.error || 'Failed to rename CV variant')
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Could not rename CV variant.'
            setNotification({
                type: 'error',
                title: 'Rename Failed',
                message
            })
            throw error
        }
    }

    const handleDeleteVariant = (variantId: string) => {
        setConfirmDialog({ isOpen: true, variantId })
    }

    const confirmDelete = async () => {
        if (!confirmDialog?.variantId) return

        try {
            const response = await fetch(`/api/cv/${confirmDialog.variantId}`, {
                method: 'DELETE'
            })

            const result: MutationResponse = await response.json()

            if (result.success) {
                await loadSavedVariants()
                setConfirmDialog(null)
                setNotification({
                    type: 'success',
                    title: 'CV Deleted',
                    message: 'Your CV variant has been successfully removed.'
                })
            } else {
                setConfirmDialog(null)
                setNotification({
                    type: 'error',
                    title: 'Deletion Failed',
                    message: result.error || 'Could not delete CV variant.'
                })
            }
        } catch (error) {
            console.error('Error deleting CV variant:', error)
            setConfirmDialog(null)
            setNotification({
                type: 'error',
                title: 'Error',
                message: 'An unexpected error occurred while deleting.'
            })
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

    // Filter variants based on search
    const filteredVariants = savedVariants.filter(variant =>
        variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort variants based on order by option
    const sortedVariants = [...filteredVariants].sort((a, b) => {
        switch (orderBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name)
            case 'name-desc':
                return b.name.localeCompare(a.name)
            case 'date-newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            case 'date-oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            case 'primary-first':
                if (a.isPrimary && !b.isPrimary) return -1
                if (!a.isPrimary && b.isPrimary) return 1
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            default:
                return 0
        }
    })

    // Calculate statistics
    const stats = {
        totalCVs: savedVariants.length,
        primaryCV: savedVariants.filter(v => v.isPrimary).length,
        recentUploads: savedVariants.filter(v => {
            const uploadDate = new Date(v.createdAt)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return uploadDate > weekAgo
        }).length,
        totalScans: savedVariants.length
    }

    return (
        <>
            <Navbar lang={lang} />
            <div className="min-h-screen bg-white pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Header */}
                    <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-lg p-6 sm:p-8 md:p-10 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                            <div className="flex items-center gap-6">
                                {user.user_metadata?.avatar_url ? (
                                    <Image
                                        src={user.user_metadata.avatar_url}
                                        alt="Avatar"
                                        width={80}
                                        height={80}
                                        className="rounded-full border-4 border-gray-100"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-[#ff007a] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                        {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 rubik-mono-one-regular">
                                        Welcome back, {user.user_metadata?.full_name || 'Professional'}
                                    </h1>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => {
                                        const element = document.getElementById('ai-scanner')
                                        element?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="w-full md:w-auto px-6 py-3 bg-[#ff007a] hover:bg-black text-white font-semibold rounded-full transition-all flex items-center gap-2 justify-center"
                                >
                                    <Upload className="w-5 h-5" />
                                    Upload CV
                                </button>
                                <button
                                    onClick={handleSignOutClick}
                                    className="w-full md:w-auto px-6 py-3 bg-black hover:bg-[#ff007a] text-white font-semibold rounded-full transition-all"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {/* Total CVs */}
                        <div className="bg-white hover:bg-[#00e5ff] rounded-[30px] p-5 sm:p-6 shadow-lg border-2 border-transparent group-hover:border-[#00e5ff] transition-all duration-300 group text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-between mb-4">
                                <div className="w-12 h-12 bg-[#00e5ff] group-hover:bg-black rounded-full flex items-center justify-center transition-colors">
                                    <FileText className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-black text-sm font-semibold mb-1">Total CVs</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-black rubik-mono-one-regular">{stats.totalCVs}</p>
                            <div className="mt-2 text-xs text-black">
                                <span>Active collection</span>
                            </div>
                        </div>

                        {/* Primary CV */}
                        <div className="bg-white hover:bg-[#feff61] rounded-[30px] p-5 sm:p-6 shadow-lg border-2 border-transparent group-hover:border-[#feff61] transition-all duration-300 group text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-between mb-4">
                                <div className="w-12 h-12 bg-[#feff61] group-hover:bg-black rounded-full flex items-center justify-center transition-colors">
                                    <Star className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-black text-sm font-semibold mb-1">Primary CV</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-black rubik-mono-one-regular">{stats.primaryCV}</p>
                            <div className="mt-2 text-xs text-black">
                                <span>Featured resume</span>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white hover:bg-[#00e5ff] rounded-[30px] p-5 sm:p-6 shadow-lg border-2 border-transparent group-hover:border-[#00e5ff] transition-all duration-300 group text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-between mb-4">
                                <div className="w-12 h-12 bg-[#00e5ff] group-hover:bg-black rounded-full flex items-center justify-center transition-colors">
                                    <Clock className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-black text-sm font-semibold mb-1">This Week</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-black rubik-mono-one-regular">{stats.recentUploads}</p>
                            <div className="mt-2 text-xs text-black">
                                <span>New uploads</span>
                            </div>
                        </div>

                        {/* Total Scans */}
                        <div className="bg-white hover:bg-[#96ff70] rounded-[30px] p-5 sm:p-6 shadow-lg border-2 border-transparent group-hover:border-[#96ff70] transition-all duration-300 group text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-between mb-4">
                                <div className="w-12 h-12 bg-[#96ff70] group-hover:bg-black rounded-full flex items-center justify-center transition-colors">
                                    <Scan className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-black text-sm font-semibold mb-1">Total Scans</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-black rubik-mono-one-regular">{stats.totalScans}</p>
                            <div className="mt-2 text-xs text-black">
                                <span>AI processed</span>
                            </div>
                        </div>
                    </div>

                    {/* Create CV Options Section */}
                    <div id="ai-scanner" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
                        {/* AI CV Scanner */}
                        <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-lg p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-[#96ff70] rounded-full flex items-center justify-center">
                                    <Scan className="w-7 h-7 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-black rubik-mono-one-regular">
                                        AI CV Scanner
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Upload your CV and let AI extract all information instantly
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#ff007a] rounded-lg">
                                    <p className="text-red-800 text-sm font-medium">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-[30px] p-4 sm:p-6">
                                <CVUploader onScanComplete={handleScanComplete} onError={handleError} />
                            </div>
                        </div>

                        {/* Start from Scratch */}
                        <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-lg p-6 sm:p-8 flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-[#00e5ff] rounded-full flex items-center justify-center">
                                    <PenTool className="w-7 h-7 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-black rubik-mono-one-regular">
                                        Start from Scratch
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Create your CV manually with our intuitive editor
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-[30px] p-6 sm:p-8 flex-1 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-[#00e5ff] rounded-full flex items-center justify-center mb-6">
                                    <FileEdit className="w-10 h-10 text-black" />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">
                                    Build Your Perfect CV
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-sm">
                                    Start with a blank canvas and create your CV step by step. Fill in your information, customize sections, and preview in real-time.
                                </p>
                                <button
                                    onClick={handleStartFromScratch}
                                    className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-[#00e5ff] hover:text-black text-white font-semibold rounded-full transition-all flex items-center gap-2 justify-center group"
                                >
                                    <PenTool className="w-5 h-5" />
                                    Start Creating
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Saved CV Variants Section */}
                    <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-lg p-6 sm:p-8 mb-8">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-black rubik-mono-one-regular">
                                    Your Saved Digital CVs
                                </h2>
                            </div>

                            {/* View Toggle, Order By, and Search */}
                            {!loadingVariants && savedVariants.length > 0 && (
                                <div className="flex flex-wrap items-center gap-3 justify-end">
                                    {/* Search Input */}
                                    <div className="relative flex-shrink-0">
                                        <input
                                            type="text"
                                            placeholder="Search CVs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ff007a] focus:border-transparent transition-all hover:border-gray-400"
                                        />
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="relative order-dropdown flex-shrink-0">
                                        <button
                                            onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}
                                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ff007a] focus:border-transparent bg-white hover:border-gray-400 transition-all flex items-center gap-2 min-w-[180px]"
                                            aria-label="Sort CVs by"
                                        >
                                            <ArrowUpDown className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <span className="flex-1 text-left font-medium text-gray-700">
                                                {orderBy === 'date-newest' && 'Newest First'}
                                                {orderBy === 'date-oldest' && 'Oldest First'}
                                                {orderBy === 'name-asc' && 'Name (A-Z)'}
                                                {orderBy === 'name-desc' && 'Name (Z-A)'}
                                                {orderBy === 'primary-first' && 'Primary First'}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOrderDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Custom Dropdown Menu */}
                                        {isOrderDropdownOpen && (
                                            <div className="absolute top-full mt-2 left-0 w-full min-w-[200px] bg-white rounded-[20px] shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <button
                                                    onClick={() => {
                                                        setOrderBy('date-newest')
                                                        setIsOrderDropdownOpen(false)
                                                    }}
                                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 group ${orderBy === 'date-newest' ? 'bg-[#00e5ff]/10' : ''
                                                        }`}
                                                >
                                                    <CalendarDays className="w-4 h-4 text-gray-500 group-hover:text-[#00e5ff]" />
                                                    <span className="flex-1 font-medium text-gray-700 group-hover:text-black">
                                                        Newest First
                                                    </span>
                                                    {orderBy === 'date-newest' && (
                                                        <Check className="w-4 h-4 text-[#00e5ff]" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setOrderBy('date-oldest')
                                                        setIsOrderDropdownOpen(false)
                                                    }}
                                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 group ${orderBy === 'date-oldest' ? 'bg-[#00e5ff]/10' : ''
                                                        }`}
                                                >
                                                    <CalendarDays className="w-4 h-4 text-gray-500 group-hover:text-[#00e5ff]" />
                                                    <span className="flex-1 font-medium text-gray-700 group-hover:text-black">
                                                        Oldest First
                                                    </span>
                                                    {orderBy === 'date-oldest' && (
                                                        <Check className="w-4 h-4 text-[#00e5ff]" />
                                                    )}
                                                </button>

                                                <div className="h-px bg-gray-200 my-1" />

                                                <button
                                                    onClick={() => {
                                                        setOrderBy('name-asc')
                                                        setIsOrderDropdownOpen(false)
                                                    }}
                                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 group ${orderBy === 'name-asc' ? 'bg-[#00e5ff]/10' : ''
                                                        }`}
                                                >
                                                    <ArrowDownAZ className="w-4 h-4 text-gray-500 group-hover:text-[#00e5ff]" />
                                                    <span className="flex-1 font-medium text-gray-700 group-hover:text-black">
                                                        Name (A-Z)
                                                    </span>
                                                    {orderBy === 'name-asc' && (
                                                        <Check className="w-4 h-4 text-[#00e5ff]" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setOrderBy('name-desc')
                                                        setIsOrderDropdownOpen(false)
                                                    }}
                                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 group ${orderBy === 'name-desc' ? 'bg-[#00e5ff]/10' : ''
                                                        }`}
                                                >
                                                    <ArrowUpZA className="w-4 h-4 text-gray-500 group-hover:text-[#00e5ff]" />
                                                    <span className="flex-1 font-medium text-gray-700 group-hover:text-black">
                                                        Name (Z-A)
                                                    </span>
                                                    {orderBy === 'name-desc' && (
                                                        <Check className="w-4 h-4 text-[#00e5ff]" />
                                                    )}
                                                </button>

                                                <div className="h-px bg-gray-200 my-1" />

                                                <button
                                                    onClick={() => {
                                                        setOrderBy('primary-first')
                                                        setIsOrderDropdownOpen(false)
                                                    }}
                                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 group ${orderBy === 'primary-first' ? 'bg-[#00e5ff]/10' : ''
                                                        }`}
                                                >
                                                    <Star className="w-4 h-4 text-gray-500 group-hover:text-[#00e5ff]" />
                                                    <span className="flex-1 font-medium text-gray-700 group-hover:text-black">
                                                        Primary First
                                                    </span>
                                                    {orderBy === 'primary-first' && (
                                                        <Check className="w-4 h-4 text-[#00e5ff]" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* View Toggle Buttons */}
                                    <div className="flex bg-gray-100 rounded-full p-1 flex-shrink-0">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
                                            aria-label="Grid view"
                                            title="Grid view"
                                        >
                                            <Grid className="w-4 h-4 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
                                            aria-label="List view"
                                            title="List view"
                                        >
                                            <List className="w-4 h-4 text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {loadingVariants ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#00e5ff] mx-auto"></div>
                                <p className="mt-4 text-sm text-gray-600 font-medium">Loading your Digital CVs...</p>
                            </div>
                        ) : savedVariants.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-900 font-bold text-lg mb-2">No CVs Yet</p>
                                <p className="text-sm text-gray-500">Start by scanning a CV using the AI scanner above</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                                {sortedVariants.map((variant) => (
                                    <div
                                        key={variant.id}
                                        className="bg-[#00e5ff] hover:bg-[#00e5ff] rounded-[30px] p-5 sm:p-6 transition-all border-2 border-transparent hover:border-black flex flex-col justify-between h-full"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-black text-lg">{variant.name}</h3>
                                                    <button
                                                        onClick={() => handleRenameVariant(variant.id, variant.name)}
                                                        className="p-1.5 bg-white hover:bg-[#00e5ff] text-gray-600 hover:text-black rounded-full transition-all"
                                                        aria-label="Rename CV"
                                                        title="Rename CV"
                                                    >
                                                        <FileEdit className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                {variant.isPrimary && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-full font-semibold mb-3">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[20px] p-4 mb-4">
                                            <p className="text-sm text-gray-600">
                                                {variant.fileName && (
                                                    <span className="block mb-1 font-medium text-black">{variant.fileName}</span>
                                                )}
                                                <span className="text-xs">Created: {new Date(variant.createdAt).toLocaleDateString()}</span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => handleViewCV(variant.id)}
                                                className="flex-1 bg-black hover:bg-[#ff007a] text-white text-sm font-semibold py-2.5 rounded-full transition-all flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEditCV(variant.id)}
                                                className="px-4 py-2 bg-white hover:bg-[#ff007a] hover:text-white text-black rounded-full transition-all flex items-center gap-2 justify-center"
                                                aria-label="Edit CV"
                                                title="Edit CV"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVariant(variant.id)}
                                                className="px-4 py-2 bg-white hover:bg-red-500 hover:text-white text-red-600 rounded-full transition-all flex items-center justify-center"
                                                aria-label="Delete CV"
                                                title="Delete CV"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedVariants.map((variant) => (
                                    <div
                                        key={variant.id}
                                        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-5 sm:p-6 bg-[#00e5ff] hover:bg-[#00e5ff] rounded-[30px] transition-all h-full"
                                    >
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-black text-lg">{variant.name}</h3>
                                                    <button
                                                        onClick={() => handleRenameVariant(variant.id, variant.name)}
                                                        className="p-1.5 bg-white hover:bg-[#00e5ff] text-gray-600 hover:text-black rounded-full transition-all"
                                                        aria-label="Rename CV"
                                                        title="Rename CV"
                                                    >
                                                        <FileEdit className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                {variant.isPrimary && (
                                                    <span className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-full font-semibold mb-3">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {variant.fileName && `${variant.fileName} • `}
                                                Created: {new Date(variant.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                                            <button
                                                onClick={() => handleViewCV(variant.id)}
                                                className="flex-1 lg:flex-initial px-6 py-2.5 bg-black hover:bg-[#ff007a] text-white text-sm font-semibold rounded-full transition-all"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEditCV(variant.id)}
                                                className="flex-1 lg:flex-initial px-4 py-2 bg-white hover:bg-[#ff007a] hover:text-white text-black rounded-full transition-all border-2 border-gray-200 flex items-center gap-2 justify-center"
                                                aria-label="Edit"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span className="text-sm font-medium">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVariant(variant.id)}
                                                className="flex-1 lg:flex-initial p-2.5 bg-white hover:bg-red-500 hover:text-white text-red-600 rounded-full transition-all border-2 border-gray-200 flex items-center justify-center"
                                                aria-label="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredVariants.length === 0 && !loadingVariants && savedVariants.length > 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium">No CVs found</p>
                                <p className="text-sm text-gray-500 mt-1">Try adjusting your search</p>
                            </div>
                        )}
                    </div>

                    {/* Rename CV Dialog */}
                    {renameDialog && (
                        <RenameCVDialog
                            isOpen={renameDialog.isOpen}
                            currentName={renameDialog.currentName || ''}
                            onClose={() => setRenameDialog(null)}
                            onRename={confirmRename}
                        />
                    )}

                    {/* Notification */}
                    {notification && (
                        <Notification
                            type={notification.type}
                            title={notification.title}
                            message={notification.message}
                            isOpen={!!notification}
                            onClose={() => setNotification(null)}
                        />
                    )}

                    {/* Confirm Dialog */}
                    {confirmDialog && (
                        <ConfirmDialog
                            isOpen={confirmDialog.isOpen}
                            title="Delete CV Variant?"
                            message="This action cannot be undone. Are you sure you want to permanently delete this CV variant?"
                            confirmText="Delete"
                            cancelText="Cancel"
                            confirmVariant="danger"
                            onConfirm={confirmDelete}
                            onCancel={() => setConfirmDialog(null)}
                        />
                    )}

                    {/* Sign Out Confirm Dialog */}
                    <ConfirmDialog
                        isOpen={signOutDialog}
                        title="Sign Out?"
                        message="Are you sure you want to sign out of your account?"
                        confirmText="Sign Out"
                        cancelText="Cancel"
                        confirmVariant="danger"
                        onConfirm={() => {
                            setSignOutDialog(false)
                            handleSignOut()
                        }}
                        onCancel={() => setSignOutDialog(false)}
                    />

                    {/* Back to Home */}
                    <div className="text-center">
                        <Link
                            href={`/${lang}`}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-semibold transition-colors"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer lang={lang} />
        </>
    )
}
