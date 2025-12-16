'use client'

import { useState, useEffect } from 'react'
import { X, FileEdit } from 'lucide-react'

interface RenameCVDialogProps {
    isOpen: boolean
    currentName: string
    onClose: () => void
    onRename: (newName: string) => Promise<void>
}

export default function RenameCVDialog({
    isOpen,
    currentName,
    onClose,
    onRename
}: RenameCVDialogProps) {
    const [name, setName] = useState(currentName)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isOpen) {
            setName(currentName)
            setError('')
        }
    }, [isOpen, currentName])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Please enter a name for your CV')
            return
        }

        if (name.trim() === currentName) {
            onClose()
            return
        }

        setIsLoading(true)
        setError('')

        try {
            await onRename(name.trim())
            onClose()
        } catch (error: any) {
            setError(error.message || 'Failed to rename CV. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-8 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors disabled:opacity-50"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#00e5ff] rounded-full flex items-center justify-center">
                        <FileEdit className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-black rubik-mono-one-regular">
                            Rename CV
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Give your CV a new name
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="cv-name" className="block text-sm font-semibold text-black mb-2">
                            CV Name
                        </label>
                        <input
                            id="cv-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                setError('')
                            }}
                            disabled={isLoading}
                            placeholder="Enter CV name"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-[20px] focus:outline-none focus:border-[#00e5ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            maxLength={100}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !name.trim()}
                            className="flex-1 px-6 py-3 bg-[#00e5ff] hover:bg-black hover:text-white text-black font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                                    Renaming...
                                </>
                            ) : (
                                <>
                                    <FileEdit className="w-4 h-4" />
                                    Rename
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
