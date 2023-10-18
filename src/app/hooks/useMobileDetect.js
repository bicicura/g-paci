import { useState, useEffect } from 'react'

const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Ejecutar la función handleResize una vez al montar el componente
    handleResize()

    // Escuchar los eventos de redimensionamiento y actualizar isMobile en consecuencia
    window.addEventListener('resize', handleResize)

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}

export default useMobileDetect
