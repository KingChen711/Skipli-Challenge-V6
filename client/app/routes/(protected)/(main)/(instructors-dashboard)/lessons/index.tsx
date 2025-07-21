import { useSearchParams } from 'react-router'
import z from 'zod'
import NoResult from '~/components/ui/no-result'
import Paginator from '~/components/ui/paginator'
import SkeletonTable from '~/components/ui/skeleton-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import useLessons from '~/hooks/lessons/use-lessons'
import AssignLessonDialog from './_components/assign-lesson-dialog'
import LessonActionsDropdown from './_components/lesson-actions-dropdown'

export const searchLessonsSchema = z.object({
  // search: z.string().catch(''),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(['5', '10', '30', '50', '100']).catch('10')
})

export type TSearchLessonsSchema = z.infer<typeof searchLessonsSchema>

function LessonsPage() {
  const [searchParams] = useSearchParams()

  const { pageIndex, pageSize, ...rest } = searchLessonsSchema.parse(Object.fromEntries(searchParams.entries()))

  const { data, isPending } = useLessons({
    pageIndex,
    pageSize,
    ...rest
  })

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4'>
        <h3 className='text-2xl font-semibold'>Lessons</h3>
        <AssignLessonDialog />
      </div>

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
                  <TableHead position='center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>{lesson.title || '-'}</TableCell>
                    <TableCell cellClassName='text-wrap line-clamp-3'>{lesson.description || '-'}</TableCell>
                    <TableCell position='center'>
                      <LessonActionsDropdown lesson={lesson} />
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

export default LessonsPage
