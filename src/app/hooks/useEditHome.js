import { useState, useEffect } from 'react'
import { useSnackbar } from '../contexts/SnackbarContext'
import {
  MAX_FILE_SIZE,
  WORK_STATUS_ACTIVE,
  WORK_STATUS_INACTIVE,
} from '../../../constants'
import { useRouter } from 'next/navigation'

const useEditHome = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [primaryImage, setPrimaryImage] = useState(null)
  const [secondaryImage, setSecondaryImage] = useState(null)
  const { showSnackbar } = useSnackbar()
  const router = useRouter()
  const [effectConfig, setEffectConfig] = useState({
    active: false,
    primaryImage: null,
    secondaryImage: null,
  })
  const [isActive, setIsActive] = useState(effectConfig.active)

  const validateFileSize = () => {
    // Retorna 'true' si ambos archivos son menores o iguales al tamaño máximo permitido
    return (
      (!primaryImage ||
        (primaryImage instanceof File && primaryImage.size <= MAX_FILE_SIZE)) &&
      (!secondaryImage ||
        (secondaryImage instanceof File && secondaryImage.size <= MAX_FILE_SIZE))
    )
  }

  const validateFileType = () => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] // Agrega más tipos si es necesario

    const isValidType = file => file instanceof File && imageTypes.includes(file.type)

    return (
      (!primaryImage || isValidType(primaryImage)) &&
      (!secondaryImage || isValidType(secondaryImage))
    )
  }

  const statusColorMap = {
    [WORK_STATUS_ACTIVE]: 'success',
    paused: 'danger',
    [WORK_STATUS_INACTIVE]: 'warning',
  }

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/effects-config')
      const data = await res.json()
      setEffectConfig(data?.effects?.ContinuousImageFilter)
    })()
  }, [])

  useEffect(() => {
    setIsActive(effectConfig.active)
  }, [effectConfig])

  const uploadImageToS3 = async file => {
    // Solicitar una URL presignada para subir el archivo
    const response = await fetch('/api/s3-presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        slug: 'home-effect',
      }),
    })

    const { signedUrl } = await response.json()

    // Subir el archivo a S3 utilizando la URL presignada
    await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })

    // La URL pública es el signedUrl sin los parámetros de consulta
    const publicUrl = new URL(signedUrl)
    publicUrl.search = ''

    return publicUrl.href // Devolver la URL pública del archivo
  }

  const handleSubmit = async () => {
    if (!validateFileSize()) {
      return showSnackbar(
        'Uno o más archivos superan el tamaño máximo permitido.',
        'error'
      )
    }

    if (!validateFileType()) {
      return showSnackbar(
        'Uno o más archivos no son del tipo de imagen permitido.',
        'error'
      )
    }

    setIsLoading(true) // Suponiendo que tienes un estado para controlar la carga

    try {
      let primaryImageUrl = null
      let secondaryImageUrl = null

      // Verifica si primaryImage y secondaryImage existen y tienen un archivo
      if (primaryImage) {
        const extension = primaryImage.name.split('.').pop()
        const newName = 'primary-image.' + extension // Asegúrate de incluir el punto antes de la extensión
        const newFile = new File([primaryImage], newName, { type: primaryImage.type })
        primaryImageUrl = await uploadImageToS3(newFile)
      }
      if (secondaryImage) {
        const extension = secondaryImage.name.split('.').pop()
        const newName = 'secondary-image.' + extension // Asegúrate de incluir el punto antes de la extensión
        const newFile = new File([secondaryImage], newName, { type: secondaryImage.type })
        secondaryImageUrl = await uploadImageToS3(newFile)
      }

      // Enviar información al backend
      const response = await fetch('/api/home-effect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effectName: 'ContinuousImageFilter',
          newEffectState: isActive,
          primaryImageUrl,
          secondaryImageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      // Procesar la respuesta (opcional, dependiendo de lo que devuelva tu backend)
      const result = await response.json()
      console.log('Respuesta del servidor:', result)

      router.push('/dashboard')
      // como mostrar un mensaje de éxito al usuario o redirigir a otra página.
      showSnackbar('Efecto actualizado con éxito', 'success') // Ejemplo de notificación de éxito
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      showSnackbar('Error al actualizar el efecto', 'error') // Ejemplo de notificación de error
    } finally {
      setIsLoading(false) // Restablecer el estado de carga
    }
  }

  return {
    handleSubmit,
    primaryImage,
    statusColorMap,
    setPrimaryImage,
    secondaryImage,
    WORK_STATUS_ACTIVE,
    WORK_STATUS_INACTIVE,
    effectConfig,
    isLoading,
    setSecondaryImage,
    isActive,
    setIsActive,
  }
}

export default useEditHome
