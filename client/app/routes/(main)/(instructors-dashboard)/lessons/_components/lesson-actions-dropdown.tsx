import { Eye, MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import type { Lesson } from '~/types/models'
import LessonStudentsDialog from './lesson-students-dialog'

type Props = {
  lesson: Lesson
}

function LessonActionsDropdown({ lesson }: Props) {
  const [openLessons, setOpenLessons] = useState(false)

  return (
    <>
      <LessonStudentsDialog id={lesson.id} open={openLessons} setOpen={setOpenLessons} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='border-2'>
          <DropdownMenuItem className='cursor-pointer'>
            <div onClick={() => setOpenLessons(true)} className='flex items-center gap-x-2'>
              <Eye className='size-4' />
              Students
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default LessonActionsDropdown
