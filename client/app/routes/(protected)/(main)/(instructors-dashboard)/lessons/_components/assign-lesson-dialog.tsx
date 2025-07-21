import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import useAssignLesson, { assignLessonSchema, type TAssignLessonSchema } from '~/hooks/lessons/use-assign-lesson'

import handleHttpError from '~/lib/utils'

function AssignLessonDialog() {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutateAsync: assignLesson, isPending } = useAssignLesson()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TAssignLessonSchema>({
    resolver: zodResolver(assignLessonSchema),
    defaultValues: {
      title: '',
      description: '',
      studentPhones: [{ phone: '' }]
    }
  })

  const {
    fields: studentPhoneFields,
    append: appendStudentPhone,
    remove: removeStudentPhone
  } = useFieldArray({
    control: form.control,
    name: 'studentPhones'
  })

  const studentPhonesValues = form.watch('studentPhones')

  useEffect(() => {
    console.log({ studentPhonesValues })
  }, [studentPhonesValues])

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])

  const onSubmit = async (values: TAssignLessonSchema) => {
    const res = await assignLesson(values)

    if (res.success) {
      toast.success('Lesson assigned successfully')
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      form.reset()
      return
    }

    handleHttpError(res, form)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='flex items-center justify-end gap-x-1 leading-none'>
          <Plus />
          <div>Assign Lesson</div>
        </Button>
      </DialogTrigger>

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

                <FormField
                  control={form.control}
                  name='studentPhones'
                  render={() => (
                    <FormItem className='flex flex-col items-start'>
                      <div className='flex items-center justify-between gap-4 w-full'>
                        <FormLabel>Student Phones</FormLabel>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            appendStudentPhone({ phone: '' })
                          }}
                        >
                          <Plus /> Add phone
                        </Button>
                      </div>
                      <FormControl>
                        <div className='flex flex-col gap-y-2 w-full'>
                          {studentPhoneFields.map((field, index) => (
                            <FormField
                              key={field.id}
                              control={form.control}
                              name={`studentPhones.${index}.phone`}
                              render={({ field }) => (
                                <FormItem className='flex-1'>
                                  <div className='flex items-center gap-2'>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type='tel'
                                        className='flex-1'
                                        disabled={isPending}
                                        placeholder='Enter phone number'
                                      />
                                    </FormControl>
                                    {studentPhoneFields.length > 1 && (
                                      <Button
                                        variant='outline'
                                        size='icon'
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          removeStudentPhone(index)
                                        }}
                                      >
                                        <Trash2Icon />
                                      </Button>
                                    )}
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
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
