'use client'

import { Button, Input, Divider, Chip } from '@nextui-org/react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import { useEffect, useState } from 'react'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import supabase from '../../../../../../utils/supabaseClient'
import { Checkbox } from '@nextui-org/react'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
)

const EditWork = () => {
  const pathname = usePathname()
  const [files, setFiles] = useState([])
  const [work, setWork] = useState({ name: '', status: '', slug: '', id: null })
  const [isActive, setIsActive] = useState(false)
  const [workImages, setWorkImages] = useState([])

  const statusColorMap = {
    active: 'success',
    paused: 'danger',
    inactive: 'warning',
  }

  async function getTableData() {
    try {
      const slug = pathname.split('/').pop()
      let { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('slug', slug)
        .limit(1)
        .single()
      setWork(data)
      setIsActive(data.status === 'active' ? true : false)
    } catch (error) {
      console.log(error)
    }
  }

  async function getWorkImages() {
    try {
      let { data, error } = await supabase
        .from('works_images')
        .select('*')
        .eq('work_id', work.id) // Suponiendo que 'work_id' es la columna de la tabla 'work_images' que referencia 'id' de la tabla 'works'

      if (error) throw error

      // Procesar data, que contiene las imágenes relacionadas con el trabajo
      console.log(data)
      setWorkImages(data)
    } catch (error) {
      console.error('Error fetching work images: ', error)
    }
  }

  const handleDeleteImg = async ({ id, img }) => {
    try {
      await fetch('/api/work-images', {
        method: 'DELETE',
        body: JSON.stringify({
          'img-id': id,
          slug: work.slug,
          'file-name': img,
        }),
      })
      await getWorkImages()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTableData()
  }, [])

  useEffect(() => {
    if (work.id) {
      getWorkImages(work.id)
    }
  }, [work.id])

  return (
    <>
      {work.slug ? (
        <section>
          <div className="flex items-center gap-4 mb-12">
            <Link href="/dashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 transition-colors duration-200 cursor-pointer text-default-700 hover:text-default-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </Link>

            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-default-700">{work.name}</h1>
              <Chip
                className="capitalize"
                color={statusColorMap[work.status]}
                size="sm"
                variant="flat"
              >
                {work.status}
              </Chip>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Input
              type="text"
              label="Título"
              description="Ingrese el nombre del proyecto."
              value={work.name}
              className="max-w-xs text-black"
            />
            <Checkbox
              isSelected={isActive}
              onValueChange={setIsActive}
            >
              Active
            </Checkbox>
          </div>

          <Divider className="my-8" />

          <div>
            <h3 className="mb-4 text-lg text-black">Reordenar imagenes</h3>
            <section className="flex flex-wrap w-full gap-6 p-3 border border-gray-100 bg-default-100 rounded-xl">
              {workImages.length &&
                workImages.map(image => (
                  <div
                    key={image.id}
                    className="relative w-32 h-20 border rounded-lg shadow-md group cursor-grab border-default-300 "
                  >
                    <button
                      className="opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 duration-200 ease-in-out transition-all tran absolute z-10 flex items-center justify-center w-8 h-8 bg-red-500 rounded-full -top-4 -right-4"
                      onClick={() => {
                        handleDeleteImg(image)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="rotate-45"
                        width="13"
                        height="14"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#fff"
                          d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
                        ></path>
                      </svg>
                    </button>
                    <Image
                      className="object-contain rounded-lg "
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${work.slug}/${image.img}`}
                      alt="hero image"
                      priority
                      fill
                      sizes="200px"
                    />
                  </div>
                ))}
            </section>
          </div>

          <Divider className="my-8" />

          <div>
            <h3 className="mb-4 text-lg text-black">Cargar nuevas imagenes</h3>
            <FilePond
              allowFileSizeValidation
              allowFileTypeValidation
              maxFileSize={5000000}
              acceptedFileTypes={['image/*']}
              files={files}
              onprocessfile={e => getWorkImages()}
              onupdatefiles={setFiles}
              allowMultiple={true}
              server={{
                url: `/api/work-images-instant-upload`,
                process: {
                  headers: {
                    'work-id': work.id, // Puedes enviar datos adicionales a través de encabezados
                    'work-slug': work.slug,
                  },
                  onload: response => JSON.parse(response).data,
                  onerror: response => JSON.parse(response).error,
                },
              }}
              name="files"
              labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
            />
          </div>
          <div className="flex justify-end mt-8">
            <Button
              className="font-bold"
              color="primary"
            >
              Save
            </Button>
          </div>
        </section>
      ) : (
        <p>Loading</p>
      )}
    </>
  )
}

export default EditWork
