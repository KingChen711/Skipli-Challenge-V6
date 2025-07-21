import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useAuth } from '~/contexts/auth-provider'
import useEditProfile, { editProfileSchema, type TEditProfileSchema } from '~/hooks/students/use-edit-profile'

import handleHttpError from '~/lib/utils'

function MyProfile() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { isPending, mutateAsync: editProfile } = useEditProfile()

  const form = useForm<TEditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      phone: user?.phone || '',
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || ''
    }
  })

  useEffect(() => {
    if (!user) return
    form.reset({
      phone: user.phone,
      name: user.name,
      email: user.email,
      username: user.username
    })
  }, [user, form])

  const onSubmit = async (values: TEditProfileSchema) => {
    const res = await editProfile(values)
    if (res.success) {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['whoami'] })
      return
    }
    handleHttpError(res, form)
  }

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4'>
        <h3 className='text-2xl font-semibold'>My Profile</h3>
      </div>
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
            <Button disabled={isPending} type='submit' className='float-right mt-4'>
              Save
              {isPending && <Loader2 className='ml-1 size-4 animate-spin' />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default MyProfile
