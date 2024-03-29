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
  const [deleteImgLoading, setDeleteImgLoading] = useState(false)
  const [newImage, setNewImage] = useState(null)
  const [effectConfig, setEffectConfig] = useState({
    active: false,
    images: [],
  })
  const [isActive, setIsActive] = useState(effectConfig.active)
  const [isPrimary, setIsPrimary] = useState(false)
  const [client, setClient] = useState('')
  const [isError, setIsError] = useState(false)

  const validateFileSize = () => {
    // Retorna 'true' si ambos archivos son menores o iguales al tamaño máximo permitido
    return !newImage || (newImage instanceof File && newImage.size <= MAX_FILE_SIZE)
  }

  const handleDelete = async imgID => {
    setDeleteImgLoading(true)
    try {
      const response = await fetch('/api/home-effect', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imgID,
        }),
      })
      toast.success('Imagen eliminada con éxito.')

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await requestEffectConfig()
      setEffectConfig(data?.effects?.ImgSlideEffect)
    } catch (error) {
      // console.error('Error al enviar la solicitud:', error)
      toast.error('Error al borrar la imagen.')
    } finally {
      setDeleteImgLoading(false)
    }
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
    let data = await res.json()

    // Utilizando desestructuración para acceder a images de una manera más directa
    const { effects: { ImgSlideEffect: { images } = {} } = {} } = data

    // Verificar si images es un array y luego filtrar elementos no deseados
    if (Array.isArray(images)) {
      // Filtra imágenes donde la url no sea null ni undefined
      data.effects.ImgSlideEffect.images = images
        .filter(({ url }) => url != null)
        .sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) {
            return -1 // a viene antes que b
          } else if (!a.isPrimary && b.isPrimary) {
            return 1 // b viene antes que a
          } else {
            return 0 // a y b se mantienen sin cambios entre ellos
          }
        })
    }

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

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setIsLoading(true)

      if (newImage) {
        if (client == null || client === '') {
          toast.error('Ingrese un cliente válido.')
          return setIsError(true)
        }

        if (!validateFileSize()) {
          return toast.error('Uno o más archivos superan el tamaño máximo permitido.')
        }

        if (!validateFileType()) {
          return toast.error('Uno o más archivos no son del tipo de imagen permitido.')
        }
      }

      if (isError) {
        setIsError(false)
      }

      let imageUrl = null

      // Verifica si newImage existe y tiene un archivo
      if (newImage) {
        const newName = generateFileName(newImage)
        const newFile = new File([newImage], newName, { type: newImage.type })
        imageUrl = await uploadImageToS3(newFile)
      }

      // Enviar información al backend
      const response = await fetch('/api/home-effect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effectName: 'ImgSlideEffect',
          newEffectState: isActive,
          imageUrl: imageUrl ?? null,
          client: client ?? null,
          isPrimary,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      resetForm()
      toast.success('Efecto actualizado con éxito')

      const data = await requestEffectConfig()
      setEffectConfig(data?.effects?.ImgSlideEffect)
    } catch (error) {
      toast.error('Error al actualizar el efecto')
    } finally {
      setIsLoading(false)
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
    isError,
    handleDelete,
    deleteImgLoading,
  }
}

export default useEditHome
