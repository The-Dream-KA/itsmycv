'use client'

import { CheckCircle2, Briefcase, GraduationCap, Award, Code, Globe, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react'
import SocialMediaIcons from './SocialMediaIcons'

interface CVDataDisplayProps {
    data: Record<string, unknown> | null
    showScanHeader?: boolean
}

export default function CVDataDisplay({ data, showScanHeader = false }: CVDataDisplayProps) {
    if (!data) return null

    const normalizeText = (value: unknown): string | null => {
        if (typeof value === 'number') {
            return value.toString()
        }

        if (typeof value === 'string') {
            const trimmed = value.trim()
            return trimmed.length ? trimmed : null
        }

        return null
    }

    const pickText = (values: unknown[], fallback: string | null = null): string | null => {
        for (const value of values) {
            const normalized = normalizeText(value)
            if (normalized) {
                return normalized
            }
        }
        return fallback
    }

    const getField = (obj: Record<string, unknown>, ...keys: string[]): unknown => {
        for (const key of keys) {
            // Check exact match
            if (key in obj && obj[key] !== null && obj[key] !== undefined) {
                const value = obj[key]
                // If it's an empty array or empty object, skip it
                if (Array.isArray(value) && value.length === 0) continue
                if (typeof value === 'object' && value !== null && Object.keys(value as Record<string, unknown>).length === 0) continue
                return value
            }
            // Check case-insensitive
            const lowerKey = key.toLowerCase()
            for (const objKey of Object.keys(obj)) {
                if (objKey.toLowerCase() === lowerKey) {
                    const value = obj[objKey]
                    if (value !== null && value !== undefined) {
                        // If it's an empty array or empty object, skip it
                        if (Array.isArray(value) && value.length === 0) continue
                        if (typeof value === 'object' && value !== null && Object.keys(value as Record<string, unknown>).length === 0) continue
                        return value
                    }
                }
            }
        }
        return null
    }

    const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
        if (!content) return null

        return (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                </div>
                {content}
            </div>
        )
    }

    const renderPersonalInfo = () => {
        const info = (getField(data, 'personalInformation', 'personal_information', 'personal', 'PersonalInformation', 'contactInformation', 'contact_information', 'contact') || {}) as Record<string, unknown>
        if (!info || Object.keys(info).length === 0) return null

        // Extract all possible personal fields
        const fields = {
            name: pickText([getField(info, 'name', 'Name', 'fullName', 'full_name', 'fullname')]),
            email: pickText([getField(info, 'email', 'Email', 'emailAddress', 'email_address', 'mail')]),
            phone: pickText([getField(info, 'phone', 'Phone', 'phoneNumber', 'phone_number', 'mobile', 'Mobile', 'tel', 'telephone')]),
            location: pickText([getField(info, 'location', 'Location', 'address', 'Address', 'fullAddress', 'full_address', 'completeAddress', 'complete_address')]),
            fullAddress: pickText([getField(info, 'fullAddress', 'full_address', 'completeAddress', 'complete_address', 'residentialAddress', 'residential_address', 'location', 'Location')]),
            country: pickText([getField(info, 'country', 'Country')]),
            nationality: pickText([getField(info, 'nationality', 'Nationality')]),
            dateOfBirth: pickText([getField(info, 'dateOfBirth', 'date_of_birth', 'dob', 'DOB', 'birthDate', 'birth_date')]),
            linkedin: pickText([getField(info, 'linkedin', 'LinkedIn', 'linkedIn', 'linkedInUrl', 'linkedin_url')]),
            github: pickText([getField(info, 'github', 'GitHub', 'Github', 'githubUrl', 'github_url')]),
            website: pickText([getField(info, 'website', 'Website', 'portfolioWebsite', 'portfolio', 'personalWebsite', 'personal_website', 'homepage')]),
            portfolio: pickText([getField(info, 'portfolio', 'Portfolio', 'portfolioUrl', 'portfolio_url')]),
            twitter: pickText([getField(info, 'twitter', 'Twitter', 'twitterUrl', 'twitter_url', 'x', 'X')]),
            drivenLicense: pickText([getField(info, 'drivingLicense', 'driving_license', 'drivenLicense', 'driven_license', 'license')]),
            visaStatus: pickText([getField(info, 'visaStatus', 'visa_status', 'workPermit', 'work_permit')]),
            // Social Media
            facebook: pickText([getField(info, 'facebook', 'Facebook', 'facebookUrl', 'facebook_url')]),
            instagram: pickText([getField(info, 'instagram', 'Instagram', 'instagramUrl', 'instagram_url')]),
            whatsapp: pickText([getField(info, 'whatsapp', 'WhatsApp', 'whatsappUrl', 'whatsapp_url')]),
            youtube: pickText([getField(info, 'youtube', 'YouTube', 'youtubeUrl', 'youtube_url')]),
            tiktok: pickText([getField(info, 'tiktok', 'TikTok', 'tiktokUrl', 'tiktok_url')]),
            telegram: pickText([getField(info, 'telegram', 'Telegram', 'telegramUrl', 'telegram_url')]),
            snapchat: pickText([getField(info, 'snapchat', 'Snapchat', 'snapchatUrl', 'snapchat_url')]),
            x: pickText([getField(info, 'x', 'X')]),
        }

        // Build social media links array
        const socialLinks = []
        if (fields.linkedin) socialLinks.push({ url: fields.linkedin, platform: 'linkedin' as const })
        if (fields.github) socialLinks.push({ url: fields.github, platform: 'github' as const })
        if (fields.facebook) socialLinks.push({ url: fields.facebook, platform: 'facebook' as const })
        if (fields.instagram) socialLinks.push({ url: fields.instagram, platform: 'instagram' as const })
        if (fields.whatsapp) socialLinks.push({ url: fields.whatsapp, platform: 'whatsapp' as const })
        if (fields.youtube) socialLinks.push({ url: fields.youtube, platform: 'youtube' as const })
        if (fields.tiktok) socialLinks.push({ url: fields.tiktok, platform: 'tiktok' as const })
        if (fields.telegram) socialLinks.push({ url: fields.telegram, platform: 'telegram' as const })
        if (fields.snapchat) socialLinks.push({ url: fields.snapchat, platform: 'snapchat' as const })
        if (fields.x) socialLinks.push({ url: fields.x, platform: 'x' as const })
        if (fields.twitter && !fields.x) socialLinks.push({ url: fields.twitter, platform: 'x' as const })

        // Get any additional fields not covered above
        const standardKeys = ['name', 'email', 'phone', 'location', 'fullAddress', 'address', 'city', 'country', 'nationality',
            'dateOfBirth', 'dob', 'linkedin', 'github', 'website', 'portfolio', 'twitter', 'drivingLicense',
            'drivenLicense', 'visaStatus', 'workPermit', 'facebook', 'instagram', 'whatsapp', 'youtube', 'tiktok',
            'telegram', 'snapchat', 'x']
        const additionalFields: Record<string, string> = {}
        Object.entries(info).forEach(([key, value]) => {
            if (!standardKeys.some(k => k.toLowerCase() === key.toLowerCase())) {
                const text = pickText([value])
                if (text) {
                    additionalFields[key] = text
                }
            }
        })

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                {fields.name && (
                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{fields.name}</p>
                    </div>
                )}
                {fields.email && (
                    <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                            <a href={`mailto:${fields.email}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all">
                                {fields.email}
                            </a>
                        </div>
                    </div>
                )}
                {fields.phone && (
                    <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                            <a href={`tel:${fields.phone}`} className="font-medium text-gray-900 dark:text-white hover:underline">
                                {fields.phone}
                            </a>
                        </div>
                    </div>
                )}
                {(fields.location || fields.fullAddress) && (
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                            <p className="font-medium text-gray-900 dark:text-white">{fields.fullAddress || fields.location}</p>
                        </div>
                    </div>
                )}
                {fields.country && (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Country</p>
                        <p className="font-medium text-gray-900 dark:text-white">{fields.country}</p>
                    </div>
                )}
                {fields.nationality && (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nationality</p>
                        <p className="font-medium text-gray-900 dark:text-white">{fields.nationality}</p>
                    </div>
                )}
                {fields.dateOfBirth && (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                        <p className="font-medium text-gray-900 dark:text-white">{fields.dateOfBirth}</p>
                    </div>
                )}
                {fields.drivenLicense && (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Driving License</p>
                        <p className="font-medium text-gray-900 dark:text-white">{fields.drivenLicense}</p>
                    </div>
                )}
                {fields.visaStatus && (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Visa/Work Permit</p>
                        <p className="font-medium text-gray-900 dark:text-white">{fields.visaStatus}</p>
                    </div>
                )}
                {(fields.website || fields.portfolio) && (
                    <div className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Website/Portfolio</p>
                            <a
                                href={(() => {
                                    const url = (fields.website || fields.portfolio) as string;
                                    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
                                })()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all text-sm"
                            >
                                {fields.website || fields.portfolio}
                            </a>
                        </div>
                    </div>
                )}
                {socialLinks.length > 0 && (
                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Social Media</p>
                        <SocialMediaIcons socialLinks={socialLinks} />
                    </div>
                )}
                {Object.entries(additionalFields).map(([key, value]) => (
                    <div key={key}>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                    </div>
                ))}
            </div>
        )
    }

    const renderSummary = () => {
        const summary = pickText([
            getField(data, 'professionalSummary', 'professional_summary', 'summary', 'objective', 'ProfessionalSummary', 'Summary', 'Objective')
        ])
        if (!summary) return null

        return (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-900">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{summary}</p>
            </div>
        )
    }

    const renderWorkExperience = () => {
        const experience = (getField(data, 'workExperience', 'work_experience', 'experience', 'WorkExperience', 'Employment', 'employment', 'ProfessionalExperience', 'professional_experience') || []) as Record<string, unknown>[]
        if (!Array.isArray(experience) || experience.length === 0) return null

        return (
            <div className="space-y-6">
                {experience.map((job: Record<string, unknown>, index: number) => {
                    const position = pickText([getField(job, 'position', 'Position', 'title', 'Title', 'role', 'Role', 'jobTitle', 'job_title')], 'Position')
                    const company = pickText([getField(job, 'company', 'Company', 'organization', 'Organization', 'employer', 'Employer')], 'Company')
                    const duration = pickText([getField(job, 'duration', 'Duration', 'period', 'Period', 'dates', 'Dates', 'timeframe', 'years')])
                    const location = pickText([getField(job, 'location', 'Location')])
                    const responsibilities = getField(job, 'responsibilities', 'Responsibilities', 'duties', 'Duties', 'description', 'Description')
                    const achievements = getField(job, 'achievements', 'Achievements', 'accomplishments', 'Accomplishments', 'highlights', 'Highlights')

                    return (
                        <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{position}</h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">{company}</p>
                                    {location && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{location}</p>
                                    )}
                                </div>
                                {duration && (
                                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-0">
                                        {duration}
                                    </span>
                                )}
                            </div>
                            {responsibilities !== undefined && responsibilities !== null && (
                                <div className="mt-3">
                                    {Array.isArray(responsibilities) ? (
                                        <ul className="list-disc list-inside space-y-1.5 text-gray-700 dark:text-gray-300">
                                            {(responsibilities as string[]).map((resp: string, i: number) => (
                                                <li key={i} className="leading-relaxed">{resp}</li>
                                            ))}
                                        </ul>
                                    ) : typeof responsibilities === 'string' ? (
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{responsibilities}</p>
                                    ) : null}
                                </div>
                            )}
                            {achievements !== undefined && achievements !== null && (
                                <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Key Achievements:</p>
                                    {Array.isArray(achievements) ? (
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                            {(achievements as string[]).map((achievement: string, i: number) => (
                                                <li key={i} className="leading-relaxed">{achievement}</li>
                                            ))}
                                        </ul>
                                    ) : typeof achievements === 'string' ? (
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{achievements}</p>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderEducation = () => {
        const education = (getField(data, 'education', 'Education', 'academicBackground', 'academic_background', 'qualifications', 'Qualifications') || []) as Record<string, unknown>[]
        if (!Array.isArray(education) || education.length === 0) return null

        return (
            <div className="space-y-4">
                {education.map((edu: Record<string, unknown>, index: number) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                        {(() => {
                            const eduRecord = edu as Record<string, unknown>
                            const degree = pickText([getField(eduRecord, 'degree', 'Degree', 'title', 'Title', 'qualification', 'Qualification')], 'Degree')
                            const institution = pickText([getField(eduRecord, 'institution', 'Institution', 'school', 'School', 'university', 'University', 'college', 'College')], 'Institution')
                            const fieldOfStudy = pickText([getField(eduRecord, 'fieldOfStudy', 'field_of_study', 'FieldOfStudy', 'major', 'Major', 'specialization', 'Specialization')])
                            const minor = pickText([getField(eduRecord, 'minor', 'Minor', 'secondMajor', 'second_major')])
                            const location = pickText([getField(eduRecord, 'location', 'Location')])
                            const graduationDate = pickText([
                                getField(eduRecord, 'graduationDate', 'GraduationDate', 'date', 'Date', 'year', 'Year', 'period', 'Period', 'duration', 'Duration')
                            ])
                            const gpa = pickText([getField(eduRecord, 'gpa', 'GPA', 'Gpa', 'grade', 'Grade', 'score', 'Score')])
                            const honors = pickText([getField(eduRecord, 'honors', 'Honors', 'distinction', 'Distinction', 'classRank', 'class_rank')])
                            const coursework = getField(eduRecord, 'coursework', 'Coursework', 'relevantCoursework', 'relevant_coursework', 'courses', 'Courses')
                            const achievements = getField(eduRecord, 'achievements', 'Achievements', 'awards', 'Awards')
                            const thesis = pickText([getField(eduRecord, 'thesis', 'Thesis', 'dissertation', 'Dissertation', 'capstone', 'Capstone')])
                            const activities = getField(eduRecord, 'activities', 'Activities', 'clubs', 'Clubs', 'societies', 'Societies')

                            return (
                                <div>
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{degree}</h3>
                                            <p className="text-blue-600 dark:text-blue-400 font-medium">{institution}</p>
                                            {fieldOfStudy && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Major: {fieldOfStudy}</p>
                                            )}
                                            {minor && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Minor: {minor}</p>
                                            )}
                                            {location && (
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{location}</p>
                                            )}
                                        </div>
                                        <div className="text-right mt-2 md:mt-0">
                                            {graduationDate && (
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{graduationDate}</span>
                                            )}
                                            {gpa && (
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">GPA: {gpa}</p>
                                            )}
                                            {honors && (
                                                <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">{honors}</p>
                                            )}
                                        </div>
                                    </div>

                                    {thesis && (
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Thesis/Dissertation:</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">{thesis}</p>
                                        </div>
                                    )}

                                    {coursework !== null && coursework !== undefined && (
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Relevant Coursework:</p>
                                            {Array.isArray(coursework) ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(coursework as string[]).map((course: string, i: number) => (
                                                        <span key={i} className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                                                            {course}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : typeof coursework === 'string' ? (
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{coursework}</p>
                                            ) : null}
                                        </div>
                                    )}

                                    {achievements !== null && achievements !== undefined && (
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Academic Achievements:</p>
                                            {Array.isArray(achievements) ? (
                                                <ul className="list-disc list-inside space-y-0.5 text-sm text-gray-700 dark:text-gray-300">
                                                    {(achievements as string[]).map((achievement: string, i: number) => (
                                                        <li key={i}>{achievement}</li>
                                                    ))}
                                                </ul>
                                            ) : typeof achievements === 'string' ? (
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{achievements}</p>
                                            ) : null}
                                        </div>
                                    )}

                                    {activities !== null && activities !== undefined && (
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Activities & Clubs:</p>
                                            {Array.isArray(activities) ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(activities as string[]).map((activity: string, i: number) => (
                                                        <span key={i} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                                                            {activity}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : typeof activities === 'string' ? (
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{activities}</p>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            )
                        })()}
                    </div>
                ))}
            </div>
        )
    }

    const renderSkills = () => {
        // Try to get skills from multiple possible locations
        let skills = getField(data,
            'skills', 'Skills',
            'technicalSkills', 'technical_skills', 'TechnicalSkills',
            'competencies', 'Competencies',
            'skillsAndCompetencies', 'skills_and_competencies',
            'abilities', 'Abilities',
            'expertise', 'Expertise'
        ) as unknown

        // If not found at root level, check if there's a skills section in additional fields
        if (!skills) {
            // Try to find any field that might contain skills
            const possibleSkillFields = Object.keys(data).filter(key =>
                key.toLowerCase().includes('skill') ||
                key.toLowerCase().includes('competenc') ||
                key.toLowerCase().includes('technical') ||
                key.toLowerCase().includes('expertise')
            )

            if (possibleSkillFields.length > 0) {
                skills = data[possibleSkillFields[0]]
            }
        }

        if (!skills) return null

        // Check if skills is an object with categories (e.g., {programming: [...], tools: [...], technicalSkills: [...], softSkills: [...]})
        if (typeof skills === 'object' && !Array.isArray(skills) && skills !== null) {
            const skillsObj = skills as Record<string, unknown>

            // Filter out empty values and get all categories
            const categories = Object.entries(skillsObj).filter(([key, value]) => {
                // Skip metadata fields
                if (key === '_type' || key === 'type' || key === 'id') return false

                // Check if value is not empty
                if (value === null || value === undefined) return false
                if (Array.isArray(value) && value.length === 0) return false
                if (typeof value === 'object' && Object.keys(value as Record<string, unknown>).length === 0) return false
                if (typeof value === 'string' && value.trim() === '') return false

                return true
            })

            if (categories.length === 0) return null

            return (
                <div className="space-y-4">
                    {categories.map(([category, skillList], catIndex) => {
                        // Format category name nicely
                        const categoryName = category
                            .replace(/_/g, ' ')
                            .replace(/([A-Z])/g, ' $1')
                            .trim()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ')

                        return (
                            <div key={catIndex}>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{categoryName}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(skillList) ? (
                                        (skillList as unknown[]).map((skill: unknown, index: number) => {
                                            const skillText = pickText([
                                                skill,
                                                typeof skill === 'object' && skill !== null ? (skill as Record<string, unknown>)?.name : null,
                                                typeof skill === 'object' && skill !== null ? (skill as Record<string, unknown>)?.skill : null,
                                                typeof skill === 'object' && skill !== null ? (skill as Record<string, unknown>)?.value : null,
                                            ])
                                            return skillText ? (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                                >
                                                    {skillText}
                                                </span>
                                            ) : null
                                        })
                                    ) : typeof skillList === 'string' ? (
                                        // Handle comma-separated string of skills
                                        skillList.includes(',') ? (
                                            skillList.split(',').map((skill, idx) => {
                                                const trimmedSkill = skill.trim()
                                                return trimmedSkill ? (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                                    >
                                                        {trimmedSkill}
                                                    </span>
                                                ) : null
                                            })
                                        ) : (
                                            <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                                {skillList}
                                            </span>
                                        )
                                    ) : typeof skillList === 'object' && skillList !== null ? (
                                        // Handle nested object
                                        Object.entries(skillList as Record<string, unknown>).map(([key, val]) => {
                                            const text = pickText([val])
                                            return text ? (
                                                <span
                                                    key={key}
                                                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                                >
                                                    {text}
                                                </span>
                                            ) : null
                                        })
                                    ) : null}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }

        // Handle as array
        if (!Array.isArray(skills)) return null
        if (skills.length === 0) return null

        // Check if array contains objects with category and skills properties
        const firstItem = skills[0]
        if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
            const firstObj = firstItem as Record<string, unknown>

            // Handle array of {category: "...", skills: [...]} objects
            if ('category' in firstObj && ('skills' in firstObj || 'items' in firstObj)) {
                return (
                    <div className="space-y-4">
                        {skills.map((skillGroup: unknown, groupIndex: number) => {
                            if (typeof skillGroup !== 'object' || skillGroup === null) return null

                            const group = skillGroup as Record<string, unknown>
                            const category = pickText([getField(group, 'category', 'Category', 'name', 'Name')])
                            const skillList = (getField(group, 'skills', 'Skills', 'items', 'Items') || []) as unknown[]

                            if (!category || !Array.isArray(skillList) || skillList.length === 0) return null

                            return (
                                <div key={groupIndex}>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skillList.map((skill: unknown, index: number) => {
                                            const skillText = pickText([
                                                skill,
                                                typeof skill === 'object' && skill !== null ? (skill as Record<string, unknown>)?.name : null,
                                                typeof skill === 'object' && skill !== null ? (skill as Record<string, unknown>)?.skill : null,
                                            ])
                                            return skillText ? (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                                >
                                                    {skillText}
                                                </span>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            }
        }

        // Handle simple array of strings or objects
        return (
            <div className="flex flex-wrap gap-2">
                {skills.map((skill: unknown, index: number) => {
                    const skillText = pickText([
                        skill,
                        typeof skill === 'object' && skill !== null ? (skill as Record<string, unknown>)?.name : null,
                        typeof skill === 'object' && skill !== null ? (skill as Record<string, unknown>)?.skill : null,
                    ])
                    return skillText ? (
                        <span
                            key={index}
                            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                            {skillText}
                        </span>
                    ) : null
                })}
            </div>
        )
    }

    const renderCertifications = () => {
        const certifications = (getField(data, 'certifications', 'Certifications', 'certificates', 'Certificates') || []) as unknown[]
        if (!Array.isArray(certifications) || certifications.length === 0) return null

        return (
            <div className="space-y-3">
                {certifications.map((cert: unknown, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                            {(() => {
                                if (typeof cert === 'string') {
                                    return (
                                        <>
                                            <p className="font-semibold text-gray-900 dark:text-white">{cert}</p>
                                        </>
                                    )
                                }

                                const certRecord = cert as Record<string, unknown>
                                const title = pickText([getField(certRecord, 'name', 'Name', 'title', 'Title', 'certification', 'Certification')], 'Certification')
                                const issuer = pickText([getField(certRecord, 'issuer', 'Issuer', 'issuedBy', 'issued_by')])
                                const date = pickText([getField(certRecord, 'date', 'Date', 'year', 'Year')])

                                return (
                                    <>
                                        <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                                        {issuer && <p className="text-sm text-gray-600 dark:text-gray-400">{issuer}</p>}
                                        {date && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{date}</p>}
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const renderProjects = () => {
        const projects = (getField(data, 'projects', 'Projects', 'personalProjects', 'personal_projects') || []) as unknown[]
        if (!Array.isArray(projects) || projects.length === 0) return null

        return (
            <div className="space-y-4">
                {projects.map((project: unknown, index: number) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 p-5 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        {(() => {
                            if (typeof project === 'string') {
                                return <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project}</h3>
                            }

                            const projectRecord = project as Record<string, unknown>
                            const title = pickText([getField(projectRecord, 'name', 'Name', 'title', 'Title', 'projectName', 'project_name')], 'Project')
                            const description = pickText([getField(projectRecord, 'description', 'Description', 'summary', 'Summary')])
                            const technologies = getField(projectRecord, 'technologies', 'Technologies', 'tech', 'Tech', 'techStack', 'tech_stack', 'tools', 'Tools')
                            const link = pickText([getField(projectRecord, 'url', 'URL', 'link', 'Link', 'website', 'Website')])
                            const duration = pickText([getField(projectRecord, 'duration', 'Duration', 'period', 'Period')])

                            return (
                                <>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                                        {duration && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{duration}</span>
                                        )}
                                    </div>
                                    {description && <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{description}</p>}
                                    {link && (
                                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3 inline-block">
                                            {link}
                                        </a>
                                    )}
                                    {technologies && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {Array.isArray(technologies) ? (
                                                (technologies as string[]).map((tech: string, i: number) => (
                                                    <span key={i} className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium">
                                                        {tech}
                                                    </span>
                                                ))
                                            ) : typeof technologies === 'string' ? (
                                                <span className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium">
                                                    {technologies}
                                                </span>
                                            ) : null}
                                        </div>
                                    )}
                                </>
                            )
                        })()}
                    </div>
                ))}
            </div>
        )
    }

    const renderLanguages = () => {
        const languages = (getField(data, 'languages', 'Languages', 'spokenLanguages', 'spoken_languages') || []) as unknown[]
        if (!Array.isArray(languages) || languages.length === 0) return null

        return (
            <div className="flex flex-wrap gap-3">
                {languages.map((lang: unknown, index: number) => {
                    if (typeof lang === 'string') {
                        return (
                            <div key={index} className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <span className="text-green-800 dark:text-green-200 font-medium">{lang}</span>
                            </div>
                        )
                    }

                    const langRecord = lang as Record<string, unknown>
                    const name = pickText([getField(langRecord, 'name', 'Name', 'language', 'Language')])
                    const proficiency = pickText([getField(langRecord, 'proficiency', 'Proficiency', 'level', 'Level')])

                    return (
                        <div key={index} className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <span className="text-green-800 dark:text-green-200 font-medium">{name}</span>
                            {proficiency && (
                                <span className="text-xs text-green-600 dark:text-green-400 ml-2">({proficiency})</span>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderAwards = () => {
        const awards = (getField(data, 'awards', 'Awards', 'achievements', 'Achievements', 'honors', 'Honors', 'recognition', 'Recognition') || []) as unknown[]
        if (!Array.isArray(awards) || awards.length === 0) return null

        return (
            <div className="space-y-3">
                {awards.map((award: unknown, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                        <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                            {(() => {
                                if (typeof award === 'string') {
                                    return <p className="font-semibold text-gray-900 dark:text-white">{award}</p>
                                }

                                const awardRecord = award as Record<string, unknown>
                                const title = pickText([getField(awardRecord, 'title', 'Title', 'name', 'Name', 'award', 'Award')])
                                const issuer = pickText([getField(awardRecord, 'issuer', 'Issuer', 'organization', 'Organization')])
                                const date = pickText([getField(awardRecord, 'date', 'Date', 'year', 'Year')])
                                const description = pickText([getField(awardRecord, 'description', 'Description')])

                                return (
                                    <>
                                        <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                                        {issuer && <p className="text-sm text-gray-600 dark:text-gray-400">{issuer}</p>}
                                        {date && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{date}</p>}
                                        {description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{description}</p>}
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const renderVolunteerWork = () => {
        const volunteer = (getField(data, 'volunteerWork', 'volunteer_work', 'VolunteerWork', 'volunteering', 'Volunteering', 'communityService', 'community_service') || []) as unknown[]
        if (!Array.isArray(volunteer) || volunteer.length === 0) return null

        return (
            <div className="space-y-6">
                {volunteer.map((work: unknown, index: number) => {
                    if (typeof work === 'string') {
                        return <p key={index} className="text-gray-700 dark:text-gray-300">{work}</p>
                    }

                    const workRecord = work as Record<string, unknown>
                    const organization = pickText([getField(workRecord, 'organization', 'Organization', 'company', 'Company')])
                    const role = pickText([getField(workRecord, 'role', 'Role', 'position', 'Position', 'title', 'Title')])
                    const duration = pickText([getField(workRecord, 'duration', 'Duration', 'period', 'Period', 'dates', 'Dates')])
                    const description = pickText([getField(workRecord, 'description', 'Description', 'activities', 'Activities')])
                    const impact = pickText([getField(workRecord, 'impact', 'Impact', 'achievements', 'Achievements')])

                    return (
                        <div key={index} className="border-l-4 border-green-500 pl-6 pb-4">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{role || 'Volunteer'}</h3>
                                    {organization && <p className="text-green-600 dark:text-green-400 font-medium">{organization}</p>}
                                </div>
                                {duration && (
                                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-0">{duration}</span>
                                )}
                            </div>
                            {description && <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{description}</p>}
                            {impact && <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm italic">{impact}</p>}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderPublications = () => {
        const publications = (getField(data, 'publications', 'Publications', 'research', 'Research', 'papers', 'Papers') || []) as unknown[]
        if (!Array.isArray(publications) || publications.length === 0) return null

        return (
            <div className="space-y-4">
                {publications.map((pub: unknown, index: number) => {
                    if (typeof pub === 'string') {
                        return <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">{pub}</p>
                    }

                    const pubRecord = pub as Record<string, unknown>
                    const title = pickText([getField(pubRecord, 'title', 'Title', 'name', 'Name')])
                    const authors = pickText([getField(pubRecord, 'authors', 'Authors', 'author', 'Author')])
                    const date = pickText([getField(pubRecord, 'date', 'Date', 'year', 'Year', 'published', 'Published')])
                    const journal = pickText([getField(pubRecord, 'journal', 'Journal', 'conference', 'Conference', 'publisher', 'Publisher')])
                    const doi = pickText([getField(pubRecord, 'doi', 'DOI', 'url', 'URL', 'link', 'Link')])

                    return (
                        <div key={index} className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title || 'Publication'}</h3>
                            {authors && <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Authors: {authors}</p>}
                            {journal && <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{journal}</p>}
                            {date && <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">{date}</p>}
                            {doi && (
                                <a href={doi} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    {doi}
                                </a>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderInterests = () => {
        const interests = (getField(data, 'interests', 'Interests', 'hobbies', 'Hobbies', 'personalInterests', 'personal_interests') || []) as unknown[]
        if (!Array.isArray(interests) || interests.length === 0) return null

        return (
            <div className="space-y-3">
                {interests.map((interest: unknown, index: number) => {
                    // Handle both string and object formats
                    if (typeof interest === 'string') {
                        return (
                            <div key={index} className="flex items-start gap-2">
                                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                                    {interest}
                                </span>
                            </div>
                        )
                    }

                    const interestRecord = interest as Record<string, unknown>
                    const name = pickText([getField(interestRecord, 'name', 'Name', 'hobby', 'Hobby', 'interest', 'Interest')])
                    const description = pickText([getField(interestRecord, 'description', 'Description', 'details', 'Details')])

                    if (!name) return null

                    return (
                        <div key={index} className="flex items-start gap-2">
                            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium whitespace-nowrap">
                                {name}
                            </span>
                            {description && (
                                <p className="text-gray-700 dark:text-gray-300 text-sm pt-2 flex-1">
                                    {description}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderAdditionalSections = () => {
        // List of known fields that are already displayed
        const knownFields = [
            'personalinformation', 'personal_information', 'personal', 'contactinformation', 'contact_information', 'contact',
            'professionalsummary', 'professional_summary', 'summary', 'objective',
            'workexperience', 'work_experience', 'experience', 'employment', 'professionalexperience', 'professional_experience',
            'education', 'academicbackground', 'academic_background', 'qualifications',
            'skills', 'technicalskills', 'technical_skills', 'competencies', 'softskills', 'soft_skills',
            'abilities', 'expertise', 'skillsandcompetencies', 'skills_and_competencies', 'corecompetencies', 'core_competencies',
            'certifications', 'certificates', 'licenses',
            'projects', 'personalprojects', 'personal_projects',
            'languages', 'spokenlanguages', 'spoken_languages',
            'awards', 'achievements', 'honors', 'recognition',
            'volunteerwork', 'volunteer_work', 'volunteering', 'communityservice', 'community_service',
            'publications', 'research', 'papers',
            'interests', 'hobbies', 'personalinterests', 'personal_interests'
        ]

        const additionalSections: Array<{ title: string; content: unknown }> = []

        Object.entries(data).forEach(([key, value]) => {
            const normalizedKey = key.toLowerCase().replace(/[_\s-]/g, '')
            if (!knownFields.includes(normalizedKey) && value !== null && value !== undefined) {
                // Check if it's not empty
                if (Array.isArray(value) && value.length > 0) {
                    additionalSections.push({ title: key, content: value })
                } else if (typeof value === 'object') {
                    // Deep check if object has any meaningful content
                    const hasContent = Object.values(value as Record<string, unknown>).some(v => {
                        if (v === null || v === undefined) return false
                        if (Array.isArray(v)) return v.length > 0
                        if (typeof v === 'object') return Object.keys(v as Record<string, unknown>).length > 0
                        if (typeof v === 'string') return v.trim().length > 0
                        return true
                    })
                    if (hasContent) {
                        additionalSections.push({ title: key, content: value })
                    }
                } else if (typeof value === 'string' && value.trim().length > 0) {
                    additionalSections.push({ title: key, content: value })
                }
            }
        })

        if (additionalSections.length === 0) return null

        return (
            <div className="space-y-6">
                {additionalSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                            {section.title.replace(/_/g, ' ')}
                        </h3>
                        {(() => {
                            const content = section.content

                            // Handle array
                            if (Array.isArray(content)) {
                                return (
                                    <div className="space-y-3">
                                        {content.map((item: unknown, itemIndex: number) => {
                                            if (typeof item === 'string') {
                                                return (
                                                    <p key={itemIndex} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        • {item}
                                                    </p>
                                                )
                                            } else if (typeof item === 'object' && item !== null) {
                                                return (
                                                    <div key={itemIndex} className="pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                                                        {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                                                            <div key={k} className="mb-2">
                                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                                                                    {k.replace(/_/g, ' ')}:
                                                                </span>
                                                                <span className="ml-2 text-gray-900 dark:text-white">
                                                                    {typeof v === 'string' ? v : JSON.stringify(v)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            }
                                            return null
                                        })}
                                    </div>
                                )
                            }

                            // Handle object
                            if (typeof content === 'object' && content !== null) {
                                return (
                                    <div className="space-y-2">
                                        {Object.entries(content as Record<string, unknown>).map(([k, v]) => (
                                            <div key={k} className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                                                    {k.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-gray-900 dark:text-white mt-1">
                                                    {Array.isArray(v) ? (
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {v.map((item, i) => (
                                                                <span key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">
                                                                    {typeof item === 'string' ? item : JSON.stringify(item)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : typeof v === 'string' ? (
                                                        v
                                                    ) : (
                                                        JSON.stringify(v)
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }

                            // Handle string
                            return <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{String(content)}</p>
                        })()}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="mt-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            {showScanHeader && (
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            CV Successfully Scanned
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Here&apos;s the information extracted from your CV
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {renderSection(
                    'Personal Information',
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderPersonalInfo()
                )}

                {renderSection(
                    'Professional Summary',
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderSummary()
                )}

                {renderSection(
                    'Work Experience',
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderWorkExperience()
                )}

                {renderSection(
                    'Education',
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderEducation()
                )}

                {renderSection(
                    'Skills',
                    <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderSkills()
                )}

                {renderSection(
                    'Certifications',
                    <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderCertifications()
                )}

                {renderSection(
                    'Projects',
                    <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderProjects()
                )}

                {renderSection(
                    'Languages',
                    <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderLanguages()
                )}

                {renderSection(
                    'Awards & Achievements',
                    <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderAwards()
                )}

                {renderSection(
                    'Volunteer Work',
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderVolunteerWork()
                )}

                {renderSection(
                    'Publications & Research',
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderPublications()
                )}

                {renderSection(
                    'Interests & Hobbies',
                    <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderInterests()
                )}

                {renderSection(
                    'Additional Information',
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    renderAdditionalSections()
                )}
            </div>
        </div>
    )
}
