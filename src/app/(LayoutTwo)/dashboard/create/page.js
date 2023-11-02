'use client'

import { Button, Input } from '@nextui-org/react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import { useState } from 'react'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import Link from 'next/link'
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation)

const CreateWork = () => {
  const [files, setFiles] = useState([])

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
        >
          Save
        </Button>
      </div>
    </section>
  )
}

export default CreateWork
