'use client'

import { Input } from '@nextui-org/react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import { useState } from 'react'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation)

const CreateProject = () => {
  const [files, setFiles] = useState([])

  return (
    <section className="max-w-5xl mx-auto mt-20">
      <Input
        type="text"
        label="Título"
        description="Ingrese el nombre del proyecto."
        className="max-w-xs"
      />

      <div className="mt-8">
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={true}
          allowReorder={true}
          server="/api/work"
          name="files" /* sets the file input name, it's filepond by default */
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
      </div>
    </section>
  )
}

export default CreateProject
