/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { LucideIcon, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import ConfirmDialog from '../../ConfirmDialog'

interface Field {
    name: string
    label: string
    type: 'text' | 'textarea' | 'date' | 'url' | 'email' | 'checkbox'
    placeholder?: string
    rows?: number
}

interface GenericArraySectionProps<T> {
    icon: LucideIcon
    title: string
    sectionKey: string
    items: T[]
    setItems: React.Dispatch<React.SetStateAction<T[]>>
    isExpanded: boolean
    hasContent: boolean
    onToggle: () => void
    addItem: <U, >(setter: React.Dispatch<React.SetStateAction<U[]>>, template: U) => void
    removeItem: <U, >(setter: React.Dispatch<React.SetStateAction<U[]>>, index: number) => void
    updateItem: <U extends Record<string, unknown>>(
        setter: React.Dispatch<React.SetStateAction<U[]>>,
        index: number,
        field: string,
        value: unknown
    ) => void
    moveItem: <U, >(
        setter: React.Dispatch<React.SetStateAction<U[]>>,
        index: number,
        direction: 'up' | 'down'
    ) => void
    template: T
    fields: Field[]
    itemLabel: string
}

export function GenericArraySection<T extends Record<string, any>>({
    icon,
    title,
    sectionKey,
    items,
    setItems,
    isExpanded,
    hasContent,
    onToggle,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    template,
    fields,
    itemLabel
}: GenericArraySectionProps<T>) {
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; index: number }>({ isOpen: false, index: -1 })

    const handleDelete = () => {
        removeItem(setItems, deleteConfirm.index)
        setDeleteConfirm({ isOpen: false, index: -1 })
    }

    return (
        <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
            <SectionHeader
                icon={icon}
                title={title}
                sectionKey={sectionKey}
                itemCount={items.length}
                isExpanded={isExpanded}
                hasContent={hasContent}
                onToggle={onToggle}
            />
            {isExpanded && (
                <div className="space-y-4 animate-in fade-in duration-200">
                    <button
                        onClick={() => addItem(setItems, template)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#ff007a] text-white rounded-lg hover:bg-[#e6006d] transition-colors w-full justify-center"
                    >
                        <Plus className="w-4 h-4" />
                        Add {itemLabel}
                    </button>
                    {items.map((item, index) => (
                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveItem(setItems, index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-[#ff007a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            title="Move up"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => moveItem(setItems, index, 'down')}
                                            disabled={index === items.length - 1}
                                            className="p-1 text-gray-400 hover:text-[#ff007a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            title="Move down"
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700">{itemLabel} {index + 1}</h3>
                                </div>
                                <button
                                    onClick={() => setDeleteConfirm({ isOpen: true, index })}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                    title="Delete item"
                                    aria-label="Delete item"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {fields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                ref={(el) => {
                                                    if (el) {
                                                        el.style.height = 'auto';
                                                        el.style.height = el.scrollHeight + 'px';
                                                    }
                                                }}
                                                placeholder={field.placeholder || ''}
                                                value={(item[field.name] || '') as string}
                                                onChange={(e) => updateItem(setItems, index, field.name, e.target.value)}
                                                onInput={(e) => {
                                                    e.currentTarget.style.height = 'auto';
                                                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                                }}
                                                rows={field.rows || 3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2 resize-none overflow-hidden"
                                            />
                                        ) : field.type === 'checkbox' ? (
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={(item[field.name] || false) as boolean}
                                                    onChange={(e) => updateItem(setItems, index, field.name, e.target.checked)}
                                                    className="w-4 h-4 text-[#ff007a] border-gray-300 rounded focus:ring-[#ff007a]"
                                                />
                                                <span className="text-sm text-gray-700">{field.placeholder || field.label}</span>
                                            </label>
                                        ) : (
                                            <input
                                                type={field.type}
                                                placeholder={field.placeholder || ''}
                                                value={(item[field.name] || '') as string}
                                                onChange={(e) => updateItem(setItems, index, field.name, e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff007a] focus:border-2"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {items.length > 0 && (
                        <button
                            onClick={() => addItem(setItems, template)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#ff007a] text-white rounded-lg hover:bg-[#e6006d] transition-colors w-full justify-center"
                        >
                            <Plus className="w-4 h-4" />
                            Add {itemLabel}
                        </button>
                    )}
                </div>
            )}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title={`Delete ${itemLabel}`}
                message={`Are you sure you want to delete this ${itemLabel.toLowerCase()}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, index: -1 })}
            />
        </section>
    )
}
