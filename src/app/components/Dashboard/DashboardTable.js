'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Spinner,
} from '@nextui-org/react'
import useDashboardTable from '@/app/hooks/useDashboardTable'
import { columns } from './data'
import { PlusIcon } from './PlusIcon'
import { SearchIcon } from './SearchIcon'
import NextLink from 'next/link'
import { useEffect } from 'react'
import Sortable from 'sortablejs'
import { toast } from 'sonner'

export default function DashboardTable() {
  const {
    isOpen,
    tableData,
    isLoading,
    renderCell,
    filterValue,
    onOpenChange,
    setFilterValue,
    handleDeleteWork,
    setTableData,
  } = useDashboardTable()

  useEffect(() => {
    const tableBodyElement = document.querySelector('#my-table-body') // Asignado a la <TableBody>
    if (!isLoading && tableBodyElement) {
      const sortable = new Sortable(tableBodyElement, {
        animation: 150,
        handle: '.grab-handle', // Asegúrate de que tus filas tengan un área definida con esta clase para agarrarlas
        onEnd: async event => {
          const { oldIndex, newIndex } = event
          if (oldIndex !== newIndex) {
            // Crear una nueva copia de tableData con los elementos reordenados
            const newData = Array.from(tableData)
            newData.splice(newIndex, 0, newData.splice(oldIndex, 1)[0])

            // Actualizar la clave 'order' de cada elemento para reflejar su nueva posición
            newData.forEach((item, index) => {
              item.order = index // Asegúrate de que la propiedad 'order' es la correcta para almacenar el índice
            })

            // Actualiza el estado con los datos reordenados
            setTableData(newData)

            // Realizar la actualización en el servidor
            try {
              const response = await fetch('/api/work/update-order', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ works: newData }),
              })
              if (!response.ok) {
                throw new Error('Network response was not ok.')
              }
              const result = await response.json()
              toast.success('Works reordenados exitosamente.')
            } catch (error) {
              toast.error('No se pudo reordenar los Works, intente más tarde.')
              console.error('Error updating order:', error)
            }
          }
        },
      })

      return () => {
        sortable.destroy() // Limpieza al desmontar el componente
      }
    }
  }, [isLoading, tableData])

  return (
    <>
      <section className="">
        <div className="flex justify-between mb-4">
          <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%] text-black',
              inputWrapper: 'border-1',
            }}
            placeholder="Buscar por nombre"
            size="md"
            startContent={<SearchIcon className="text-gray-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue('')}
            onValueChange={value => setFilterValue(value)}
          />

          <Link
            className="flex gap-2 px-4 py-2 text-white transition-colors duration-200 ease-in-out bg-black rounded-lg shadow-sm transtion-colors hover:shadow-lg hover:bg-default-100 hover:text-black hover:underline"
            as={NextLink}
            href="/dashboard/create"
          >
            <span>Agregar</span>
            <PlusIcon />
          </Link>
        </div>
        <Table
          aria-label="Gastón Paci portfolio's table"
          style={{ minHeight: isLoading ? '300px' : '' }}
        >
          <TableHeader columns={columns}>
            {column => (
              <TableColumn
                key={column.uid}
                className={
                  column.uid === 'order' || column.uid === 'actions' ? 'text-center' : ''
                }
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            className="w-full"
            id="my-table-body"
            items={tableData}
            isLoading={isLoading}
            loadingContent={
              <div className="z-10 flex items-center justify-center w-full h-full bg-default-100">
                <Spinner
                  label="Loading..."
                  color="primary"
                />{' '}
              </div>
            }
          >
            {item => (
              <TableRow
                data-id={item.id}
                style={{ marginBottom: 'auto' }}
                className="text-black grab-handle"
                key={item.id}
              >
                {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="text-black">
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Estas por eliminar un registro.
              </ModalHeader>
              <ModalBody>
                <p>
                  Una vez eliminado el work, se procede a borrar todo su contenido. Estoy
                  incluye información e imágenes
                </p>
                <p className="text-sm font-bold">¿Estás segurx?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  disabled={isLoading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                  color="danger"
                  onClick={() => handleDeleteWork({ onClose })}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
