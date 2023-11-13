import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import supabase from '../../../utils/supabaseClient'
import Sortable from 'sortablejs'
import { useRouter } from 'next/navigation'

const useEditWork = () => {
  const pathname = usePathname()
  const [files, setFiles] = useState([])
  const [work, setWork] = useState({ name: '', status: '', slug: '', id: null })
  const [isActive, setIsActive] = useState(false)
  const [workImages, setWorkImages] = useState([])
  const sortableContainerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const statusColorMap = {
    active: 'success',
    paused: 'danger',
    inactive: 'warning',
  }

  useEffect(() => {
    if (sortableContainerRef.current) {
      new Sortable(sortableContainerRef.current, {
        animation: 150,
        onEnd: function () {
          // Obtener los hijos del contenedor ordenable
          const orderedNodes = sortableContainerRef.current.children
          // Crear un array basado en esos hijos
          const orderedIds = Array.from(orderedNodes).map(node => node.dataset.id)

          // Actualizar la propiedad 'order' de cada elemento en workImages
          const updatedWorkImages = workImages.map(image => {
            const newOrder = orderedIds.indexOf(image.id.toString())
            return { ...image, order: newOrder }
          })

          // Actualizar el estado con las imágenes actualizadas
          setWorkImages(updatedWorkImages)
        },
      })
    }
  }, [workImages]) // Asegúrate de incluir las dependencias necesarias aquí

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
        .order('order', { ascending: true })

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/work/edit', {
        method: 'POST',
        body: JSON.stringify({
          work,
          images: workImages,
        }),
      })
      const data = await res.json()
      console.log(data)

      router.push('/dashboard')
    } catch (error) {
      console.error('Error during the upload process:', error)
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
    setIsActive,
    sortableContainerRef,
    workImages,
    isLoading,
  }
}

export default useEditWork
