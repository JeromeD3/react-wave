import { ReactElement, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

interface WaveEffectProps {
  target: HTMLDivElement
}

const WaveEffect: React.FC<WaveEffectProps> = (props) => {
  const { target } = props

  const [waveColor, setwaveColor] = useState<string>('')

  const [waveWidth, setwaveWidth] = useState<number>(0)
  const [waveHeight, setwaveHeight] = useState<number>(0)

  const [waveTop, setwaveTop] = useState<number>(0)
  const [waveLeft, setwaveLeft] = useState<number>(0)

  const [waveBorderRadius, setWaveBorderRadius] = useState<string[]>([])
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    divRef.current?.classList.add('wave')

    const ob = new ResizeObserver(syncStyle)

    ob.observe(target)

    const id = requestAnimationFrame(() => {
      syncStyle()
      divRef.current!.style.boxShadow = '0 0 0 10px currentcolor'
      divRef.current?.classList.add('wave-hide')
    })

    return () => {
      ob.disconnect()
      cancelAnimationFrame(id)
    }
  }, [])

  const style: React.CSSProperties = {
    width: waveWidth,
    height: waveHeight,
    left: waveLeft,
    top: waveTop,
    color: waveColor,
    borderRadius: waveBorderRadius.join(' '),
  }

  const syncStyle = () => {
    const {
      position,
      borderLeftWidth,
      borderTopWidth,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
    } = getComputedStyle(target)

    setwaveWidth(target.offsetWidth)
    setwaveHeight(target.offsetHeight)

    const isStatic = position === 'static'

    setwaveTop(isStatic ? target.offsetTop : -parseFloat(borderTopWidth))
    setwaveLeft(isStatic ? target.offsetLeft : -parseFloat(borderLeftWidth))
    setwaveColor(getWaveColor(target))

    setWaveBorderRadius([
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
    ])
  }

  const callback = () => {
    divRef.current?.parentElement?.remove()
  }

  useEffect(() => {
    divRef.current?.addEventListener('transitionend', callback)
    return () => {
      divRef.current?.removeEventListener('transitionend', callback)
    }
  }, [])

  return <div style={style} ref={divRef} className="" />
}

export const showWaveEffect = (node: HTMLDivElement) => {
  const warpper = document.createElement('div')
  warpper.style.position = 'absolute'
  warpper.style.top = '0'
  warpper.style.left = '0'

  node.insertBefore(warpper, node.firstChild)
  renderDom(<WaveEffect target={node} />, warpper)
}

function renderDom(node: ReactElement, rootDom: HTMLElement) {
  const root = ReactDOM.createRoot(rootDom)
  root.render(node)
}

const isValidColor = (color: string) => {
  if (!color) return false

  return (
    color !== 'transparent' &&
    color !== '#fff' &&
    color !== '#ffffff' &&
    color !== 'rgb(255,255,255)'
  )
}

function getWaveColor(node: HTMLElement, defaultColor = 'blue') {
  const { borderColor, backgroundColor } = getComputedStyle(node)
  if (isValidColor(borderColor)) {
    return borderColor
  }
  if (isValidColor(backgroundColor)) {
    return backgroundColor
  }
  return defaultColor
}
