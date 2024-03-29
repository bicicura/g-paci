'use client'

import { Button, Input, Divider, Chip } from '@nextui-org/react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import Link from 'next/link'
import Image from 'next/image'
import { Checkbox } from '@nextui-org/react'
import useEditWork from '@/app/hooks/useEditWork'
import {
  WORK_STATUS_INACTIVE,
  WORK_STATUS_ACTIVE,
  MAX_FILE_SIZE,
} from '../../../../../../constants'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
)

const EditWork = () => {
  const {
    statusColorMap,
    getWorkImages,
    handleSubmit,
    isLoading,
    handleDeleteImg,
    handleNameChange,
    isActive,
    setWork,
    deleteImgLoading,
    work,
    sortableContainerRef,
    workImages,
    setIsActive,
    files,
    setFiles,
  } = useEditWork()

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
              disabled={isLoading}
              isRequired
              type="text"
              label="Nombre"
              description="Ingrese el nombre del proyecto."
              value={work.name}
              onChange={handleNameChange}
              className="max-w-xs text-black"
            />
            <Checkbox
              isSelected={isActive}
              onValueChange={value => {
                setIsActive(value)
                setWork({
                  ...work,
                  status: value ? WORK_STATUS_ACTIVE : WORK_STATUS_INACTIVE,
                })
              }}
            >
              Activo
            </Checkbox>
          </div>

          <Divider className="my-8" />

          <div className="relative">
            <h3 className="mb-4 text-lg text-black">Reordenar imagenes</h3>
            <section
              ref={sortableContainerRef}
              className={`${
                isLoading ? 'pointer-events-none cursor-not-allowed opacity-70' : ''
              } flex flex-wrap w-full gap-6 p-3 border border-gray-100 bg-default-100 rounded-xl`}
            >
              {workImages.length &&
                workImages.map(image => (
                  <div
                    data-id={image.id}
                    key={image.id}
                    className="relative w-32 h-20 border rounded-lg shadow-md group cursor-grab border-default-300"
                  >
                    <div
                      className={`${
                        deleteImgLoading ? '' : 'hidden'
                      } absolute items-center flex justify-center z-10 bg-white rounded-lg inset-0 text-black`}
                    >
                      <svg
                        aria-hidden="true"
                        className="inline w-8 h-8 text-gray-200 animate-spin fill-slate-900"
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
                    </div>
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
                      className="object-contain rounded-lg"
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
              allowImagePreview={false}
              allowProcess={false}
              disabled={isLoading}
              allowFileSizeValidation
              allowFileTypeValidation
              maxFileSize={MAX_FILE_SIZE}
              acceptedFileTypes={['image/*']}
              files={files}
              onprocessfile={getWorkImages}
              onupdatefiles={setFiles}
              allowMultiple={true}
              server={{
                url: `/api/work-images-instant-upload`,
                process: {
                  headers: {
                    'work-id': work.id, // Puedes enviar datos adicionales a través de encabezados
                    'work-slug': work.slug,
                    'work-order': workImages.length,
                  },
                  onerror: response => JSON.parse(response).error,
                },
              }}
              name="files"
              labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
            />
          </div>
          <div className="flex justify-end mt-8">
            <Button
              className="font-bold disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
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
      ) : (
        <p>Loading</p>
      )}
    </>
  )
}

export default EditWork
