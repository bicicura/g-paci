'use client'

import { Button, Chip } from '@nextui-org/react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import Link from 'next/link'
import useEditHome from '@/app/hooks/useEditHome'
import { MAX_FILE_SIZE } from '../../../../../constants'
import { Checkbox } from '@nextui-org/react'
import { useState } from 'react'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
)

const EditHome = () => {
  const {
    handleSubmit,
    setPrimaryImage,
    setSecondaryImage,
    isLoading,
    isActive,
    setIsActive,
  } = useEditHome()

  return (
    <section>
      <div className="mb-12">
        <div className="flex items-center gap-4">
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

          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-default-700">Home</h1>
              <Chip
                className="capitalize"
                color={'success'}
                size="sm"
                variant="flat"
              >
                Active
              </Chip>
            </div>
          </div>
        </div>
        <span className="text-black block ml-12 pl-0.5 mt-2 text-sm text-slate-500">
          Editando el efecto al ingresar al sitio.
        </span>
      </div>
      <Checkbox
        isSelected={isActive}
        onValueChange={value => {
          setIsActive(value)
          // setWork({
          //   ...work,
          //   status: value ? WORK_STATUS_ACTIVE : WORK_STATUS_INACTIVE,
          // })
        }}
      >
        <span className="text-lg">Activo</span>
      </Checkbox>

      <div className="mt-12 text-black space-y-12">
        <div className="grid grid-cols-3">
          <span className="text-lg">Imagen primaria</span>
          <div className="col-span-2">
            <FilePond
              className="w-full"
              allowFileSizeValidation
              allowFileTypeValidation
              allowProcess={false}
              maxFileSize={MAX_FILE_SIZE}
              acceptedFileTypes={['image/*']}
              disabled={isLoading}
              instantUpload={false}
              onupdatefiles={fileItems => {
                // Suponiendo que es el FilePond para la imagen primaria
                setPrimaryImage(fileItems.length ? fileItems[0].file : null)
              }}
              allowMultiple={false}
              server="/api/work"
              name="primaryImage" /* sets the file input name, it's filepond by default */
              labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
            />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <span className="text-lg">Imagen secundaria</span>
          <div className="col-span-2">
            <FilePond
              className="w-full"
              allowFileSizeValidation
              allowFileTypeValidation
              allowProcess={false}
              maxFileSize={MAX_FILE_SIZE}
              acceptedFileTypes={['image/*']}
              disabled={isLoading}
              instantUpload={false}
              onupdatefiles={fileItems => {
                // Suponiendo que es el FilePond para la imagen primaria
                setSecondaryImage(fileItems.length ? fileItems[0].file : null)
              }}
              allowMultiple={false}
              server="/api/work"
              name="secondaryImage" /* sets the file input name, it's filepond by default */
              labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button
          disabled={isLoading}
          className="font-bold disabled:opacity-70 disabled:cursor-not-allowed"
          color="primary"
          onClick={() => handleSubmit()}
        >
          {isLoading && (
            <svg
              aria-hidden="true"
              className="inline w-5 h-5 text-gray-200 animate-spin fill-slate-900"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
          Guardar
        </Button>
      </div>
    </section>
  )
}

export default EditHome
