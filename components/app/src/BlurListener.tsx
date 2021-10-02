import { ReactNode, useRef } from 'react'
import { Box } from '@/components/primitives'
import { BoxProps } from '@/components/primitives/src/Box'

interface Props extends BoxProps {
  onBlur: () => void,
  children: ReactNode
}

const BlurListener = ({ onBlur, children, ...props }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null)

  async function handleFocusChange() {
    await new Promise(resolve => setTimeout(resolve, 0))
    const focusedElement = document.activeElement
    if (focusedElement instanceof HTMLElement) {
      if (!elementRef.current!.contains(focusedElement)) {
        onBlur()
      }
    }
  }

  return (
    <Box onBlur={handleFocusChange} ref={elementRef} {...props}>
      {children}
    </Box>
  )
}

export default BlurListener