import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import supabase from '../../../utils/supabaseClient'
import Sortable from 'sortablejs'
import { useRouter } from 'next/navigation'
import { useSnackbar } from '../contexts/SnackbarContext'
import { WORK_STATUS_ACTIVE, WORK_STATUS_INACTIVE } from '../../../constants'

const useEditWork = () => {
  const pathname = usePathname()
  const [files, setFiles] = useState([])
  const [work, setWork] = useState({ name: '', status: '', slug: '', id: null })
  const [isActive, setIsActive] = useState(false)
  const [workImages, setWorkImages] = useState([])
  const sortableContainerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showSnackbar } = useSnackbar()
  const [deleteImgLoading, setDeleteImgLoading] = useState(false)

  const statusColorMap = {
    [WORK_STATUS_ACTIVE]: 'success',
    paused: 'danger',
    [WORK_STATUS_INACTIVE]: 'warning',
  }

  useEffect(() => {
    if (sortableContainerRef.current) {
      new Sortable(sortableContainerRef.current, {
        animation: 150,
        onEnd: function () {
          const orderedNodes = sortableContainerRef.current.children
          const orderedIds = Array.from(orderedNodes).map(node => node.dataset.id)

          // Create a map of id to new order
          const orderMap = orderedIds.reduce((acc, id, index) => {
            acc[id] = index
            return acc
          }, {})

          setWorkImages(prevImages => {
            const updatedWorkImages = prevImages.map(image => ({
              ...image,
              order: orderMap[image.id.toString()] ?? image.order,
            }))

            return updatedWorkImages
          })
        },
      })
    }
  }, [sortableContainerRef, workImages])

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
      setIsActive(data.status === WORK_STATUS_ACTIVE ? true : false)
    } catch (error) {
      console.log(error)
    }
  }

  async function getWorkImages() {
    try {
      let { data, error } = await supabase
        .from('works_images')
        .select('*')
        .eq('work_id', work.id)
        .order('order', { ascending: true })

      if (error) throw error

      console.log(data, 'data')

      setWorkImages(data)
    } catch (error) {
      console.error('Error fetching work images: ', error)
    }
  }

  const toggleWorkStatus = async newStatus => {
    return await fetch('/api/work/set-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workId: work.id,
        newStatus: newStatus,
      }),
    })
  }

  const handleDeleteImg = async ({ id, img }) => {
    setDeleteImgLoading(true)
    if (workImages.length === 1) {
      // Establecer el trabajo como inactivo
      try {
        const response = await toggleWorkStatus(WORK_STATUS_INACTIVE)
        const result = await response.json()

        if (response.ok) {
          setIsActive(false)
          setWork({ ...work, status: WORK_STATUS_INACTIVE })
          try {
            await deleteImg({ id, img })
            showSnackbar('Se ha eliminado la imagen con éxito.', 'success')
            await getWorkImages()
          } catch (error) {
            showSnackbar(
              'Ocurrió un error al eliminar la imagen, intente más tarde.',
              'error'
            )
          }
        } else {
          // Manejar la respuesta de error de la API
          console.error('Error al actualizar el estado:', result.error)
          showSnackbar('Error al actualizar el estado del trabajo.', 'error')
        }
      } catch (error) {
        // Manejar errores de la solicitud fetch
        console.error('Error en la solicitud:', error)
        showSnackbar('Error al comunicarse con el servidor.', 'error')
      } finally {
        setDeleteImgLoading(false)
      }
    } else {
      try {
        await deleteImg({ id, img })
        showSnackbar('Se ha eliminado la imagen con éxito.', 'success')
        await getWorkImages()
      } catch (error) {
        console.error(error)
      } finally {
        setDeleteImgLoading(false)
      }
    }
  }

  const deleteImg = async ({ id, img }) => {
    return await fetch('/api/work-images', {
      method: 'DELETE',
      body: JSON.stringify({
        'img-id': id,
        slug: work.slug,
        'file-name': img,
      }),
    })
  }

  useEffect(() => {
    getTableData()
  }, [])

  useEffect(() => {
    if (work.id) {
      getWorkImages(work.id)
    }
  }, [work.id])

  const handleSubmit = async () => {
    if (work.status === WORK_STATUS_ACTIVE && workImages.length === 0) {
      return showSnackbar(
        'Si el estado es activo, debes subir al menos 1 imagen.',
        'error'
      )
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/work/edit', {
        method: 'POST',
        body: JSON.stringify({
          work,
          images: workImages,
        }),
      })
      await res.json()
      router.push('/dashboard')
      showSnackbar('Work editado exitosamente.', 'success')
    } catch (error) {
      showSnackbar('Hubo un error, intente más tarde.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = e => {
    setWork({ ...work, name: e.target.value })
  }

  return {
    statusColorMap,
    getTableData,
    getWorkImages,
    handleNameChange,
    handleDeleteImg,
    isActive,
    handleSubmit,
    files,
    setFiles,
    work,
    setWork,
    setWorkImages,
    setIsActive,
    deleteImgLoading,
    setDeleteImgLoading,
    sortableContainerRef,
    workImages,
    isLoading,
  }
}

export default useEditWork
