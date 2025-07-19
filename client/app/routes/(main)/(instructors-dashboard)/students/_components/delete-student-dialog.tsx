import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import useDeleteStudent from '~/hooks/students/use-delete-student'
import { toast } from 'sonner'
import handleHttpError from '~/lib/utils'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  openDelete: boolean
  setOpenDelete: (value: boolean) => void
  phone: string
}

function DeleteStudentDialog({ setOpenDelete, openDelete, phone }: Props) {
  const queryClient = useQueryClient()
  const message = `delete ${phone}`

  const [value, setValue] = useState('')

  const { mutateAsync: deleteStudent, isPending } = useDeleteStudent()

  const handleDeleteStudent = async () => {
    const res = await deleteStudent(phone)
    if (res.success) {
      toast.success('Student deleted successfully')
      setOpenDelete(false)
      queryClient.invalidateQueries({ queryKey: ['students'] })
      return
    }
    handleHttpError(res)
  }

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-1'>Delete Student</DialogTitle>
          <DialogDescription>
            <div>
              Type &quot;<strong>{message}</strong>&quot; to confirm
            </div>
            <Input value={value} onChange={(e) => setValue(e.target.value)} className='mt-2' />
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center gap-4'>
          <Button
            className='flex-1'
            onClick={() => {
              setOpenDelete(false)
            }}
            variant='secondary'
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteStudent} disabled={value !== message || isPending} className='flex-1'>
            Delete
            {isPending && <Loader2 className='ml-2 size-4 animate-spin' />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteStudentDialog
