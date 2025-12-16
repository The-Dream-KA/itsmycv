import { useState, useCallback } from 'react'
import {
    PersonalInfo,
    WorkExperience,
    Education,
    Skill,
    Certification,
    Language
} from '../types'
import {
    convertSkillsToArray,
    processWorkExperience
} from '../utils'

export const useCVData = (token?: string, initialData?: any) => {
    const [loading, setLoading] = useState(!initialData)
    const [error, setError] = useState<string | null>(null)

    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(
        initialData?.personalInformation || {
            name: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            website: '',
            github: '',
            facebook: '',
            instagram: '',
            whatsapp: '',
            youtube: '',
            tiktok: '',
            telegram: '',
            snapchat: '',
            x: ''
        }
    )

    const [professionalSummary, setProfessionalSummary] = useState<string>(initialData?.professionalSummary || '')
    const [workExperience, setWorkExperience] = useState<WorkExperience[]>(initialData?.workExperience ? processWorkExperience(initialData.workExperience) : [])
    const [education, setEducation] = useState<Education[]>(initialData?.education || [])
    const [skills, setSkills] = useState<Skill[]>(initialData?.skills ? convertSkillsToArray(initialData.skills) : [])
    const [certifications, setCertifications] = useState<Certification[]>(initialData?.certifications || [])
    const [projects, setProjects] = useState<Record<string, unknown>[]>(initialData?.projects || [])
    const [languages, setLanguages] = useState<Language[]>(initialData?.languages || [])
    const [awards, setAwards] = useState<Record<string, unknown>[]>(initialData?.awards || [])
    const [volunteerWork, setVolunteerWork] = useState<Record<string, unknown>[]>(initialData?.volunteerWork || [])
    const [publications, setPublications] = useState<Record<string, unknown>[]>(initialData?.publications || [])
    const [interests, setInterests] = useState<Record<string, unknown>[]>(initialData?.interests || [])

    const loadCVData = useCallback(async () => {
        if (!token) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/cv/secure-edit/${token}`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to load CV data')
            }

            if (result.success && result.data) {
                const { data } = result

                if (data.personalInformation) {
                    setPersonalInfo(data.personalInformation)
                }

                setProfessionalSummary(data.professionalSummary || '')

                if (Array.isArray(data.workExperience)) {
                    setWorkExperience(processWorkExperience(data.workExperience))
                } else {
                    setWorkExperience([])
                }

                setEducation(Array.isArray(data.education) ? data.education : [])
                setSkills(convertSkillsToArray(data.skills))
                setCertifications(Array.isArray(data.certifications) ? data.certifications : [])
                setProjects(Array.isArray(data.projects) ? data.projects : [])
                setLanguages(Array.isArray(data.languages) ? data.languages : [])
                setAwards(Array.isArray(data.awards) ? data.awards : [])
                setVolunteerWork(Array.isArray(data.volunteerWork) ? data.volunteerWork : [])
                setPublications(Array.isArray(data.publications) ? data.publications : [])
                setInterests(Array.isArray(data.interests) ? data.interests : [])
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load CV data')
        } finally {
            setLoading(false)
        }
    }, [token])

    return {
        loading,
        error,
        personalInfo,
        setPersonalInfo,
        professionalSummary,
        setProfessionalSummary,
        workExperience,
        setWorkExperience,
        education,
        setEducation,
        skills,
        setSkills,
        certifications,
        setCertifications,
        projects,
        setProjects,
        languages,
        setLanguages,
        awards,
        setAwards,
        volunteerWork,
        setVolunteerWork,
        publications,
        setPublications,
        interests,
        setInterests,
        loadCVData
    }
}
