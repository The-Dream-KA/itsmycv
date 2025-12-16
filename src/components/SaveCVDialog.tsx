'use client'

import { useState } from 'react'
import { Check, X, Loader2, Save } from 'lucide-react'

interface SaveCVDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (variantName: string, isPrimary: boolean) => Promise<void>
    defaultName?: string
}

export default function SaveCVDialog({ isOpen, onClose, onSave, defaultName }: SaveCVDialogProps) {
    const [variantName, setVariantName] = useState(defaultName || `CV ${new Date().toLocaleDateString()}`)
    const [isPrimary, setIsPrimary] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSave = async () => {
        if (!variantName.trim()) {
            setError('Please enter a name for this CV variant')
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            await onSave(variantName, isPrimary)
            setShowSuccess(true)

            // Auto-close after showing success animation
            setTimeout(() => {
                setShowSuccess(false)
                onClose()
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save CV')
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    // Success state
    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-scale-in">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-10 h-10 text-white animate-check-draw" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            CV Saved Successfully!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your CV variant has been saved to your profile
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Save className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        Save CV Data
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="variantName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CV Variant Name
                        </label>
                        <input
                            id="variantName"
                            type="text"
                            value={variantName}
                            onChange={(e) => setVariantName(e.target.value)}
                            disabled={isSaving}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            placeholder="e.g., Software Engineer CV, Designer CV"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Give this CV a descriptive name to help you identify it later
                        </p>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <input
                            id="isPrimary"
                            type="checkbox"
                            checked={isPrimary}
                            onChange={(e) => setIsPrimary(e.target.checked)}
                            disabled={isSaving}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                        />
                        <label htmlFor="isPrimary" className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Set as primary CV</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Your primary CV will be used as the default
                            </p>
                        </label>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Save CV
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
