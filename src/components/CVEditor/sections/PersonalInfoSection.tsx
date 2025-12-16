import React from 'react'
import { User, Globe } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { PersonalInfo } from '../types'

interface PersonalInfoSectionProps {
    personalInfo: PersonalInfo
    setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfo>>
    isExpanded: boolean
    hasContent: boolean
    onToggle: () => void
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
    personalInfo,
    setPersonalInfo,
    isExpanded,
    hasContent,
    onToggle
}) => {
    return (
        <section className="bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 p-4 md:p-6 transition-all duration-200 hover:shadow-lg">
            <SectionHeader
                icon={User}
                title="Personal Information"
                sectionKey="personal"
                isExpanded={isExpanded}
                hasContent={hasContent}
                onToggle={onToggle}
            />
            {isExpanded && (
                <div className="grid grid-cols-1 gap-3 md:gap-4 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={String(personalInfo.name || '')}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={String(personalInfo.email || '')}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Phone</label>
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={String(personalInfo.phone || '')}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Address</label>
                        <input
                            type="text"
                            placeholder="Address"
                            value={String(personalInfo.fullAddress || personalInfo.location || personalInfo.address || '')}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, fullAddress: e.target.value, location: e.target.value, address: e.target.value })}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Website</label>
                        <input
                            type="url"
                            placeholder="Website"
                            value={String(personalInfo.website || '')}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base"
                        />
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Social Media Links
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {['linkedin', 'github', 'facebook', 'instagram', 'whatsapp', 'youtube', 'tiktok', 'telegram', 'snapchat', 'x'].map((platform) => (
                                <div key={platform}>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 capitalize">
                                        {platform === 'x' ? 'X (Twitter)' : platform === 'linkedin' ? 'LinkedIn' : platform === 'github' ? 'GitHub' : platform}
                                    </label>
                                    <input
                                        type="url"
                                        placeholder={`${platform === 'x' ? 'X (Twitter)' : platform === 'linkedin' ? 'LinkedIn' : platform === 'github' ? 'GitHub' : platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                                        value={String(personalInfo[platform] || '')}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, [platform]: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
