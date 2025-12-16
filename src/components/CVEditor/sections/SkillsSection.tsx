import React, { useState } from 'react'
import { Wrench, Plus, Trash2, Code } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { Skill } from '../types'
import ConfirmDialog from '../../ConfirmDialog'

interface SkillsSectionProps {
    skills: Skill[]
    setSkills: React.Dispatch<React.SetStateAction<Skill[]>>
    isExpanded: boolean
    hasContent: boolean
    onToggle: () => void
    removeItem: <T, >(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => void
    updateItem: <T extends Record<string, unknown>>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        index: number,
        field: string,
        value: unknown
    ) => void
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
    skills,
    setSkills,
    isExpanded,
    hasContent,
    onToggle,
    removeItem,
    updateItem
}) => {
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; index: number }>({ isOpen: false, index: -1 })

    const handleDelete = () => {
        removeItem(setSkills, deleteConfirm.index)
        setDeleteConfirm({ isOpen: false, index: -1 })
    }

    return (
        <section className="bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 p-4 md:p-6 transition-all duration-200 hover:shadow-lg">
            <SectionHeader
                icon={Code}
                title="Skills by Category"
                sectionKey="skills"
                itemCount={skills.length}
                isExpanded={isExpanded}
                hasContent={hasContent}
                onToggle={onToggle}
            />
            {isExpanded && (
                <div className="space-y-4 animate-in fade-in duration-200">
                    <button
                        onClick={() => {
                            const categoryName = prompt('Enter category name (e.g., "Technical Skills", "Soft Skills"):')
                            if (categoryName && categoryName.trim()) {
                                setSkills((prev: Skill[]) => [
                                    ...prev,
                                    { category: categoryName.trim(), skills: [] } as Skill
                                ])
                            }
                        }}
                        className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#ff007a] text-white rounded-lg hover:bg-[#e6006d] transition-colors text-sm md:text-base w-full"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                    </button>
                    <div className="space-y-4 md:space-y-6 mt-4">
                        {skills.map((skillCategory, catIndex) => (
                            <div key={catIndex} className="border border-gray-200 rounded-lg p-3 md:p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Technical Skills, Soft Skills"
                                            value={(skillCategory.category as string) || ''}
                                            onChange={(e) => updateItem(setSkills, catIndex, 'category', e.target.value)}
                                            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base font-semibold"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setDeleteConfirm({ isOpen: true, index: catIndex })}
                                        className="text-red-500 hover:text-red-700 p-1 ml-2"
                                        aria-label="Delete category"
                                        title="Delete category"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Skills (comma-separated)</label>
                                    <textarea
                                        ref={(el) => {
                                            if (el) {
                                                el.style.height = 'auto';
                                                el.style.height = el.scrollHeight + 'px';
                                            }
                                        }}
                                        placeholder="Enter skills separated by commas: React, Node.js, Python, Machine Learning"
                                        value={Array.isArray(skillCategory.skills)
                                            ? (skillCategory.skills as string[]).join(', ')
                                            : typeof skillCategory.skills === 'string'
                                                ? skillCategory.skills
                                                : ''}
                                        onChange={(e) => {
                                            const skillsArray = e.target.value
                                                .split(',')
                                                .map(s => s.trim())
                                                .filter(s => s.length > 0)
                                            updateItem(setSkills, catIndex, 'skills', skillsArray)
                                        }}
                                        onInput={(e) => {
                                            e.currentTarget.style.height = 'auto';
                                            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                        }}
                                        rows={1}
                                        className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base resize-none overflow-hidden"
                                        style={{ minHeight: '44px' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Tip: Separate each skill with a comma</p>
                                </div>

                                {Array.isArray(skillCategory.skills) && (skillCategory.skills as string[]).length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(skillCategory.skills as string[]).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {skills.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No skill categories yet. Click &quot;Add Category&quot; to start!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Skill Category"
                message="Are you sure you want to delete this skill category? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, index: -1 })}
            />
        </section>
    )
}
