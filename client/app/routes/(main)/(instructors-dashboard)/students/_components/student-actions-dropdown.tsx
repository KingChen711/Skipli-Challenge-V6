import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import type { User } from '~/types/models'
import EditStudentDialog from './edit-student-dialog'
import DeleteStudentDialog from './delete-student-dialog'

type Props = {
  student: User
}

function StudentActionsDropdown({ student }: Props) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  return (
    <>
      <EditStudentDialog student={student} openEdit={openEdit} setOpenEdit={setOpenEdit} />
      <DeleteStudentDialog phone={student.phone} openDelete={openDelete} setOpenDelete={setOpenDelete} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='border-2'>
          <DropdownMenuItem className='cursor-pointer'>
            <div onClick={() => setOpenEdit(true)} className='flex items-center gap-x-2'>
              <PencilIcon className='size-4' />
              Edit
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className='cursor-pointer' asChild>
            <div
              onClick={() => setOpenDelete(true)}
              className='flex cursor-pointer items-center gap-x-2 rounded-sm px-2 py-[6px] text-sm leading-5 hover:bg-muted'
            >
              <Trash2Icon className='size-4' />
              Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default StudentActionsDropdown
