/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skill } from '../types'

export const addItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, template: T) => {
    setter((prev: T[]) => [...prev, template])
}

export const removeItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
    setter((prev: T[]) => prev.filter((_, i) => i !== index))
}

export const updateItem = <T extends Record<string, unknown>>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    field: string,
    value: unknown,
    setHasUnsavedChanges: (value: boolean) => void,
    triggerAutosave: () => void
) => {
    setter((prev: T[]) =>
        prev.map((item, i) => i === index ? { ...item, [field]: value } : item)
    )
    setHasUnsavedChanges(true)
    triggerAutosave()
}

export const moveItem = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    direction: 'up' | 'down',
    setHasUnsavedChanges: (value: boolean) => void
) => {
    setter((prev: T[]) => {
        const newArray = [...prev]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= newArray.length) return prev
            ;[newArray[index], newArray[targetIndex]] = [newArray[targetIndex], newArray[index]]
        return newArray
    })
    setHasUnsavedChanges(true)
}

export const convertSkillsToObject = (skills: Skill[]): Record<string, unknown> => {
    const skillsObject: Record<string, unknown> = {}
    skills.forEach((skillCat: Skill) => {
        if (skillCat.category && skillCat.skills) {
            skillsObject[skillCat.category as string] = skillCat.skills
        }
    })
    return skillsObject
}

export const convertSkillsToArray = (skills: any): Skill[] => {
    if (Array.isArray(skills)) {
        return skills
    } else if (typeof skills === 'object' && skills !== null) {
        return Object.entries(skills)
            .filter(([key]) => key !== '_type' && key !== 'type' && key !== 'id')
            .map(([category, skillList]) => ({
                category,
                skills: Array.isArray(skillList) ? skillList :
                    typeof skillList === 'string' ? skillList.split(',').map((s: string) => s.trim()) :
                        []
            }))
    }
    return []
}

export const processWorkExperience = (workExperience: any[]): any[] => {
    return workExperience.map((exp: any) => {
        const hasEndDate = exp.endDate || exp.end || exp.to || exp.endYear ||
            (exp.duration && typeof exp.duration === 'string' && exp.duration.includes('-'))

        let responsibilities = exp.responsibilities || exp.description || []
        if (typeof responsibilities === 'string') {
            responsibilities = responsibilities
                .split(/\n|•/)
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0)
        } else if (!Array.isArray(responsibilities)) {
            responsibilities = []
        }

        return {
            ...exp,
            showEndDate: hasEndDate ? true : false,
            responsibilities: responsibilities
        }
    })
}

export const formatWorkExperienceForPreview = (workExperience: any[]) => {
    return workExperience.map(exp => {
        let duration = ''
        const startDate = exp.startDate || exp.start || exp.from || exp.startYear || ''
        const endDate = exp.endDate || exp.end || exp.to || exp.endYear || ''

        if (startDate) {
            duration = startDate
            if (endDate) {
                duration += ` - ${endDate}`
            } else if (exp.current) {
                duration += ' - Present'
            }
        }

        return {
            ...exp,
            duration: duration || exp.duration,
            position: exp.title || exp.position,
            title: exp.title,
            responsibilities: exp.description || exp.responsibilities,
            description: exp.description,
        }
    })
}

export const formatEducationForPreview = (education: any[]) => {
    return education.map(edu => {
        let graduationDate = ''
        const startDate = edu.startDate || edu.start || edu.from || ''
        const endDate = edu.endDate || edu.end || edu.to || ''

        if (startDate && endDate) {
            graduationDate = `${startDate} - ${endDate}`
        } else if (endDate) {
            graduationDate = endDate
        } else if (startDate) {
            graduationDate = startDate
        }

        return {
            ...edu,
            graduationDate: graduationDate || edu.graduationDate || edu.duration || edu.period,
        }
    })
}
