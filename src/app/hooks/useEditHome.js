import { useState } from 'react'
import { useSnackbar } from '../contexts/SnackbarContext'

const useEditHome = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [primaryImage, setPrimaryImage] = useState(null)
  const [secondaryImage, setSecondaryImage] = useState(null)
  const [files, setFiles] = useState([])
  const { showSnackbar } = useSnackbar()
  const [isActive, setIsActive] = useState(false)

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
    setIsLoading(true) // Suponiendo que tienes un estado para controlar la carga

    try {
      let primaryImageUrl = null
      let secondaryImageUrl = null

      console.log(primaryImage.file, 'primary Image')

      // Verifica si primaryImage y secondaryImage existen y tienen un archivo
      if (primaryImage) {
        primaryImageUrl = await uploadImageToS3(primaryImage)
      }
      if (secondaryImage) {
        secondaryImageUrl = await uploadImageToS3(secondaryImage)
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

      // Aquí puedes incluir acciones adicionales tras una actualización exitosa,
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
    setPrimaryImage,
    files,
    setFiles,
    secondaryImage,
    isLoading,
    setSecondaryImage,
    isActive,
    setIsActive,
  }
}

export default useEditHome
