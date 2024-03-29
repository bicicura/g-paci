'use client'
export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { Button, Chip, Divider, Tooltip, Input } from '@nextui-org/react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import Link from 'next/link'
import useEditHome from '@/app/hooks/useEditHome'
import { MAX_FILE_SIZE } from '../../../../../constants'
import { Checkbox } from '@nextui-org/react'
import Image from 'next/image'
import { Toaster } from 'sonner'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImagePreview
)

const EditHome = () => {
  const {
    handleSubmit,
    setNewImage,
    client,
    pondRef,
    setClient,
    isPrimary,
    setIsPrimary,
    WORK_STATUS_ACTIVE,
    WORK_STATUS_INACTIVE,
    isLoading,
    isActive,
    setIsActive,
    effectConfig,
    isError,
    handleDelete,
    deleteImgLoading,
  } = useEditHome()

  return (
    <section>
      <Toaster
        richColors
        position="bottom-right"
        closeButton
      />
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
                color={isActive ? 'success' : 'warning'}
                size="sm"
                variant="flat"
              >
                {isActive ? WORK_STATUS_ACTIVE : WORK_STATUS_INACTIVE}
              </Chip>
            </div>
          </div>
        </div>
        <span className="text-black block ml-12 pl-0.5 mt-2 text-sm text-slate-500">
          Se recomienda imagenes con orientación vertical y que <br /> compartan las
          mismas dimensiones.
        </span>
      </div>
      <div className="flex gap-6">
        <Checkbox
          className=""
          isSelected={isActive}
          onValueChange={value => {
            setIsActive(value)
          }}
        >
          <span className="text-lg">Activo</span>
        </Checkbox>

        <div className="flex gap-6">
          {effectConfig?.images &&
            effectConfig?.images.map(img => (
              <div
                key={img.id}
                className="relative group"
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
                <Tooltip
                  className={`text-black ${img?.isPrimary ? 'bg-yellow-100' : ''}`}
                  content={img?.client}
                  placement={'bottom'}
                >
                  <Image
                    priority
                    className={`aspect-video object-contain border ${
                      img?.isPrimary ? 'border-yellow-300 bg-yellow-100' : 'bg-slate-100'
                    } rounded-lg`}
                    width={150}
                    height={150}
                    src={img?.url}
                    alt="Home effect primary image"
                  />
                </Tooltip>
                <button
                  onClick={() => handleDelete(img.id)}
                  className={`${
                    deleteImgLoading ? 'hidden' : ''
                  } opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 duration-200 ease-in-out transition-all tran absolute z-10 flex items-center justify-center w-8 h-8 bg-red-500 rounded-full -top-4 -right-4`}
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
              </div>
            ))}
        </div>
      </div>

      <Divider className="my-12" />

      <form
        className="text-black"
        onSubmit={e => handleSubmit(e)}
      >
        <div className=" flex gap-12">
          <Input
            type="text"
            isInvalid={isError}
            label="Cliente"
            className="max-w-xs text-black"
            value={client}
            onChange={e => setClient(e.target.value)}
            disabled={isLoading || effectConfig?.images.length >= 6}
            errorMessage={isError ? 'Ingrese un cliente válido.' : null}
          />
          <Checkbox
            isSelected={isPrimary}
            isDisabled={
              isLoading ||
              effectConfig.images.filter(item => item.isPrimary).length >= 2 ||
              effectConfig?.images.length >= 6
            }
            onValueChange={value => {
              setIsPrimary(value)
            }}
          >
            <span className="text-lg">Primaria</span>
          </Checkbox>
        </div>
        <div className="mt-8">
          <h3 className="mb-4 text-lg text-black">Imagenes</h3>
          <div className="col-span-2">
            <FilePond
              ref={pondRef}
              allowImagePreview
              imagePreviewMaxFileSize={MAX_FILE_SIZE / 1000000 + 'MB'}
              className="w-full"
              allowFileSizeValidation
              allowFileTypeValidation
              allowProcess={false}
              maxFileSize={MAX_FILE_SIZE}
              acceptedFileTypes={['image/*']}
              disabled={isLoading || effectConfig?.images.length >= 6}
              instantUpload={false}
              required={client ? true : false}
              onupdatefiles={fileItems => {
                // Suponiendo que es el FilePond para la imagen primaria
                setNewImage(fileItems.length ? fileItems[0].file : null)
              }}
              allowMultiple={false}
              name="newImage"
              labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
            />
          </div>
        </div>
        <div className="flex justify-end mt-12">
          <Button
            type="submit"
            disabled={isLoading}
            className="font-bold disabled:opacity-70 disabled:cursor-not-allowed"
            color="primary"
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
            Enviar
          </Button>
        </div>
      </form>
    </section>
  )
}

export default EditHome
