import { useState } from 'react'
import slugify from 'slugify'
import supabase from '../../../utils/supabaseClient'

const useCreateWork = () => {
  const [name, setName] = useState('')
  const [files, setFiles] = useState([])

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
    // Asegúrate de que 'files' es un array
    if (!Array.isArray(files)) {
      throw new Error('files is not iterable')
    }

    // Mapea cada archivo a una promesa de carga
    const uploadPromises = files.map(fileItem => {
      const formData = new FormData()
      formData.append('slug', slug)
      formData.append('file', fileItem.file)
      formData.append('workId', workId)

      // Devuelve la promesa de fetch directamente
      return fetch('/api/work-images', {
        method: 'POST',
        body: formData, // No establezcas el Content-Type aquí, fetch lo manejará.
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
    })

    // Devuelve el array de promesas
    return uploadPromises
  }

  const handleSubmit = async () => {
    try {
      const uniqueSlug = await createUniqueSlug(name, supabase)

      // Crear una nueva entrada en la tabla 'works'
      const res = await insertWork(uniqueSlug)
      const workData = await res.json()

      // Obtener el id del trabajo insertado
      const workId = workData[0].id

      // Insertar registros en 'work_images' para cada imagen
      const uploadPromises = await uploadFilesToS3({ slug: uniqueSlug, workId })

      // Espera a que todas las cargas terminen
      const imageUrls = await Promise.all(uploadPromises)

      console.log(imageUrls)

      console.log('Work and images uploaded successfully')
    } catch (error) {
      console.error('Error during the upload process:', error)
    }
  }

  const insertWork = async slug => {
    return await fetch('/api/work', {
      method: 'POST',
      body: JSON.stringify({ name, slug, status: 'active' }),
    })
  }

  const handleImageReorder = reorderedFiles => setFiles(reorderedFiles)

  return {
    handleImageReorder,
    handleNameChange,
    handleSubmit,
    setFiles,
    setName,
    files,
    name,
  }
}

export default useCreateWork
