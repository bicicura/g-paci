import { useState } from 'react'
import slugify from 'slugify'
import supabase from '../../../utils/supabaseClient'
import { useRouter } from 'next/navigation'
import { useSnackbar } from '../contexts/SnackbarContext'

const useCreateWork = () => {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState([])
  const router = useRouter()
  const { showSnackbar } = useSnackbar()

  const handleNameChange = event => {
    setName(event.target.value) // Actualiza el estado `name` con el valor actual del input
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

  const uploadFilesToS3 = async ({ slug, workId }) => {
    const formData = new FormData()

    files.forEach(fileItem => {
      formData.append('files', fileItem.file)
    })

    formData.append('slug', slug)
    formData.append('workId', workId)

    // Make a single fetch request with all files
    const response = await fetch('/api/work-images', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return response.json() // This should be a promise
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
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

  const handleImageReorder = reorderedFiles => setFiles(reorderedFiles)

  const validateForm = () => name.length > 0 && files.length > 0

  return {
    handleImageReorder,
    handleNameChange,
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
