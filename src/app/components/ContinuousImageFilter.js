import { useRef, useState, useEffect, useCallback } from 'react'
import throttle from '../../../utils/throttle'
import OverlayImage from './Fast/OverlayImage'
import ImageMask from './Fast/ImageMask'

// Componente principal
const ContinuousImageFilter = () => {
  const containerRef = useRef(null)
  const [horizontalPercentage, setHorizontalPercentage] = useState(50)
  const [maskWidth, setMaskWidth] = useState('50%')
  const xImgs = ['positive', 'v-1', 'v-2', 'v-3', 'v-4', 'v-5', 'v-6', 'v-7', 'v-8']
  const [imageOpacities, setImageOpacities] = useState(xImgs.map(() => 0))

  const maskConfigs = [
    {
      id: 'secundariaContainer1',
      left: `${125 - horizontalPercentage}%`,
      transform: 'translateX(-75%)',
    },
    {
      id: 'secundariaContainer2',
      left: `${100 - horizontalPercentage}%`,
      transform: 'translateX(-50%)',
    },
    {
      id: 'secundariaContainer3',
      left: `${horizontalPercentage}%`,
      transform: 'translateX(-50%)',
    },
    {
      id: 'secundariaContainer4',
      left: `${-25 + horizontalPercentage}%`,
      transform: 'translateX(-25%)',
    },
  ]

  // ... Resto del código original, incluido throttledHandleContainerMove
  const throttledHandleContainerMove = useCallback(
    throttle(e => {
      const newOpacities = xImgs.map(() => 0)
      const randomIndex = Math.floor(Math.random() * xImgs.length)
      newOpacities[randomIndex] = 1
      setImageOpacities(newOpacities)

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left

      const width = rect.width

      // Calcula el porcentaje horizontal y la escala
      const xAxisPercentage = (x / width) * 100
      const horizontalScale = 1 - (Math.abs(width / 2 - x) / width) * 2
      setHorizontalPercentage(xAxisPercentage)
      setMaskWidth(`${Math.max(0, horizontalScale) * 50}%`)
    }, 75),
    []
  )

  return (
    <div
      id="container"
      ref={containerRef}
      onMouseMove={e => throttledHandleContainerMove(e)}
      style={{ aspectRatio: '10/16', position: 'relative' }}
      className="h-[600px] overflow-hidden"
    >
      {xImgs.map((img, index) => (
        <OverlayImage
          img={img}
          opacity={imageOpacities[index]}
        />
      ))}
      {/* Crear múltiples ImageMask con diferentes propiedades */}
      {maskConfigs.map(config => (
        <ImageMask
          xImgs={xImgs}
          imageOpacities={imageOpacities}
          horizontalPercentage={horizontalPercentage}
          maskWidth={maskWidth}
          id={config.id}
          left={config.left}
          transform={config.transform}
        />
      ))}
    </div>
  )
}

export default ContinuousImageFilter
