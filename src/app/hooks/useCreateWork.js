import { useState } from 'react'
import slugify from 'slugify'
import supabase from '../../../utils/supabaseClient'
import { useRouter } from 'next/navigation'
import { useSnackbar } from '../contexts/SnackbarContext'
import { MAX_FILE_SIZE } from '../../../constants'

const useCreateWork = () => {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState([])
  const router = useRouter()
  const { showSnackbar } = useSnackbar()

  const handleNameChange = event => {
    setName(event.target.value) // Actualiza el estado `name` con el valor actual del input
  }

  const handleFileAdd = fileItems => {
    const oversizedFiles = fileItems.filter(
      fileItem => fileItem.file.size > MAX_FILE_SIZE
    )

    if (oversizedFiles.length > 0) {
      // Remove oversized files
      setFiles(files => files.filter(file => !oversizedFiles.includes(file)))

      // Show notification for each oversized file
      oversizedFiles.forEach(fileItem => {
        showSnackbar(
          `File "${fileItem.file.name}" is too large and has been removed.`,
          'error'
        )
      })
    } else {
      // Update the files state if all files are within the size limit
      setFiles(fileItems)
    }
  }

  const generateSlug = text => {
    return slugify(text, {
      replacement: '-', // reemplazar espacios y caracteres especiales por guiones
      remove: undefined, // patrón de regex para caracteres a eliminar, undefined elimina los no permitidos en una URL
      lower: true, // convertir a minúsculas
      strict: true, // recortar caracteres que no son palabras ni números
      locale: 'en', // idioma para la transliteración
    })
  }

  async function createUniqueSlug(baseSlug, supabase) {
    let uniqueSlug = generateSlug(baseSlug)
    let counter = 2 // Comienza en 2 para que el primer duplicado sea '-2'

    while (true) {
      let { data, error } = await supabase
        .from('works')
        .select('slug')
        .eq('slug', uniqueSlug)

      if (error) {
        throw new Error(error.message)
      }

      if (data.length === 0) {
        break // Si data está vacío, el slug es único y podemos salir del bucle
      }

      // Si el slug ya existe, agrega o incrementa el contador al final del slug
      uniqueSlug = `${generateSlug(baseSlug)}-${counter}`
      counter++
    }

    return uniqueSlug
  }

  const generateFileName = file => {
    // Extrae la extensión del archivo del nombre original del archivo
    const extension = file.name.split('.').pop()
    const randomName = (Math.random() + 1).toString(36).substring(2)
    return `${randomName}.${extension}`
  }

  const uploadFilesToS3 = async ({ slug, workId }) => {
    let fileDetailsArray = []
    let order = 0 // Initialize order, assuming it's a simple counter

    for (const fileItem of files) {
      const originalFileName = fileItem.file.name
      const randomFileName = generateFileName(fileItem.file)
      const fileType = fileItem.file.type

      // Request a pre-signed URL from your backend with the random file name
      const response = await fetch('/api/s3-presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: randomFileName, fileType, slug }),
      })

      const { signedUrl } = await response.json()

      // Use the pre-signed URL to upload the file directly to S3
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileType,
        },
        body: fileItem.file,
      })

      if (uploadResponse.ok) {
        // Add file details to the array
        fileDetailsArray.push({
          fileName: randomFileName,
          fileUrl: signedUrl, // URL of the uploaded file
          order: order++, // Increment order for each file
        })
      } else {
        throw new Error('Failed to upload to S3')
      }
    }

    // After all files are uploaded, update the database with file details
    try {
      const dbUpdateResponse = await fetch('/api/work-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workId: workId,
          files: fileDetailsArray,
        }),
      })

      // Handle the response from your database update API
      if (!dbUpdateResponse.ok) {
        throw new Error('Failed to update database with file information')
      }

      // Process the response or handle the successful update
      const dbUpdateResult = await dbUpdateResponse.json()
      console.log(dbUpdateResult, 'Database update result')
    } catch (error) {
      console.error('Error updating database:', error)
      // Handle error appropriately
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Show error for oversized file
      if (!validateFileSize()) {
        return showSnackbar(
          'Uno o más archivos superan el tamaño máximo permitido.',
          'error'
        )
      }
      // Show error for other form validation failures
      return showSnackbar('Por favor, completa todos los campos.', 'error')
    }

    try {
      setIsLoading(true)
      const uniqueSlug = await createUniqueSlug(name, supabase)

      // Create a new entry in the 'works' table
      const res = await insertWork(uniqueSlug)
      const workData = await res.json()

      // Get the id of the inserted work
      const workId = workData[0].id

      // Insert records in 'work_images' for each image
      await uploadFilesToS3({ slug: uniqueSlug, workId })

      router.push('/dashboard')
      showSnackbar('Work creado exitosamente.', 'success')
    } catch (error) {
      console.error('Error during the upload process:', error)
      showSnackbar('Hubo un error, intente más tarde.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const insertWork = async slug => {
    return await fetch('/api/work', {
      method: 'POST',
      body: JSON.stringify({ name, slug, status: 'active' }),
    })
  }

  const validateFileSize = () => {
    return files.every(fileItem => {
      return fileItem.file.size <= MAX_FILE_SIZE
    })
  }

  const validateForm = () => {
    return name.length > 0 && files.length > 0 && validateFileSize()
  }

  return {
    handleNameChange,
    handleFileAdd,
    handleSubmit,
    validateForm,
    isLoading,
    setFiles,
    setName,
    files,
    name,
  }
}

export default useCreateWork
