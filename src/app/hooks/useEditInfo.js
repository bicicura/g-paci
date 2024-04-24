import { useState, useEffect } from 'react'
import {
  MAX_FILE_SIZE,
  WORK_STATUS_ACTIVE,
  WORK_STATUS_INACTIVE,
} from '../../../constants'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const useEditInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [primaryImage, setPrimaryImage] = useState(null)
  const [secondaryImage, setSecondaryImage] = useState(null)
  const router = useRouter()
  const [effectConfig, setEffectConfig] = useState({
    active: false,
    image: null,
    body: '',
  })
  const [body, setBody] = useState(effectConfig.body)
  const [isActive, setIsActive] = useState(effectConfig.active)

  const generateFileName = file => {
    const extension = file.name.split('.').pop()
    const randomName = (Math.random() + 1).toString(36).substring(2)
    return `${randomName}.${extension}`
  }

  const validateFileSize = () => {
    // Retorna 'true' si el archivo es menor o igual al tamaño máximo permitido
    return (
      !primaryImage ||
      (primaryImage instanceof File && primaryImage.size <= MAX_FILE_SIZE)
    )
  }

  const validateFileType = () => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] // Agrega más tipos si es necesario

    const isValidType = file => file instanceof File && imageTypes.includes(file.type)

    return !primaryImage || isValidType(primaryImage)
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
      setEffectConfig(data?.effects?.SlitScan)
    })()
  }, [])

  useEffect(() => {
    setIsActive(effectConfig.active)
    setBody(effectConfig.body)
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
        slug: 'slitscan-effect',
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
      return toast.error('El archivo supera el tamaño máximo permitido.')
    }

    if (!validateFileType()) {
      return toast.error('El archivo no es del tipo de imagen permitido.')
    }

    setIsLoading(true)

    try {
      let imageUrl = null

      // Verifica si primaryImage existe y tienen un archivo
      if (primaryImage) {
        const newName = generateFileName(primaryImage)
        const newFile = new File([primaryImage], newName, { type: primaryImage.type })
        imageUrl = await uploadImageToS3(newFile)
      }

      // Enviar información al backend
      const response = await fetch('/api/info-effect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effectName: 'SlitScan',
          newEffectState: isActive,
          primaryImageUrl: imageUrl,
          body,
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
      toast.success('Efecto actualizado con éxito')
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      toast.error('Error al actualizar el efecto')
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
    body,
    setBody,
    WORK_STATUS_ACTIVE,
    WORK_STATUS_INACTIVE,
    effectConfig,
    isLoading,
    setSecondaryImage,
    isActive,
    setIsActive,
  }
}

export default useEditInfo
