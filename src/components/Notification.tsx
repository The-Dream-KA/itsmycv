'use client'

import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X, Info, AlertTriangle } from 'lucide-react'

export interface NotificationProps {
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message?: string
    isOpen: boolean
    onClose: () => void
    autoClose?: boolean
    duration?: number
}

export default function Notification({
    type,
    title,
    message,
    isOpen,
    onClose,
    autoClose = true,
    duration = 3000
}: NotificationProps) {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [isOpen, autoClose, duration, onClose])

    if (!isOpen) return null

    const icons = {
        success: <CheckCircle2 className="w-6 h-6 text-green-600" />,
        error: <AlertCircle className="w-6 h-6 text-red-600" />,
        info: <Info className="w-6 h-6 text-blue-600" />,
        warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />
    }

    const colors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-yellow-50 border-yellow-200'
    }

    const textColors = {
        success: 'text-green-900',
        error: 'text-red-900',
        info: 'text-blue-900',
        warning: 'text-yellow-900'
    }

    const buttonColors = {
        success: 'hover:bg-green-100 text-green-700',
        error: 'hover:bg-red-100 text-red-700',
        info: 'hover:bg-blue-100 text-blue-700',
        warning: 'hover:bg-yellow-100 text-yellow-700'
    }

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

            {/* Notification */}
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slideDown">
                <div className={`${colors[type]} border-2 rounded-xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-sm`}>
                    {/* Icon with animation */}
                    <div className="flex-shrink-0 animate-scaleIn">
                        {icons[type]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold ${textColors[type]} text-base`}>
                            {title}
                        </h3>
                        {message && (
                            <p className={`text-sm ${textColors[type]} opacity-90 mt-1`}>
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className={`flex-shrink-0 p-1 rounded-full transition-colors ${buttonColors[type]}`}
                        aria-label="Close notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    )
}
