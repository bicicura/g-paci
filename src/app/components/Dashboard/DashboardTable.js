'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
  Button,
  Input,
} from '@nextui-org/react'
import { EditIcon } from './EditIcon'
import { DeleteIcon } from './DeleteIcon'
import { EyeIcon } from './EyeIcon'
import { columns, users } from './data'
import { useCallback, useState } from 'react'
import { PlusIcon } from './PlusIcon'
import { SearchIcon } from './SearchIcon'
import Link from 'next/link'

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
}

export default function DashboardTable() {
  const [filterValue, setFilterValue] = useState('')

  const onSearchChange = useCallback(value => {
    if (value) {
      setFilterValue(value)
      // setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        )
      case 'role':
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize text-bold">{cellValue}</p>
            <p className="text-sm capitalize text-bold text-default-400">{user.team}</p>
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
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip
              color="danger"
              content="Delete user"
            >
              <span className="text-lg cursor-pointer text-danger active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <>
      {' '}
      <div className="flex justify-between mt-20 mb-4">
        <Input
          isClearable
          classNames={{
            base: 'w-full sm:max-w-[44%]',
            inputWrapper: 'border-1',
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue('')}
          onValueChange={onSearchChange}
        />
        <Link href={'/proyectos/create'}>
          <Button
            className="bg-foreground text-background"
            endContent={<PlusIcon />}
            size="sm"
          >
            Add New
          </Button>
        </Link>
      </div>
      <Table aria-label="Example table with custom cells">
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
        <TableBody items={users}>
          {item => (
            <TableRow key={item.id}>
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
