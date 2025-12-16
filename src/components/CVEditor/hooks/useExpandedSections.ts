import { useState } from 'react'
import { ExpandedSections } from '../types'

export const useExpandedSections = () => {
    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        personal: true,
        summary: true,
        work: true,
        education: true,
        skills: true,
        certifications: false,
        projects: false,
        languages: false,
        awards: false,
        volunteer: false,
        publications: false,
        interests: false
    })

    const toggleSection = (section: keyof ExpandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    return {
        expandedSections,
        toggleSection
    }
}
