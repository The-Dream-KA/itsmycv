import { useState, useCallback, useRef } from 'react'

export const useAutosave = (saveFunction: (isAutosave: boolean) => Promise<void>) => {
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null)

    const triggerAutosave = useCallback(() => {
        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current)
        }
        autosaveTimerRef.current = setTimeout(() => {
            saveFunction(true)
        }, 3000)
    }, [saveFunction])

    return {
        lastSaved,
        setLastSaved,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        triggerAutosave,
        autosaveTimerRef
    }
}
