'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, GraduationCap, Award, FileText, Globe, GripVertical, User } from 'lucide-react'
import CVDataDisplay from '../CVDataDisplay'
import { CVEditorProps } from './types'
import { useCVData, useAutosave, useResizePanel, useExpandedSections } from './hooks'
import {
    addItem,
    removeItem,
    updateItem as utilUpdateItem,
    moveItem as utilMoveItem,
    convertSkillsToObject,
    formatWorkExperienceForPreview,
    formatEducationForPreview
} from './utils'
import { EditorHeader } from './components'
import {
    PersonalInfoSection,
    ProfessionalSummarySection,
    WorkExperienceSection,
    SkillsSection,
    GenericArraySection
} from './sections'

export default function CVEditor({ token, initialData, isNewCV, onSave, onCancel }: CVEditorProps) {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [showPreview, setShowPreview] = useState(true)
    const [cvName, setCvName] = useState<string>('')

    // Load CV data
    const {
        loading,
        error: loadError,
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
    } = useCVData(token, initialData)

    // Resize panel hook
    const { editorWidth, containerRef, handleMouseDown } = useResizePanel()

    // Expanded sections hook
    const { expandedSections, toggleSection } = useExpandedSections()

    // State for autosave
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Save function
    const handleSave = useCallback(async (isAutosave = false) => {
        if (!isAutosave) {
            setSaving(true)
        }
        setError(null)
        if (!isAutosave) {
            setSuccessMessage(null)
        }

        try {
            const cvData = {
                personalInformation: personalInfo,
                professionalSummary,
                workExperience,
                education,
                skills: convertSkillsToObject(skills),
                certifications,
                projects,
                languages,
                awards,
                volunteerWork,
                publications,
                interests
            }

            let response, result

            if (isNewCV) {
                // Validate CV name for new CVs
                const finalCvName = cvName.trim() || personalInfo?.name || 'New CV'

                // Save as new CV
                response = await fetch('/api/cv/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        variantName: finalCvName,
                        fileName: finalCvName,
                        fileSize: 0,
                        isPrimary: false,
                        cvData
                    })
                })
            } else {
                // Update existing CV
                response = await fetch(`/api/cv/secure-edit/${token}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cvData })
                })
            }

            result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save CV')
            }

            setLastSaved(new Date())
            setHasUnsavedChanges(false)

            if (!isAutosave) {
                setSuccessMessage(isNewCV ? 'CV saved successfully!' : 'CV updated successfully!')
                setTimeout(() => setSuccessMessage(null), 3000)

                if (onSave) {
                    onSave()
                }
            }
        } catch (err) {
            if (!isAutosave) {
                setError(err instanceof Error ? err.message : 'Failed to save CV')
            }
        } finally {
            if (!isAutosave) {
                setSaving(false)
            }
        }
    }, [isNewCV, token, cvName, personalInfo, professionalSummary, workExperience, education, skills, certifications, projects, languages, awards, volunteerWork, publications, interests, onSave])

    // Autosave hook
    const { triggerAutosave } = useAutosave(handleSave)

    // Wrapper functions that include autosave
    const updateItem = useCallback(<T extends Record<string, unknown>>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        index: number,
        field: string,
        value: unknown
    ) => {
        utilUpdateItem(setter, index, field, value, setHasUnsavedChanges, triggerAutosave)
    }, [setHasUnsavedChanges, triggerAutosave])

    const moveItem = useCallback(<T,>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        index: number,
        direction: 'up' | 'down'
    ) => {
        utilMoveItem(setter, index, direction, setHasUnsavedChanges)
    }, [setHasUnsavedChanges])

    // Section has content checker
    const sectionHasContent = (section: string): boolean => {
        switch (section) {
            case 'personal':
                return Boolean(personalInfo.name || personalInfo.email || personalInfo.phone)
            case 'summary':
                return Boolean(professionalSummary)
            case 'work':
                return workExperience.length > 0
            case 'education':
                return education.length > 0
            case 'skills':
                return skills.length > 0
            case 'certifications':
                return certifications.length > 0
            case 'projects':
                return projects.length > 0
            case 'languages':
                return languages.length > 0
            case 'awards':
                return awards.length > 0
            case 'volunteer':
                return volunteerWork.length > 0
            case 'publications':
                return publications.length > 0
            case 'interests':
                return interests.length > 0
            default:
                return false
        }
    }

    useEffect(() => {
        loadCVData()
    }, [loadCVData])

    useEffect(() => {
        if (loadError) {
            setError(loadError)
        }
    }, [loadError])

    // Initialize CV name for new CVs
    useEffect(() => {
        if (isNewCV && !cvName && personalInfo?.name) {
            setCvName(`${personalInfo.name} CV`)
        }
    }, [isNewCV, cvName, personalInfo?.name])

    // Preview data
    const previewData = {
        personalInformation: personalInfo,
        professionalSummary,
        workExperience: formatWorkExperienceForPreview(workExperience),
        education: formatEducationForPreview(education),
        skills,
        certifications,
        projects,
        languages,
        awards,
        volunteerWork,
        publications,
        interests
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff007a] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading CV data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <EditorHeader
                lastSaved={lastSaved}
                hasUnsavedChanges={hasUnsavedChanges}
                saving={saving}
                showPreview={showPreview}
                error={error}
                successMessage={successMessage}
                cvName={cvName}
                isNewCV={isNewCV}
                onSave={() => handleSave(false)}
                onCancel={onCancel}
                onTogglePreview={() => setShowPreview(!showPreview)}
                onCvNameChange={setCvName}
            />

            <div ref={containerRef} className={`flex flex-col lg:flex-row ${showPreview ? 'gap-0' : ''} max-w-[1800px] mx-auto p-4 md:p-6 relative`}>
                {/* Editor Panel */}
                <div
                    className={`${showPreview ? 'lg:block' : 'w-full'} space-y-4 md:space-y-6 overflow-y-auto`}
                    style={{
                        width: showPreview ? (typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${editorWidth}%` : '100%') : '100%',
                        maxHeight: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'calc(100vh - 150px)' : 'none',
                        paddingRight: showPreview && typeof window !== 'undefined' && window.innerWidth >= 1024 ? '1rem' : '0'
                    }}
                >
                    <PersonalInfoSection
                        personalInfo={personalInfo}
                        setPersonalInfo={setPersonalInfo}
                        isExpanded={expandedSections.personal}
                        hasContent={sectionHasContent('personal')}
                        onToggle={() => toggleSection('personal')}
                    />

                    <ProfessionalSummarySection
                        professionalSummary={professionalSummary}
                        setProfessionalSummary={setProfessionalSummary}
                        isExpanded={expandedSections.summary}
                        hasContent={sectionHasContent('summary')}
                        onToggle={() => toggleSection('summary')}
                    />

                    <WorkExperienceSection
                        workExperience={workExperience}
                        setWorkExperience={setWorkExperience}
                        isExpanded={expandedSections.work}
                        hasContent={sectionHasContent('work')}
                        onToggle={() => toggleSection('work')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                    />

                    <GenericArraySection
                        icon={GraduationCap}
                        title="Education"
                        sectionKey="education"
                        items={education}
                        setItems={setEducation}
                        isExpanded={expandedSections.education}
                        hasContent={sectionHasContent('education')}
                        onToggle={() => toggleSection('education')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                        template={{
                            degree: '',
                            institution: '',
                            location: '',
                            startDate: '',
                            endDate: '',
                            gpa: '',
                            description: ''
                        }}
                        fields={[
                            { name: 'degree', label: 'Degree', type: 'text', placeholder: 'Bachelor of Science in Computer Science' },
                            { name: 'institution', label: 'Institution', type: 'text', placeholder: 'University Name' },
                            { name: 'location', label: 'Location', type: 'text', placeholder: 'City, Country' },
                            { name: 'startDate', label: 'Start Date', type: 'text', placeholder: 'e.g., 09/2018' },
                            { name: 'endDate', label: 'End Date', type: 'text', placeholder: 'e.g., 06/2022' },
                            { name: 'gpa', label: 'GPA (Optional)', type: 'text', placeholder: 'e.g., 3.8/4.0' },
                            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Additional details...', rows: 3 }
                        ]}
                        itemLabel="Education"
                    />

                    <SkillsSection
                        skills={skills}
                        setSkills={setSkills}
                        isExpanded={expandedSections.skills}
                        hasContent={sectionHasContent('skills')}
                        onToggle={() => toggleSection('skills')}
                        removeItem={removeItem}
                        updateItem={updateItem}
                    />

                    <GenericArraySection
                        icon={Globe}
                        title="Languages"
                        sectionKey="languages"
                        items={languages}
                        setItems={setLanguages}
                        isExpanded={expandedSections.languages}
                        hasContent={sectionHasContent('languages')}
                        onToggle={() => toggleSection('languages')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                        template={{ name: '', proficiency: '' }}
                        fields={[
                            { name: 'name', label: 'Language', type: 'text', placeholder: 'e.g., English' },
                            { name: 'proficiency', label: 'Proficiency', type: 'text', placeholder: 'e.g., Native, Fluent, Intermediate' }
                        ]}
                        itemLabel="Language"
                    />

                    <GenericArraySection
                        icon={Award}
                        title="Certifications"
                        sectionKey="certifications"
                        items={certifications}
                        setItems={setCertifications}
                        isExpanded={expandedSections.certifications}
                        hasContent={sectionHasContent('certifications')}
                        onToggle={() => toggleSection('certifications')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                        template={{ name: '', issuer: '', date: '', url: '' }}
                        fields={[
                            { name: 'name', label: 'Certification Name', type: 'text', placeholder: 'AWS Certified Solutions Architect' },
                            { name: 'issuer', label: 'Issuing Organization', type: 'text', placeholder: 'Amazon Web Services' },
                            { name: 'date', label: 'Date Obtained', type: 'text', placeholder: 'e.g., 03/2024' },
                            { name: 'url', label: 'Credential URL (Optional)', type: 'url', placeholder: 'https://...' }
                        ]}
                        itemLabel="Certification"
                    />

                    <GenericArraySection
                        icon={FileText}
                        title="Projects"
                        sectionKey="projects"
                        items={projects}
                        setItems={setProjects}
                        isExpanded={expandedSections.projects}
                        hasContent={sectionHasContent('projects')}
                        onToggle={() => toggleSection('projects')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                        template={{ name: '', description: '', technologies: '', url: '', startDate: '', endDate: '' }}
                        fields={[
                            { name: 'name', label: 'Project Name', type: 'text', placeholder: 'E-commerce Platform' },
                            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of the project...', rows: 3 },
                            { name: 'technologies', label: 'Technologies Used', type: 'text', placeholder: 'React, Node.js, MongoDB' },
                            { name: 'url', label: 'Project URL (Optional)', type: 'url', placeholder: 'https://...' },
                            { name: 'startDate', label: 'Start Date', type: 'text', placeholder: 'e.g., 01/2024' },
                            { name: 'endDate', label: 'End Date', type: 'text', placeholder: 'e.g., 06/2024' }
                        ]}
                        itemLabel="Project"
                    />

                    <GenericArraySection
                        icon={Award}
                        title="Awards & Honors"
                        sectionKey="awards"
                        items={awards}
                        setItems={setAwards}
                        isExpanded={expandedSections.awards}
                        hasContent={sectionHasContent('awards')}
                        onToggle={() => toggleSection('awards')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                        template={{ title: '', issuer: '', date: '', description: '' }}
                        fields={[
                            { name: 'title', label: 'Award Title', type: 'text', placeholder: 'Employee of the Year' },
                            { name: 'issuer', label: 'Issuing Organization', type: 'text', placeholder: 'Company Name' },
                            { name: 'date', label: 'Date Received', type: 'text', placeholder: 'e.g., 12/2023' },
                            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description...', rows: 2 }
                        ]}
                        itemLabel="Award"
                    />

                    <GenericArraySection
                        icon={User}
                        title="Volunteer Work"
                        sectionKey="volunteer"
                        items={volunteerWork}
                        setItems={setVolunteerWork}
                        isExpanded={expandedSections.volunteer}
                        hasContent={sectionHasContent('volunteer')}
                        onToggle={() => toggleSection('volunteer')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                        template={{ role: '', organization: '', startDate: '', endDate: '', description: '' }}
                        fields={[
                            { name: 'role', label: 'Role', type: 'text', placeholder: 'Volunteer Coordinator' },
                            { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Non-Profit Name' },
                            { name: 'startDate', label: 'Start Date', type: 'text', placeholder: 'e.g., 01/2023' },
                            { name: 'endDate', label: 'End Date', type: 'text', placeholder: 'e.g., 12/2023' },
                            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your volunteer work...', rows: 3 }
                        ]}
                        itemLabel="Volunteer Work"
                    />

                    <GenericArraySection
                        icon={FileText}
                        title="Publications"
                        sectionKey="publications"
                        items={publications}
                        setItems={setPublications}
                        isExpanded={expandedSections.publications}
                        hasContent={sectionHasContent('publications')}
                        onToggle={() => toggleSection('publications')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                        template={{ title: '', publisher: '', date: '', url: '', description: '' }}
                        fields={[
                            { name: 'title', label: 'Publication Title', type: 'text', placeholder: 'Research Paper Title' },
                            { name: 'publisher', label: 'Publisher', type: 'text', placeholder: 'Journal Name' },
                            { name: 'date', label: 'Publication Date', type: 'text', placeholder: 'e.g., 06/2023' },
                            { name: 'url', label: 'URL (Optional)', type: 'url', placeholder: 'https://...' },
                            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description...', rows: 2 }
                        ]}
                        itemLabel="Publication"
                    />

                    <GenericArraySection
                        icon={Globe}
                        title="Interests & Hobbies"
                        sectionKey="interests"
                        items={interests}
                        setItems={setInterests}
                        isExpanded={expandedSections.interests}
                        hasContent={sectionHasContent('interests')}
                        onToggle={() => toggleSection('interests')}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        moveItem={moveItem}
                        template={{ name: '', description: '' }}
                        fields={[
                            { name: 'name', label: 'Interest/Hobby', type: 'text', placeholder: 'Photography' },
                            { name: 'description', label: 'Description (Optional)', type: 'textarea', placeholder: 'Brief description...', rows: 2 }
                        ]}
                        itemLabel="Interest"
                    />

                    {/* Bottom Save Button */}
                    <div className="flex justify-end gap-3 pt-6">
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="px-6 py-2.5 bg-[#ff007a] text-white rounded-lg hover:bg-[#e6006d] transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Resize Handle */}
                {showPreview && (
                    <div
                        className="hidden lg:block w-2 bg-gray-200 hover:bg-[#ff007a] cursor-col-resize relative group transition-all duration-200 mx-1"
                        onMouseDown={handleMouseDown}
                        style={{ minWidth: '8px' }}
                    >
                        <div className="absolute inset-y-0 -left-2 -right-2 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-4 h-4 text-gray-600 group-hover:text-[#ff007a] transition-colors" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Panel */}
                {showPreview && (
                    <div
                        className="mt-4 lg:mt-0 lg:sticky lg:top-[120px] overflow-y-auto bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200"
                        style={{
                            width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${100 - editorWidth}%` : '100%',
                            maxHeight: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'calc(100vh - 150px)' : 'none',
                            paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '1rem' : ''
                        }}
                    >
                        <div className="mb-3 md:mb-4 flex items-center justify-between">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Live Preview</h2>

                        </div>
                        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                            <CVDataDisplay data={previewData} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
