/* eslint-disable @typescript-eslint/no-explicit-any */

export type PersonalInfo = any
export type WorkExperience = any
export type Education = any
export type Skill = any
export type Certification = any
export type Language = any

export interface CVEditorProps {
    token?: string
    initialData?: CVData
    isNewCV?: boolean
    onSave?: () => void
    onCancel?: () => void
}

export interface CVData {
    personalInformation: PersonalInfo
    professionalSummary: string
    workExperience: WorkExperience[]
    education: Education[]
    skills: Skill[]
    certifications: Certification[]
    projects: Record<string, unknown>[]
    languages: Language[]
    awards: Record<string, unknown>[]
    volunteerWork: Record<string, unknown>[]
    publications: Record<string, unknown>[]
    interests: Record<string, unknown>[]
}

export interface ExpandedSections {
    personal: boolean
    summary: boolean
    work: boolean
    education: boolean
    skills: boolean
    certifications: boolean
    projects: boolean
    languages: boolean
    awards: boolean
    volunteer: boolean
    publications: boolean
    interests: boolean
}

export interface SectionHeaderProps {
    icon: React.ElementType
    title: string
    sectionKey: string
    itemCount?: number
    isExpanded: boolean
    hasContent: boolean
    onToggle: () => void
}
