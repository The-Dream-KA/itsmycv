import React from 'react'
import { FileText } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'

interface ProfessionalSummarySectionProps {
    professionalSummary: string
    setProfessionalSummary: React.Dispatch<React.SetStateAction<string>>
    isExpanded: boolean
    hasContent: boolean
    onToggle: () => void
}

export const ProfessionalSummarySection: React.FC<ProfessionalSummarySectionProps> = ({
    professionalSummary,
    setProfessionalSummary,
    isExpanded,
    hasContent,
    onToggle
}) => {
    return (
        <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
            <SectionHeader
                icon={FileText}
                title="Professional Summary"
                sectionKey="summary"
                isExpanded={isExpanded}
                hasContent={hasContent}
                onToggle={onToggle}
            />
            {isExpanded && (
                <div className="animate-in fade-in duration-200">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Summary</label>
                    <textarea
                        ref={(el) => {
                            if (el) {
                                el.style.height = 'auto'
                                el.style.height = el.scrollHeight + 'px'
                            }
                        }}
                        placeholder="Write a brief professional summary..."
                        value={professionalSummary}
                        onChange={(e) => setProfessionalSummary(e.target.value)}
                        onInput={(e) => {
                            e.currentTarget.style.height = 'auto'
                            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
                        }}
                        rows={3}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base resize-none overflow-hidden"
                        style={{ minHeight: '80px' }}
                    />
                </div>
            )}
        </section>
    )
}
