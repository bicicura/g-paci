'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Link,
  Chip,
  Tooltip,
  getKeyValue,
  Button,
  Input,
} from '@nextui-org/react'
import { EditIcon } from './EditIcon'
import { DeleteIcon } from './DeleteIcon'
import { columns } from './data'
import { useCallback, useState, useEffect } from 'react'
import { PlusIcon } from './PlusIcon'
import { SearchIcon } from './SearchIcon'
import NextLink from 'next/link'
import supabase from '../../../../utils/supabaseClient'

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  inactive: 'warning',
}

export default function DashboardTable() {
  const [filterValue, setFilterValue] = useState('')
  const [tableData, setTableData] = useState([])

  const onSearchChange = useCallback(value => {
    if (value) {
      setFilterValue(value)
      // setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  async function getTableData() {
    try {
      let { data, error } = await supabase.from('works').select()
      const newData = data.map(item => {
        return {
          id: item.id,
          name: item.name,
          status: item.status,
          slug: item.slug,
          avatar: `images/work/${item.slug}/slide-1.jpg`,
          images_count: 3,
        }
      })
      setTableData(newData)
    } catch (error) {
      console.log(error)
    }
  }

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
    <section className="">
      {' '}
      <div className="flex justify-between mb-4">
        <Input
          isClearable
          classNames={{
            base: 'w-full sm:max-w-[44%] text-black',
            inputWrapper: 'border-1',
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<SearchIcon className="text-gray-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue('')}
          onValueChange={onSearchChange}
        />

        <Link
          className="flex gap-2 px-4 py-2 text-white transition-colors duration-200 ease-in-out bg-black rounded-lg shadow-sm transtion-colors hover:shadow-lg hover:bg-default-100 hover:text-black hover:underline"
          as={NextLink}
          href="/dashboard/create"
        >
          <span>Add new</span>
          <PlusIcon />
        </Link>
      </div>
      <Table aria-label="Gastón Paci portfolio's table">
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
        <TableBody items={tableData}>
          {item => (
            <TableRow
              className="text-black"
              key={item.id}
            >
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
