import React from 'react'
import { Save, Eye, EyeOff, Clock, Check } from 'lucide-react'

interface EditorHeaderProps {
    lastSaved: Date | null
    hasUnsavedChanges: boolean
    saving: boolean
    showPreview: boolean
    error: string | null
    successMessage: string | null
    cvName?: string
    isNewCV?: boolean
    onSave: () => void
    onCancel?: () => void
    onTogglePreview: () => void
    onCvNameChange?: (name: string) => void
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
    lastSaved,
    hasUnsavedChanges,
    saving,
    showPreview,
    error,
    successMessage,
    cvName,
    isNewCV,
    onSave,
    onCancel,
    onTogglePreview,
    onCvNameChange
}) => {
    return (
        <>
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                            {isNewCV && onCvNameChange ? (
                                <div className="flex items-center gap-2 min-w-0 flex-1 max-w-md">
                                    <label htmlFor="cv-name" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        CV Name:
                                    </label>
                                    <input
                                        id="cv-name"
                                        type="text"
                                        value={cvName || ''}
                                        onChange={(e) => onCvNameChange(e.target.value)}
                                        placeholder="Enter CV name..."
                                        className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff007a] focus:border-transparent"
                                    />
                                </div>
                            ) : (
                                <h1 className="text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap">Edit CV</h1>
                            )}
                            {lastSaved && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200">
                                    {hasUnsavedChanges ? (
                                        <>
                                            <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                            <span className="text-amber-600">Unsaved changes</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-green-500" />
                                            <span className="text-green-600">
                                                Saved {lastSaved.toLocaleTimeString()}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={onTogglePreview}
                                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff007a] focus:ring-offset-1"
                                title={showPreview ? 'Hide Preview' : 'Show Preview'}
                            >
                                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                <span>{showPreview ? 'Hide' : 'Show'}</span>
                            </button>

                            <button
                                onClick={onTogglePreview}
                                className="lg:hidden p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff007a] focus:ring-offset-1"
                                title={showPreview ? 'Hide Preview' : 'Show Preview'}
                            >
                                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>

                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                onClick={onSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-[#ff007a] to-[#e6006d] rounded-lg hover:from-[#e6006d] hover:to-[#cc0061] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ff007a] focus:ring-offset-2"
                            >
                                <Save className="w-4 h-4" />
                                <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Changes'}</span>
                                <span className="sm:hidden">Save</span>
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg mt-3 md:mt-4 max-w-[1800px] mx-auto text-sm md:text-base">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-3 md:px-4 py-2 md:py-3 rounded-lg mt-3 md:mt-4 max-w-[1800px] mx-auto text-sm md:text-base">
                        {successMessage}
                    </div>
                )}
            </div>
        </>
    )
}
