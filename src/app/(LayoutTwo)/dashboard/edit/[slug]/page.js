'use client'

import { Button, Input, Divider, Chip } from '@nextui-org/react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import { useEffect, useState } from 'react'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import supabase from '../../../../../../utils/supabaseClient'
import { Checkbox } from '@nextui-org/react'

registerPlugin(FilePondPluginImageExifOrientation)

const EditWork = () => {
  const pathname = usePathname()
  const [files, setFiles] = useState([])
  const [work, setWork] = useState({})
  const [isActive, setIsActive] = useState(false)

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

  useEffect(() => {
    getTableData()
  }, [])

  return (
    <>
      {work && (
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

            <div className="flex gap-4 items-center">
              <h1 className="text-3xl text-default-700 font-bold">{work.name}</h1>
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
            <h3 className="text-black text-lg mb-4">Reordenar imagenes</h3>
            <section className="p-3 flex gap-3 bg-default-100 rounded-xl border border-gray-100">
              <div className="h-20 w-32 relative rounded-lg shadow-md cursor-grab overflow-hidden border border-default-300 ">
                <Image
                  className=" object-contain rounded-lg"
                  src={`/images/work/${work.slug}/slide-1.jpg`}
                  alt="hero image"
                  priority
                  layout="fill"
                />
              </div>
              <div className="h-20 w-32 relative rounded-lg shadow-md cursor-grab overflow-hidden border border-default-300 ">
                <Image
                  className=" object-contain rounded-lg"
                  src={`/images/work/${work.slug}/slide-2.jpg`}
                  alt="hero image"
                  priority
                  layout="fill"
                />
              </div>
              <div className="h-20 w-32 relative rounded-lg shadow-md cursor-grab overflow-hidden border border-default-300 ">
                <Image
                  className=" object-contain rounded-lg"
                  src={`/images/work/${work.slug}/slide-3.jpg`}
                  alt="hero image"
                  priority
                  layout="fill"
                />
              </div>
            </section>
          </div>

          <Divider className="my-8" />

          <div>
            <h3 className="text-black text-lg mb-4">Cargar nuevas imagenes</h3>
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
      )}
    </>
  )
}

export default EditWork
