import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

import useEditStudent, { editStudentSchema, type TEditStudentSchema } from '~/hooks/students/use-edit-student'
import handleHttpError from '~/lib/utils'
import type { User } from '~/types/models'

type Props = {
  student: User
  openEdit: boolean
  setOpenEdit: (value: boolean) => void
}

function EditStudentDialog({ student, openEdit, setOpenEdit }: Props) {
  const queryClient = useQueryClient()
  const { isPending, mutateAsync: editStudent } = useEditStudent()
  const handleOpenChange = (value: boolean) => {
    if (isPending) return

    setOpenEdit(value)
  }

  const form = useForm<TEditStudentSchema>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      phone: student.phone,
      name: student.name,
      email: student.email,
      username: student.username
    }
  })

  const onSubmit = async (values: TEditStudentSchema) => {
    const res = await editStudent({ ...values, oldPhone: student.phone })
    if (res.success) {
      toast.success('Student updated successfully')
      setOpenEdit(false)
      queryClient.invalidateQueries({ queryKey: ['students'] })
      return
    }
    handleHttpError(res, form)
  }

  return (
    <Dialog open={openEdit} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit student</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='flex flex-col items-start'>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem className='flex flex-col items-start'>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='flex flex-col items-start'>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem className='flex flex-col items-start'>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end gap-x-4'>
                  <DialogClose asChild>
                    <Button disabled={isPending} variant='secondary' className='float-right mt-4'>
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button disabled={isPending} type='submit' className='float-right mt-4'>
                    Save
                    {isPending && <Loader2 className='ml-1 size-4 animate-spin' />}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditStudentDialog
