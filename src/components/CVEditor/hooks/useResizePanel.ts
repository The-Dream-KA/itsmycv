import { useState, useCallback, useEffect, useRef } from 'react'

export const useResizePanel = () => {
    const [editorWidth, setEditorWidth] = useState(40)
    const [isResizing, setIsResizing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseDown = useCallback(() => {
        setIsResizing(true)
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing || !containerRef.current) return

        const container = containerRef.current
        const containerRect = container.getBoundingClientRect()
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

        const clampedWidth = Math.min(Math.max(newWidth, 33.33), 66.67)
        setEditorWidth(clampedWidth)
    }, [isResizing])

    const handleMouseUp = useCallback(() => {
        setIsResizing(false)
    }, [])

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = 'col-resize'
            document.body.style.userSelect = 'none'
        } else {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }
    }, [isResizing, handleMouseMove, handleMouseUp])

    return {
        editorWidth,
        isResizing,
        containerRef,
        handleMouseDown
    }
}
