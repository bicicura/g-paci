import { createContext, useState, useEffect } from 'react'

export const EffectsContext = createContext()

const EffectsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [homeEffectConfig, setHomeEffectConfig] = useState({
    active: false,
    images: [],
  })
  const [infoEffectConfig, setInfoEffectConfig] = useState({
    active: false,
    img: null,
    body: '',
  })

  const getEffectsConfig = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/effects-config')
      const data = await res.json()
      // const homeEffect = data.effects['ContinuousImageFilter']
      const homeEffect = data.effects['ImgSlideEffect']
      const infoEffect = data.effects['SlitScan']
      setHomeEffectConfig(homeEffect)
      setInfoEffectConfig(infoEffect)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getEffectsConfig()
  }, [])

  return (
    <EffectsContext.Provider
      value={{
        homeEffectConfig,
        infoEffectConfig,
        isLoading,
      }}
    >
      {children}
    </EffectsContext.Provider>
  )
}

export default EffectsProvider
