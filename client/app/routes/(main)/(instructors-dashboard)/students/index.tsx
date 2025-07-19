import { useSearchParams } from 'react-router'
import NoResult from '~/components/ui/no-result'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import useStudents from '~/hooks/students/use-students'
import z from 'zod'
import Paginator from '~/components/ui/paginator'
import RoleBadge from '~/components/ui/role-badge'

import SkeletonTable from '~/components/ui/skeleton-table'
import AddStudentDialog from './_components/add-student-dialog'
import StudentActionsDropdown from './_components/student-actions-dropdown'

export const searchStudentsSchema = z.object({
  // search: z.string().catch(''),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(['5', '10', '30', '50', '100']).catch('10')
})

export type TSearchStudentsSchema = z.infer<typeof searchStudentsSchema>

function Students() {
  const [searchParams] = useSearchParams()

  const { pageIndex, pageSize, ...rest } = searchStudentsSchema.parse(Object.fromEntries(searchParams.entries()))

  const { data, isPending } = useStudents({
    pageIndex,
    pageSize,
    ...rest
  })

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4'>
        <h3 className='text-2xl font-semibold'>Students</h3>
        <AddStudentDialog />
      </div>

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
                  <TableHead>Role</TableHead>
                  <TableHead position='center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name || '-'}</TableCell>
                    <TableCell>{student.phone || '-'}</TableCell>
                    <TableCell>{student.email || '-'}</TableCell>
                    <TableCell>{student.username || '-'}</TableCell>
                    <TableCell>
                      <RoleBadge status={student.role} />
                    </TableCell>
                    <TableCell position='center'>
                      <StudentActionsDropdown student={student} />
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
          />
        </div>
      ) : null}
    </div>
  )
}

export default Students
