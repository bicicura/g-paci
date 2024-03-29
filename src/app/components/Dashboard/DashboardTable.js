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
  } = useDashboardTable()

  return (
    <>
      <section className="">
        {' '}
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
                align={column.uid === 'actions' ? 'center' : 'start'}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            className="w-full"
            items={tableData}
            isLoading={isLoading}
            loadingContent={
              <div className="z-10 flex items-center justify-center w-full h-full bg-default-200">
                <Spinner
                  label="Loading..."
                  color="primary"
                />{' '}
              </div>
            }
          >
            {item => (
              <TableRow
                style={{ marginBottom: 'auto' }}
                className="text-black"
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
