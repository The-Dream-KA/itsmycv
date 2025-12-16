'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

interface CVData {
    [key: string]: unknown
}

interface CVUploaderProps {
    onScanComplete: (data: CVData, fileName?: string, fileSize?: number) => void
    onError: (error: string) => void
}

export default function CVUploader({ onScanComplete, onError }: CVUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [progress, setProgress] = useState<string>('')

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const validateFile = useCallback((file: File): boolean => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ]

        if (!allowedTypes.includes(file.type)) {
            onError('Please upload a PDF or DOCX file')
            return false
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            onError('File size must be less than 10MB')
            return false
        }

        return true
    }, [onError])

    const scanCV = useCallback(async (file: File) => {
        setIsScanning(true)
        setProgress('Uploading file...')

        try {
            const formData = new FormData()
            formData.append('file', file)

            setProgress('Extracting text from CV...')

            const response = await fetch('/api/scan-cv', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                // Provide more context for rate limit and overload errors
                if (result.error?.includes('overloaded')) {
                    throw new Error('🔄 ' + result.error + (result.suggestion ? '\n\n💡 ' + result.suggestion : ''))
                } else if (result.error?.includes('rate limit')) {
                    throw new Error('⏱️ ' + result.error + (result.suggestion ? '\n\n💡 ' + result.suggestion : ''))
                } else {
                    throw new Error(result.error || 'Failed to scan CV')
                }
            }

            setProgress('Analyzing CV with AI...')

            // Simulate a slight delay to show the AI is working
            await new Promise((resolve) => setTimeout(resolve, 500))

            setProgress('Complete!')
            onScanComplete(result.data, file.name, file.size)
        } catch (error) {
            console.error('Error scanning CV:', error)
            onError(error instanceof Error ? error.message : 'Failed to scan CV')
        } finally {
            setIsScanning(false)
            setProgress('')
        }
    }, [onScanComplete, onError])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)

            const files = Array.from(e.dataTransfer.files)
            if (files.length > 0) {
                const file = files[0]
                if (validateFile(file)) {
                    setSelectedFile(file)
                    scanCV(file)
                }
            }
        },
        [scanCV, validateFile]
    )

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            if (validateFile(file)) {
                setSelectedFile(file)
                scanCV(file)
            }
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setProgress('')
    }

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    } ${isScanning ? 'pointer-events-none opacity-60' : ''}`}
            >
                <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isScanning}
                />

                {!selectedFile && !isScanning && (
                    <label
                        htmlFor="cv-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                    >
                        <div className="w-16 h-16 mb-4 rounded-full bg-[#96ff70] dark:bg-[#96ff70]/20 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            Upload your CV
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                            Drag and drop your CV here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Supports PDF and DOCX files (max 10MB)
                        </p>
                    </label>
                )}

                {isScanning && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            Scanning your CV...
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{progress}</p>
                    </div>
                )}

                {selectedFile && !isScanning && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-black" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                            aria-label="Remove file"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Note:</strong> Your CV is processed securely and not stored on our servers.
                    We only extract the information to display it back to you.
                </p>
            </div>
        </div>
    )
}
