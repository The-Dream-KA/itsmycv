'use client'

import { use, useState } from 'react'
import { Locale } from '@/i18n/config'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import CVEditor from '@/components/CVEditor'
import { CVData } from '@/components/CVEditor/types'

/**
 * New CV Editor Page
 * For editing scanned CVs before saving
 * CV data is stored temporarily in sessionStorage
 */
export default function NewCVEditPage({
    params
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = use(params)
    const router = useRouter()
    const [cvData] = useState<CVData | null>(() => {
        // Initialize state from sessionStorage (can be null for starting from scratch)
        if (typeof window !== 'undefined') {
            const storedData = sessionStorage.getItem('unsavedCVData')
            if (storedData) {
                try {
                    return JSON.parse(storedData)
                } catch (error) {
                    console.error('Error parsing CV data:', error)
                    return null
                }
            }
        }
        return null
    })

    const handleSave = () => {
        // Clear the temporary data after successful save
        sessionStorage.removeItem('unsavedCVData')
        router.push(`/${lang}/dashboard`)
    }

    const handleCancel = () => {
        // Clear temporary data on cancel
        sessionStorage.removeItem('unsavedCVData')
        router.push(`/${lang}/dashboard`)
    }

    return (
        <>
            <Navbar lang={lang} />
            <div className="min-h-screen bg-gray-50 pt-20">
                <CVEditor
                    initialData={cvData || undefined}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isNewCV={true}
                />
            </div>
        </>
    )
}
