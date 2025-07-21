import { useState } from 'react'
import RoleBadge from '~/components/ui/badges/role-badge'
import LessonStatusBadge from '~/components/ui/badges/student-lesson-status-badge'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import NoResult from '~/components/ui/no-result'
import Paginator from '~/components/ui/paginator'
import SkeletonTable from '~/components/ui/skeleton-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import useLessonStudents from '~/hooks/lessons/use-lesson-students'

type Props = {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}

function LessonStudentsDialog({ id, open, setOpen }: Props) {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<'5' | '10' | '30' | '50' | '100'>('5')

  const { data, isPending } = useLessonStudents(
    id,
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
          <DialogTitle>Students</DialogTitle>
          <DialogDescription asChild>
            <>
              {isPending && <SkeletonTable />}

              {!isPending && data?.items?.length === 0 ? (
                <div className='flex justify-center p-4'>
                  <NoResult
                    title='Students Not Found'
                    description='No students matching your request were found Please check your information or try searching with different criteria'
                  />
                </div>
              ) : null}

              {!isPending && data?.items && data?.items?.length > 0 ? (
                <div className='mt-4 grid w-full'>
                  <div className='overflow-x-auto rounded-md border'>
                    <Table className='overflow-hidden'>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead position='center'>Role</TableHead>
                          <TableHead position='center'>Lesson Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.items.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.name || '-'}</TableCell>
                            <TableCell>{student.phone || '-'}</TableCell>
                            <TableCell>{student.email || '-'}</TableCell>
                            <TableCell>{student.username || '-'}</TableCell>
                            <TableCell position='center'>
                              <RoleBadge status={student.role} />
                            </TableCell>
                            <TableCell position='center'>
                              <LessonStatusBadge status={student.status} />
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

export default LessonStudentsDialog
