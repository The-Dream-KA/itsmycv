import React, { useState } from 'react'
import { Briefcase, Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { WorkExperience } from '../types'
import ConfirmDialog from '../../ConfirmDialog'

interface WorkExperienceSectionProps {
    workExperience: WorkExperience[]
    setWorkExperience: React.Dispatch<React.SetStateAction<WorkExperience[]>>
    isExpanded: boolean
    hasContent: boolean
    onToggle: () => void
    addItem: <T, >(setter: React.Dispatch<React.SetStateAction<T[]>>, template: T) => void
    removeItem: <T, >(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => void
    updateItem: <T extends Record<string, unknown>>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        index: number,
        field: string,
        value: unknown
    ) => void
    moveItem: <T, >(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        index: number,
        direction: 'up' | 'down'
    ) => void
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
    workExperience,
    setWorkExperience,
    isExpanded,
    hasContent,
    onToggle,
    addItem,
    removeItem,
    updateItem,
    moveItem
}) => {
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'experience' | 'responsibility'; index: number; responsibilityIndex?: number }>({ isOpen: false, type: 'experience', index: -1 })

    const handleDelete = () => {
        if (deleteConfirm.type === 'experience') {
            removeItem(setWorkExperience, deleteConfirm.index)
        } else if (deleteConfirm.type === 'responsibility' && deleteConfirm.responsibilityIndex !== undefined) {
            const exp = workExperience[deleteConfirm.index]
            const items = exp.responsibilities || []
            const newItems = items.filter((_: string, i: number) => i !== deleteConfirm.responsibilityIndex)
            updateItem(setWorkExperience, deleteConfirm.index, 'responsibilities', newItems)
        }
        setDeleteConfirm({ isOpen: false, type: 'experience', index: -1 })
    }

    return (
        <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
            <SectionHeader
                icon={Briefcase}
                title="Work Experience"
                sectionKey="work"
                itemCount={workExperience.length}
                isExpanded={isExpanded}
                hasContent={hasContent}
                onToggle={onToggle}
            />
            {isExpanded && (
                <div className="space-y-4 animate-in fade-in duration-200">
                    <button
                        onClick={() => addItem(setWorkExperience, {
                            title: '',
                            company: '',
                            location: '',
                            startDate: '',
                            endDate: '',
                            current: false,
                            showEndDate: false,
                            description: ''
                        })}
                        className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#ff007a] text-white rounded-lg hover:bg-[#e6006d] transition-colors text-sm md:text-base w-full"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Experience</span>
                    </button>
                    {workExperience.map((exp, index) => (
                        <div key={index} className="mb-4 md:mb-6 p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-[#ff007a] transition-all duration-200">
                            <div className="flex justify-between items-start mb-3 md:mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveItem(setWorkExperience, index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-[#ff007a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Move up"
                                            title="Move up"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => moveItem(setWorkExperience, index, 'down')}
                                            disabled={index === workExperience.length - 1}
                                            className="p-1 text-gray-400 hover:text-[#ff007a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Move down"
                                            title="Move down"
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-700">Experience {index + 1}</h3>
                                </div>
                                <button
                                    onClick={() => setDeleteConfirm({ isOpen: true, type: 'experience', index })}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all -mr-1"
                                    aria-label="Delete work experience"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:gap-4">
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Job Title</label>
                                    <textarea
                                        ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                        placeholder="Job Title"
                                        value={(exp.title || exp.jobTitle || exp.position || exp.role || '') as string}
                                        onChange={(e) => updateItem(setWorkExperience, index, 'title', e.target.value)}
                                        onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }}
                                        rows={1}
                                        className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base resize-none overflow-hidden"
                                        style={{ minHeight: '44px' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Company</label>
                                    <textarea
                                        ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                        placeholder="Company"
                                        value={(exp.company || exp.employer || exp.organization || '') as string}
                                        onChange={(e) => updateItem(setWorkExperience, index, 'company', e.target.value)}
                                        onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }}
                                        rows={1}
                                        className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base resize-none overflow-hidden"
                                        style={{ minHeight: '44px' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Location</label>
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={(exp.location || exp.city || '') as string}
                                        onChange={(e) => updateItem(setWorkExperience, index, 'location', e.target.value)}
                                        className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Start Date</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 07/2024"
                                        value={(() => {
                                            const duration = exp.duration || exp.period || exp.dates || '';
                                            if (typeof duration === 'string' && duration.includes('-')) {
                                                const startPart = duration.split('-')[0].trim();
                                                return (exp.startDate || exp.start || exp.from || exp.startYear || startPart || '') as string;
                                            }
                                            return (exp.startDate || exp.start || exp.from || exp.startYear || duration || '') as string;
                                        })()}
                                        onChange={(e) => updateItem(setWorkExperience, index, 'startDate', e.target.value)}
                                        className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <div className="flex items-center justify-between mb-1.5 md:mb-2">
                                        <label className="block text-xs md:text-sm font-medium text-gray-700">End Date</label>
                                        {!exp.showEndDate && (
                                            <button
                                                type="button"
                                                onClick={() => updateItem(setWorkExperience, index, 'showEndDate', true)}
                                                className="text-xs text-[#ff007a] hover:text-[#e6006d] font-medium"
                                            >
                                                + Add End Date
                                            </button>
                                        )}
                                    </div>
                                    {exp.showEndDate ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="e.g., 12/2024"
                                                value={(() => {
                                                    const duration = exp.duration || exp.period || exp.dates || '';
                                                    if (typeof duration === 'string' && duration.includes('-')) {
                                                        const endPart = duration.split('-')[1].trim();
                                                        return (exp.endDate || exp.end || exp.to || exp.endYear || endPart || '') as string;
                                                    }
                                                    return (exp.endDate || exp.end || exp.to || exp.endYear || '') as string;
                                                })()}
                                                onChange={(e) => updateItem(setWorkExperience, index, 'endDate', e.target.value)}
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm md:text-base"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    updateItem(setWorkExperience, index, 'showEndDate', false)
                                                    updateItem(setWorkExperience, index, 'endDate', '')
                                                }}
                                                className="px-3 py-2.5 text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition-colors"
                                                title="Remove end date"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic px-3 py-2.5">No end date (ongoing)</p>
                                    )}
                                </div>
                                <label className="flex items-center gap-2 col-span-1">
                                    <input
                                        type="checkbox"
                                        checked={exp.current || false}
                                        onChange={(e) => updateItem(setWorkExperience, index, 'current', e.target.checked)}
                                        className="w-4 h-4 text-[#ff007a] border-gray-300 rounded focus:ring-[#ff007a]"
                                    />
                                    <span className="text-sm md:text-base text-gray-700">Currently working here</span>
                                </label>

                                <div className="col-span-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs md:text-sm font-medium text-gray-700">Responsibilities & Achievements</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentItems = Array.isArray(exp.responsibilities) ? exp.responsibilities :
                                                    exp.responsibilities ? [exp.responsibilities] :
                                                        exp.description && typeof exp.description === 'string' ? exp.description.split('\n').filter((s: string) => s.trim()) : [];
                                                updateItem(setWorkExperience, index, 'responsibilities', [...currentItems, '']);
                                            }}
                                            className="text-xs text-[#ff007a] hover:text-[#e6006d] font-medium flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Add Item
                                        </button>
                                    </div>
                                    {(() => {
                                        const items = Array.isArray(exp.responsibilities) ? exp.responsibilities :
                                            exp.responsibilities ? [exp.responsibilities] :
                                                exp.description && typeof exp.description === 'string' ? exp.description.split('\n').filter((s: string) => s.trim()) : [];

                                        if (items.length === 0) {
                                            return (
                                                <p className="text-sm text-gray-500 italic px-3 py-2 border border-dashed border-gray-300 rounded-lg">
                                                    No responsibilities added yet. Click &quot;Add Item&quot; to start.
                                                </p>
                                            );
                                        }

                                        return (
                                            <div className="space-y-2">
                                                {items.map((item: string, itemIndex: number) => (
                                                    <div
                                                        key={itemIndex}
                                                        className="flex gap-2 items-start group"
                                                        draggable
                                                        onDragStart={(e) => {
                                                            e.dataTransfer.effectAllowed = 'move';
                                                            e.dataTransfer.setData('text/plain', itemIndex.toString());
                                                        }}
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                            e.dataTransfer.dropEffect = 'move';
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                                            if (dragIndex !== itemIndex) {
                                                                const newItems = [...items];
                                                                const [draggedItem] = newItems.splice(dragIndex, 1);
                                                                newItems.splice(itemIndex, 0, draggedItem);
                                                                updateItem(setWorkExperience, index, 'responsibilities', newItems);
                                                            }
                                                        }}
                                                    >
                                                        <div className="pt-2 cursor-grab active:cursor-grabbing" title="Drag to reorder">
                                                            <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                                        </div>
                                                        <textarea
                                                            ref={(el) => {
                                                                if (el) {
                                                                    el.style.height = 'auto';
                                                                    el.style.height = el.scrollHeight + 'px';
                                                                }
                                                            }}
                                                            placeholder="e.g., Responsible for daily monitoring and organisation..."
                                                            value={item}
                                                            onChange={(e) => {
                                                                const newItems = [...items];
                                                                newItems[itemIndex] = e.target.value;
                                                                updateItem(setWorkExperience, index, 'responsibilities', newItems);
                                                            }}
                                                            onInput={(e) => {
                                                                e.currentTarget.style.height = 'auto';
                                                                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                                            }}
                                                            rows={1}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 text-sm resize-none overflow-hidden"
                                                            style={{ minHeight: '38px' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteConfirm({ isOpen: true, type: 'responsibility', index, responsibilityIndex: itemIndex })}
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete item"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {workExperience.length > 0 && (
                        <button
                            onClick={() => addItem(setWorkExperience, {
                                title: '',
                                company: '',
                                location: '',
                                startDate: '',
                                endDate: '',
                                current: false,
                                showEndDate: false,
                                description: ''
                            })}
                            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#ff007a] text-white rounded-lg hover:bg-[#e6006d] transition-colors text-sm md:text-base w-full"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Experience</span>
                        </button>
                    )}
                </div>
            )}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title={deleteConfirm.type === 'experience' ? 'Delete Work Experience' : 'Delete Responsibility'}
                message={deleteConfirm.type === 'experience' ? 'Are you sure you want to delete this work experience? This action cannot be undone.' : 'Are you sure you want to delete this responsibility? This action cannot be undone.'}
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, type: 'experience', index: -1 })}
            />
        </section>
    )
}
