import { Eye, MoreHorizontalIcon, PencilIcon, Plus, Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import type { User } from '~/types/models'
import EditStudentDialog from './edit-student-dialog'
import DeleteStudentDialog from './delete-student-dialog'
import AssignLessonDialog from './assign-lesson-dialog'
import StudentLessonsDialog from './student-lessons-dialog'

type Props = {
  student: User
}

function StudentActionsDropdown({ student }: Props) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openLessons, setOpenLessons] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openAssign, setOpenAssign] = useState(false)

  return (
    <>
      <StudentLessonsDialog phone={student.phone} open={openLessons} setOpen={setOpenLessons} />
      <EditStudentDialog student={student} openEdit={openEdit} setOpenEdit={setOpenEdit} />
      <DeleteStudentDialog phone={student.phone} openDelete={openDelete} setOpenDelete={setOpenDelete} />
      <AssignLessonDialog studentPhone={student.phone} openAssign={openAssign} setOpenAssign={setOpenAssign} />
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
              Student lessons
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer'>
            <div onClick={() => setOpenAssign(true)} className='flex items-center gap-x-2'>
              <Plus className='size-4' />
              Assign lesson
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className='cursor-pointer'>
            <div onClick={() => setOpenEdit(true)} className='flex items-center gap-x-2'>
              <PencilIcon className='size-4' />
              Edit student
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className='cursor-pointer' asChild>
            <div
              onClick={() => setOpenDelete(true)}
              className='flex cursor-pointer items-center gap-x-2 rounded-sm px-2 py-[6px] text-sm leading-5 hover:bg-muted'
            >
              <Trash2Icon className='size-4' />
              Delete student
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default StudentActionsDropdown
