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
import { Textarea } from '~/components/ui/textarea'
import useAssignLesson, { assignLessonSchema, type TAssignLessonSchema } from '~/hooks/lessons/use-assign-lesson'

import handleHttpError from '~/lib/utils'

type Props = {
  studentPhone: string
  openAssign: boolean
  setOpenAssign: (value: boolean) => void
}

function AssignLessonDialog({ studentPhone, openAssign, setOpenAssign }: Props) {
  const queryClient = useQueryClient()

  const { mutateAsync: assignLesson, isPending } = useAssignLesson()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenAssign(value)
  }

  const form = useForm<TAssignLessonSchema>({
    resolver: zodResolver(assignLessonSchema),
    defaultValues: {
      title: '',
      description: '',
      studentPhones: [{ phone: studentPhone }]
    }
  })

  const onSubmit = async (values: TAssignLessonSchema) => {
    const res = await assignLesson(values)

    if (res.success) {
      toast.success('Lesson assigned successfully')
      setOpenAssign(false)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      form.reset()
      return
    }

    handleHttpError(res, form)
  }

  return (
    <Dialog open={openAssign} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Lesson</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-6'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem className='flex flex-col items-start'>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='flex flex-col items-start'>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea disabled={isPending} {...field} />
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
                    Assign
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

export default AssignLessonDialog
