/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { cloneElement, isValidElement, useEffect, useRef } from 'react'
import { showWaveEffect } from './showWaveEffect'

interface WaveProps {
  disabled?: boolean
  children?: React.ReactNode
}

const Wave: React.FC<WaveProps> = ({ disabled, children }) => {
  if (Array.isArray(children)) {
    console.error('Wave组件只能有一个子元素')
  }

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = containerRef.current

    if (!node || disabled || node.nodeType !== 1 || node.getAttribute('disabled')) return

    const onClick = () => {
      showWaveEffect(node)
    }

    // 阻止冒泡
    node.addEventListener('click', onClick, true)

    return () => {
      node.removeEventListener('click', onClick, true)
    }
  }, [disabled])

  // 如何传递了两个children，那children不是一个有效的元素了
  if (!isValidElement(children)) {
    return <>{children}</>
  }

  return cloneElement(children as any, { ref: containerRef })
}
export default Wave
