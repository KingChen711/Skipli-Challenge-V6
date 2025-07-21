import { useState } from 'react'
import LessonStatusBadge from '~/components/ui/badges/student-lesson-status-badge'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import NoResult from '~/components/ui/no-result'
import Paginator from '~/components/ui/paginator'
import SkeletonTable from '~/components/ui/skeleton-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import useStudentLessons from '~/hooks/students/use-student-lessons'

type Props = {
  phone: string
  open: boolean
  setOpen: (open: boolean) => void
}

function StudentLessonsDialog({ phone, open, setOpen }: Props) {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<'5' | '10' | '30' | '50' | '100'>('5')

  const { data, isPending } = useStudentLessons(
    phone,
    {
      pageIndex,
      pageSize
    },
    open
  )

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: '5' | '10' | '30' | '50' | '100') => {
    setPageSize(size)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='!max-w-4xl !w-full max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Student Lessons</DialogTitle>
          <DialogDescription asChild>
            <>
              {isPending && <SkeletonTable />}

              {!isPending && data?.items?.length === 0 ? (
                <div className='flex justify-center p-4'>
                  <NoResult
                    title='Lessons Not Found'
                    description='No lessons matching your request were found Please check your information or try searching with different criteria'
                  />
                </div>
              ) : null}

              {!isPending && data?.items && data?.items?.length > 0 ? (
                <div className='mt-4 grid w-full'>
                  <div className='overflow-x-auto rounded-md border'>
                    <Table className='overflow-hidden'>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead position='center'>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.items.map((lesson) => (
                          <TableRow key={lesson.id}>
                            <TableCell>{lesson.title || '-'}</TableCell>
                            <TableCell cellClassName='text-wrap line-clamp-3'>{lesson.description || '-'}</TableCell>
                            <TableCell position='center'>
                              <LessonStatusBadge status={lesson.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Paginator
                    pageSize={+pageSize}
                    pageIndex={pageIndex}
                    totalPages={data.totalPages}
                    totalCount={data.totalCount}
                    className='mt-6'
                    onPaginate={handlePaginate}
                    onChangePageSize={handleChangePageSize}
                  />
                </div>
              ) : null}
            </>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default StudentLessonsDialog
