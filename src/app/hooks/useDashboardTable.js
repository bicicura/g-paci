import { User, Chip, getKeyValue, Tooltip, useDisclosure, Link } from '@nextui-org/react'
import { useCallback, useState, useEffect } from 'react'
import supabase from '../../../utils/supabaseClient'
import { EditIcon } from '../components/Dashboard/EditIcon'
import { DeleteIcon } from '../components/Dashboard/DeleteIcon'
import NextLink from 'next/link'
import { useSnackbar } from '../contexts/SnackbarContext'
import { WORK_STATUS_ACTIVE, WORK_STATUS_INACTIVE } from '../../../constants'

const useDashboardTable = () => {
  const [filterValue, setFilterValue] = useState('')
  const [tableData, setTableData] = useState([])
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedWork, setSelectedWork] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showSnackbar } = useSnackbar()

  const [originalData, setOriginalData] = useState([])

  const statusColorMap = {
    [WORK_STATUS_ACTIVE]: 'success',
    paused: 'danger',
    [WORK_STATUS_INACTIVE]: 'warning',
  }

  const onDeleteButton = work => {
    setSelectedWork(work)
    onOpen()
  }

  const handleDeleteWork = async ({ onClose }) => {
    setIsLoading(true)
    onClose()
    const url = new URL('api/work', window.location.href)
    url.searchParams.append('slug', selectedWork.slug)
    url.searchParams.append('workId', selectedWork.id)

    try {
      await fetch(url, {
        method: 'DELETE',
      })
      showSnackbar('Work eliminado exitosamente.', 'success')
      try {
        await getTableData()
      } catch (error) {
        showSnackbar(
          'Se ha eliminado el work, pero hubo un error al refrescar la tabla.',
          'error'
        )
      }
    } catch (error) {
      // show error message
      showSnackbar('Hubo un error, intente más tarde.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const getImageCount = async workId => {
    let { data, error } = await supabase
      .from('works_images')
      .select('id', { count: 'exact' })
      .eq('work_id', workId)

    if (error) {
      console.error('Error fetching image count:', error)
      showSnackbar('Hubo un error, al obtener la cantidad de imagenes.', 'error')
      return 0 // return 0 if there's an error
    }

    return data.length // this will return the count of images for the given work_id
  }

  async function getTableData() {
    try {
      setIsLoading(true)

      const { data, error } = await supabase.from('works').select(`
        *,
        works_images (id,img)
        .order(orden, { foreignTable: 'works_images', ascending: true })
        .limit(1, { foreignTable: 'works_images' })
      `)

      if (error) {
        showSnackbar(
          'Hubo un error al obtener los registros, intente más tarde.',
          'error'
        )
        throw error
      }

      data.sort((a, b) => (a.created_at > b.created_at ? -1 : 1))

      // sort the data, put the one with slug 'overview' first
      const overviewIndex = data.findIndex(item => item.slug === 'overview')

      if (overviewIndex) {
        const overview = data[overviewIndex]
        data.splice(overviewIndex, 1)
        data.unshift(overview)
      }

      const promises = data.map(async item => {
        const imagesCount = await getImageCount(item.id)
        return {
          id: item.id,
          name: item.name,
          status: item.status,
          slug: item.slug,
          avatar: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item?.slug}/${item?.works_images[0]?.img}`,
          images_count: imagesCount, // use the dynamic count from getImageCount
        }
      })

      const newData = await Promise.all(promises)

      setTableData(newData)
      setOriginalData(newData) // Guardar los datos originales
    } catch (error) {
      console.error('Error getting table data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (filterValue) {
      const filteredData = originalData.filter(work =>
        work.name.toLowerCase().includes(filterValue.toLowerCase())
      )
      setTableData(filteredData)
    } else {
      setTableData(originalData)
    }
  }, [filterValue, originalData])

  useEffect(() => {
    getTableData()
  }, [])

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{
              radius: 'sm',
              src: user.avatar,
              size: 'lg',
            }}
            name={cellValue}
          />
        )
      case 'role':
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize text-bold">{cellValue}</p>
          </div>
        )
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        )
      case 'actions':
        return (
          <div className="relative flex items-center gap-4 text-black">
            <Tooltip
              className="text-black"
              content="Edit"
            >
              <Link
                href={`/dashboard/edit/${user.slug}`}
                as={NextLink}
              >
                <span className="text-lg cursor-pointer active:opacity-50">
                  <EditIcon />
                </span>
              </Link>
            </Tooltip>

            <Tooltip
              color="danger"
              content="Delete"
            >
              <button onClick={() => onDeleteButton(user)}>
                <span className="text-lg cursor-pointer text-danger active:opacity-50">
                  <DeleteIcon />
                </span>
              </button>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return {
    handleDeleteWork,
    setSelectedWork,
    setFilterValue,
    selectedWork,
    onOpenChange,
    filterValue,
    renderCell,
    isLoading,
    tableData,
    isOpen,
  }
}

export default useDashboardTable
