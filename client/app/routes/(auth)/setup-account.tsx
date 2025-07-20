import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import useCompleteSetupAccount, {
  completeSetupSchema,
  type TCompleteSetupAccountSchema
} from '~/hooks/auth/use-complete-setup-account'
import useVerifySetupToken from '~/hooks/auth/use-verify-setup-token'
import handleHttpError from '~/lib/utils'

function SetupAccount() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const { data, isPending } = useVerifySetupToken(token)

  const { mutateAsync: completeSetupAccount, isPending: isCompletingSetupAccount } = useCompleteSetupAccount()

  const form = useForm<TCompleteSetupAccountSchema>({
    resolver: zodResolver(completeSetupSchema),
    defaultValues: {
      token: token || '', //the token will not null when submit form because already checked
      username: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (values: TCompleteSetupAccountSchema) => {
    const res = await completeSetupAccount(values)

    if (res.success) {
      toast.success('Account setup completed')
      navigate('/login', { replace: true })
      return
    }
    handleHttpError(res, form)
  }

  if (!token) {
    return <Navigate to='/404' replace />
  }

  if (!data) {
    return <Navigate to='/404' replace />
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Setup Account</CardTitle>
          <CardDescription>
            {isPending ? (
              <Skeleton className='h-4 w-full' />
            ) : (
              <>
                Hi <strong>{data.name}</strong>, please enter username and password to complete account setup
              </>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={isCompletingSetupAccount}>
                Continue {isCompletingSetupAccount && <Loader2 className='h-4 w-4 animate-spin' />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetupAccount
