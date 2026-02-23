'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';

type CustomColumnDef<TData> = ColumnDef<TData, unknown> & {
  meta?: {
    className?: string;
  };
};

interface DataTableProps<TData> {
  data: TData[];
  columns: CustomColumnDef<TData>[];
  isLenghtNill: boolean;
  isLoadingData: boolean;
  isErrorData: boolean;
  errorMessage: string;
  minLengthSkeleton: number;
}

export function DataTable<TData>({
  data,
  columns,
  isLenghtNill,
  isLoadingData,
  isErrorData,
  errorMessage,
  minLengthSkeleton,
}: Readonly<DataTableProps<TData>>) {
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const skeletonRows = Array.from({ length: minLengthSkeleton });

  return (
    <div className="rounded overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup, index) => (
            <tr key={`${headerGroup.id}-${index}`} className="relative w-full">
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  className={`py-3 px-4 bg-zinc-900 text-zinc-300 text-left text-sm leading-6 ${
                    index === 0
                      ? 'sticky left-0 z-10 bg-zinc-900 text-zinc-300 text-sm leading-6 lg:shadow-none shadow-[20px_0px_25px_-5px_rgba(234,234,234,0.10),_10px_0px_10px_-5px_rgba(255,255,255,0.04)] sm:max-w-[118px] md:max-w-[101px]'
                      : 'sm:max-w-[98px] md:max-w-[130px]'
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {(() => {
            const showEmpty = (!isLoadingData || !isErrorData) && isLenghtNill;
            if (isLoadingData || isErrorData || isLenghtNill) {
              if (showEmpty) {
                return (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center h-[76px] text-zinc-300"
                    >
                      {errorMessage}
                    </td>
                  </tr>
                );
              } else {
                return skeletonRows.map((_, rowIndex) => {
                  // Generate a unique key for each skeleton row
                  const rowKey = `skeleton-row-${rowIndex}-${Math.random().toString(36).slice(2, 11)}`;
                  return (
                    <tr key={rowKey} className="h-[76px] border-b border-b-zinc-800">
                      {columns.map((col, colIndex) => {
                        // Generate a unique key for each skeleton cell
                        const colKey = `skeleton-cell-${col.id || colIndex}-${rowKey}`;
                        return (
                          <td
                            key={colKey}
                            className={`py-3 px-4 ${colIndex === 0 ? 'sticky left-0 z-10' : ''}`}
                          >
                            {colIndex === 6 ? (
                              <div className="flex space-x-2">
                                <Skeleton className={`rounded size-8 bg-zinc-800`} />
                                <Skeleton className={`rounded size-8 bg-zinc-800`} />
                              </div>
                            ) : (
                              <Skeleton
                                className={`h-4 w-full bg-zinc-800 ${colIndex === 1 ? 'h-12 w-12 object-cover rounded' : ''}`}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                });
              }
            } else {
              return table.getRowModel().rows.map((row, index) => (
                <tr
                  key={`${row.id}-${index}`}
                  className="h-[76px] border-b border-b-zinc-800"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      className={`py-3 px-4 
                          ${index === 0 ? 'sticky left-0 z-10 bg-zinc-900 border-r border-zinc-800 lg:bg-transparent lg:border-none lg:shadow-none shadow-[20px_0px_25px_-5px_rgba(234,234,234,0.10),_10px_0px_10px_-5px_rgba(255,255,255,0.04)]' : ''}
                          ${index === 5 && '[&>span]:w-[10ch] [&>span]:flex'}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ));
            }
          })()}
        </tbody>
      </table>
    </div>
  );
}
