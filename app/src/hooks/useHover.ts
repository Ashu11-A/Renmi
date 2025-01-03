import { useCallback, useRef, useState } from 'react'

export function useHover<T extends HTMLElement>() {
  const [hovering, setHovering] = useState(false)
  const previousNode = useRef<T | null>(null)

  const handleMouseEnter = useCallback(() => {
    setHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovering(false)
  }, [])

  const ref = useCallback((node: T) => {
    if (previousNode.current) {
      previousNode.current.removeEventListener('mouseenter', handleMouseEnter)
      previousNode.current.removeEventListener('mouseleave', handleMouseLeave)
    }

    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)
    }

    previousNode.current = node
  }, [])

  return { ref,  hovering }
}