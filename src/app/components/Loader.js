// Loader.js
import { useState, useEffect, useRef } from 'react'

const Loader = ({ onVideoPlayedOnce }) => {
  const [fadeOut, setFadeOut] = useState(false)
  const videoRef = useRef(null)

  const handleVideoEnd = () => {
    setFadeOut(true)
    setTimeout(onVideoPlayedOnce, 1000) // Notifica al componente padre después de la transición
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white 
                  transition-opacity duration-1000 ${
                    fadeOut ? 'opacity-0' : 'opacity-100'
                  }`}
      style={{ zIndex: 4000 }}
    >
      <video
        ref={videoRef}
        className="max-w-full aspect-auto w-[38rem]"
        width="1080"
        height="1350"
        autoPlay
        muted
        onEnded={handleVideoEnd} // Manejador para el evento ended
      >
        <source
          src="/loader.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  )
}

export default Loader
