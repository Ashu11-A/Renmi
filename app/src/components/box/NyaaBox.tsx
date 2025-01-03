import { useQuery } from '@tanstack/react-query'
import { fetch } from '@tauri-apps/plugin-http'
import { AnimeListData, AnimeTorrentData } from 'nyaa'
import { useMemo } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const fallbackData: AnimeTorrentData[] = []

export function NyaaBox ({ animeName, anilistId }: { animeName: string, anilistId: number }) {
  const { data: nyaa } = useQuery({
    queryKey: ['nyaa', anilistId],
    queryFn: async () => {
      const request = await fetch('http://localhost:4000/nyaa.si/search', {
        method: 'POST',
        body: JSON.stringify({ name: animeName }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        
      const content = await request.json()
      return (content as { data: AnimeListData }).data
    }
  })

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header() {
        return <div className='text-start'>Titulo</div>
      },
    },
    {
      accessorKey: 'size',
      header() {
        return <div className='text-center'>Tamanho</div>
      },
    },
    {
      accessorKey: 'date',
      header() {
        return <div className='text-center'>Data</div>
      },
    },
    {
      accessorKey: 'seeders',
      header() {
        return <div className='text-center'>Semeadores</div>
      },
    },
    {
      accessorKey: 'leechers',
      header() {
        return <div className='text-center'>Sonegadores</div>
      },
    },
    {
      accessorKey: 'downloads',
      header() {
        return <div className='text-center'>Downloads</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
    },
  ] satisfies ColumnDef<AnimeListData['data'][number]>[], [])

  const table = useReactTable({
    data: nyaa?.data ?? fallbackData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <div>
      <Table>
        <TableHeader>
          {table
            .getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))
          }

        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ): (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center'
              >
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}