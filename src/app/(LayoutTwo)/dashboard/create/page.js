'use client'

import { Button, Input } from '@nextui-org/react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import { useState } from 'react'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import Link from 'next/link'
import supabase from '../../../../../utils/supabaseClient'
import slugify from 'slugify'

registerPlugin(FilePondPluginImageExifOrientation)

const CreateWork = () => {
  const [name, setName] = useState('')
  const [files, setFiles] = useState([])

  const handleNameChange = event => {
    setName(event.target.value) // Actualiza el estado `name` con el valor actual del input
  }

  function generateSlug(text) {
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

  const uploadFilesToS3 = async (files, slug) => {
    // Asegúrate de que 'files' es un array
    if (!Array.isArray(files)) {
      throw new Error('files is not iterable')
    }

    // Mapea cada archivo a una promesa de carga
    const uploadPromises = files.map(fileItem => {
      const formData = new FormData()
      formData.append('slug', slug)
      formData.append('file', fileItem.file)
      // Devuelve la promesa de fetch directamente
      return fetch('/api/work', {
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
      // Asegúrate de que 'files' es un array antes de pasar a la función
      const uploadPromises = await uploadFilesToS3(files, uniqueSlug)

      // Espera a que todas las cargas terminen
      const imageUrls = await Promise.all(uploadPromises)
      console.log(imageUrls)

      // Inserta la información en Supabase aquí
      // Crear una nueva entrada en la tabla 'works'
      const { data: workData, error: workError } = await insertWork(uniqueSlug)

      if (workError) {
        throw new Error(workError.message)
      }

      // Obtener el id del trabajo insertado
      const workId = workData[0].id

      // Insertar registros en 'work_images' para cada imagen
      const imageInsertPromises = imageUrls.map(url => insertWorkImage(workId, url))
      await Promise.all(imageInsertPromises)

      console.log('Work and images uploaded successfully')
    } catch (error) {
      console.error('Error during the upload process:', error)
    }
  }

  const insertWork = async slug => {
    return await supabase
      .from('works')
      .insert([{ name: name, slug: slug, status: 'active' }])
      .select()
  }

  return (
    <section>
      <div className="mb-12 flex gap-4 items-center">
        <Link href="/dashboard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-default-700 cursor-pointer hover:text-default-400 transition-colors duration-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>

        <h1 className="text-3xl text-default-700 font-bold">Crear proyecto</h1>
      </div>
      <Input
        type="text"
        label="Título"
        value={name}
        onChange={handleNameChange}
        description="Ingrese el nombre del proyecto."
        className="max-w-xs text-black"
      />

      <div className="mt-8">
        <h3 className="text-black text-lg mb-4">Imagenes</h3>
        <FilePond
          instantUpload={false}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={true}
          allowReorder={true}
          label="holis"
          server="/api/work"
          name="files" /* sets the file input name, it's filepond by default */
          labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
        />
      </div>
      <div className="flex mt-8 justify-end">
        <Button
          className="font-bold"
          color="primary"
          onClick={() => handleSubmit()}
        >
          Save
        </Button>
      </div>
    </section>
  )
}

export default CreateWork
