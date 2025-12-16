'use client'

import { use } from 'react'
import { Locale } from '@/i18n/config'
import Navbar from '@/components/Navbar'
import CVEditor from '@/components/CVEditor'
import { useRouter } from 'next/navigation'

/**
 * Secure CV Edit Page
 * Accessed only via time-limited encrypted tokens
 * No CV IDs are exposed in URLs or client-side code
 */
export default function SecureEditCVPage({
    params
}: {
    params: Promise<{ lang: Locale; token: string }>
}) {
    const { lang, token } = use(params)
    const router = useRouter()

    const handleSave = () => {
        // Redirect back to dashboard after successful save
        router.push(`/${lang}/dashboard`)
    }

    const handleCancel = () => {
        router.push(`/${lang}/dashboard`)
    }

    return (
        <>
            <Navbar lang={lang} />
            <div className="min-h-screen bg-gray-50 pt-20">
                {/* CV Editor with secure token-based access */}
                <CVEditor
                    token={token}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
        </>
    )
}
