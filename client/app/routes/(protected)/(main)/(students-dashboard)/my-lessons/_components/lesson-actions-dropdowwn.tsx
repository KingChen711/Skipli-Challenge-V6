import { useQueryClient } from '@tanstack/react-query'
import { Check, Loader2, MoreHorizontalIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import useMarkLessonDone from '~/hooks/lessons/use-mark-lesson-done'
import handleHttpError from '~/lib/utils'
import { EStudentLessonStatus, type Lesson } from '~/types/models'

type Props = {
  lesson: Lesson
  status: EStudentLessonStatus
}

function LessonActionsDropdown({ lesson, status }: Props) {
  const queryClient = useQueryClient()
  const { mutateAsync: markLessonDone, isPending } = useMarkLessonDone()

  const handleMarkLessonDone = async () => {
    const res = await markLessonDone(lesson.id)
    if (!res.success) {
      handleHttpError(res)
      return
    }
    queryClient.invalidateQueries({ queryKey: ['my-lessons'] })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='border-2'>
          {status === EStudentLessonStatus.PENDING && (
            <DropdownMenuItem className='cursor-pointer' disabled={isPending} onClick={handleMarkLessonDone}>
              <div className='flex items-center gap-x-2'>
                <Check className='size-4' />
                Mark as done {isPending && <Loader2 className='size-4 animate-spin' />}
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default LessonActionsDropdown
