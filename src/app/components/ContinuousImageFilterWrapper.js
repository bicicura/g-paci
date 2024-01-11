import { useContext, useEffect } from 'react'
import { EffectsContext } from '../contexts/EffectsContext'
import ContinuousImageFilter from './ContinuousImageFilter'

const ContinuousImageFilterWrapper = ({ onDismiss, opacity }) => {
  const { homeEffectConfig, isLoading } = useContext(EffectsContext)

  const shouldShowFilter = homeEffectConfig && homeEffectConfig.active

  useEffect(() => {
    if (!isLoading && homeEffectConfig.active === false) {
      onDismiss()
    }
  }, [homeEffectConfig, isLoading])

  return shouldShowFilter ? (
    <div className="hidden lg:flex items-center justify-center w-full min-h-screen">
      <div className="w-2/6">
        <ContinuousImageFilter
          opacity={opacity}
          onDismiss={onDismiss}
        />
      </div>
    </div>
  ) : null // O renderizar algo diferente si no se debe mostrar el filtro
}

export default ContinuousImageFilterWrapper
