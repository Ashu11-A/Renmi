import { useCallback, useState } from 'react'

export function useTooltip<T extends HTMLElement>() {
  const [tooltipPosition, setTooltipPosition] = useState<'left' | 'right'>('right')

  const ref = useCallback((node: T) => {
    if (node) {
      const tooltip = node.getBoundingClientRect()
      const viewportWidth = window.innerWidth
        
      const spaceRight = viewportWidth - (tooltip.right + 100)
      setTooltipPosition(spaceRight >= 0 ? 'right' : 'left')
    }
  }, [])

  return { ref, tooltipPosition }
}