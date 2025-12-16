import React from 'react'
import { ChevronUp, ChevronDown, Check } from 'lucide-react'
import { SectionHeaderProps } from '../types'

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    icon: Icon,
    title,
    itemCount,
    isExpanded,
    hasContent,
    onToggle
}) => {
    return (
        <div
            className="flex items-center justify-between mb-4 md:mb-6 cursor-pointer group"
            onClick={onToggle}
        >
            <div className="flex items-center gap-2 md:gap-3 flex-1">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#ff007a] flex-shrink-0" />
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">{title}</h2>
                {itemCount !== undefined && itemCount > 0 && (
                    <span className="bg-[#ff007a] text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-full">
                        {itemCount}
                    </span>
                )}
                {hasContent && (
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                )}
            </div>
            <div className="flex items-center gap-2">
                {!hasContent && (
                    <span className="text-xs md:text-sm text-gray-400 mr-2">Optional</span>
                )}
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-[#ff007a] transition-colors" />
                ) : (
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-[#ff007a] transition-colors" />
                )}
            </div>
        </div>
    )
}
