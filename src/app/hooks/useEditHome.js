import { useState, useEffect, useRef } from 'react'
import {
  MAX_FILE_SIZE,
  WORK_STATUS_ACTIVE,
  WORK_STATUS_INACTIVE,
} from '../../../constants'
import { toast } from 'sonner'

const useEditHome = () => {
  const pondRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newImage, setNewImage] = useState(null)
  const [effectConfig, setEffectConfig] = useState({
    active: false,
    images: [],
  })
  const [isActive, setIsActive] = useState(effectConfig.active)
  const [isPrimary, setIsPrimary] = useState(false)
  const [client, setClient] = useState('')

  const validateFileSize = () => {
    // Retorna 'true' si ambos archivos son menores o iguales al tamaño máximo permitido
    return !newImage || (newImage instanceof File && newImage.size <= MAX_FILE_SIZE)
  }

  const validateFileType = () => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] // Agrega más tipos si es necesario

    const isValidType = file => file instanceof File && imageTypes.includes(file.type)

    return !newImage || isValidType(newImage)
  }

  const statusColorMap = {
    [WORK_STATUS_ACTIVE]: 'success',
    paused: 'danger',
    [WORK_STATUS_INACTIVE]: 'warning',
  }

  useEffect(() => {
    ;(async () => {
      const data = await requestEffectConfig()
      setEffectConfig(data?.effects?.ImgSlideEffect)
    })()
  }, [])

  const requestEffectConfig = async () => {
    const controller = new AbortController()
    const { signal } = controller

    const res = await fetch('/api/effects-config', {
      signal,
      cache: 'no-store',
      next: { revalidate: 1 },
    })
    const data = await res.json()
    return data
  }

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

  const generateFileName = file => {
    const extension = file.name.split('.').pop()
    const randomName = (Math.random() + 1).toString(36).substring(2)
    return `${randomName}.${extension}`
  }

  const handleSubmit = async () => {
    if (!validateFileSize()) {
      return toast.error('Uno o más archivos superan el tamaño máximo permitido.')
    }

    if (!validateFileType()) {
      return toast.error('Uno o más archivos no son del tipo de imagen permitido.')
    }

    setIsLoading(true)

    try {
      let imageUrl = null

      // Verifica si newImage existe y tiene un archivo
      if (newImage) {
        const newName = generateFileName(newImage)
        const newFile = new File([newImage], newName, { type: newImage.type })
        imageUrl = await uploadImageToS3(newFile)
        // @TODO borrar imagen previa
      }

      // Enviar información al backend
      const response = await fetch('/api/home-effect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effectName: 'ImgSlideEffect',
          newEffectState: isActive,
          imageUrl,
          client,
          isPrimary,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      // Procesar la respuesta (opcional, dependiendo de lo que devuelva tu backend)
      const result = await response.json()
      // console.log('Respuesta del servidor:', result)

      resetForm()
      toast.success('Efecto actualizado con éxito')

      const data = await requestEffectConfig()
      setEffectConfig(data?.effects?.ImgSlideEffect)
    } catch (error) {
      // console.error('Error al enviar la solicitud:', error)
      toast.error('Error al actualizar el efecto')
    } finally {
      setIsLoading(false) // Restablecer el estado de carga
    }
  }

  const resetForm = () => {
    setIsPrimary(false)
    setNewImage(null)
    setClient('')
    pondRef.current.removeFiles()
  }

  return {
    pondRef,
    handleSubmit,
    newImage,
    statusColorMap,
    setNewImage,
    WORK_STATUS_ACTIVE,
    WORK_STATUS_INACTIVE,
    client,
    isPrimary,
    setIsPrimary,
    setClient,
    effectConfig,
    isLoading,
    isActive,
    setIsActive,
  }
}

export default useEditHome
