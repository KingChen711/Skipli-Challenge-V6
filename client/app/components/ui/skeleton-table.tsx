import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Skeleton } from './skeleton'

export default function SkeletonTable() {
  return (
    <div className='mb-6 mt-4 grid w-full rounded-md border'>
      <div className='overflow-x-auto rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className='flex justify-center'>
                  <Skeleton className='h-4 w-9 rounded'></Skeleton>
                </div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center'>
                  <Skeleton className='h-4 w-9 rounded'></Skeleton>
                </div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center'>
                  <Skeleton className='h-4 w-9 rounded'></Skeleton>
                </div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center'>
                  <Skeleton className='h-4 w-9 rounded'></Skeleton>
                </div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center'>
                  <Skeleton className='h-4 w-9 rounded'></Skeleton>
                </div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center'>
                  <Skeleton className='h-4 w-9 rounded'></Skeleton>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-4 w-9 rounded'></Skeleton>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <Skeleton className='h-4 w-9 rounded'></Skeleton>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <Skeleton className='h-4 w-9 rounded'></Skeleton>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <Skeleton className='h-4 w-9 rounded'></Skeleton>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <Skeleton className='h-4 w-9 rounded'></Skeleton>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <Skeleton className='h-4 w-9 rounded'></Skeleton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
