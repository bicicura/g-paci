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

  const handleSubmit = async () => {
    try {
      await insertWork()
    } catch (error) {
      console.log(error)
    }
  }

  const insertWork = async slug => {
    const uniqueSlug = await createUniqueSlug(name, supabase)
    const { data, error } = await supabase
      .from('works')
      .insert([{ name: name, slug: uniqueSlug, status: 'active' }])
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
