import { ArrowLeft, Loader2, Lock, Mail, MessageSquare, Phone, Shield, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import useCheckExistAccount, {
  checkExistAccountSchema,
  type TCheckExistAccountSchema
} from '~/hooks/auth/use-check-exist-account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Badge } from '~/components/ui/badge'
import useAuthenticate, { authenticateSchema, type TAuthenticateSchema } from '~/hooks/auth/use-authenticate'
import { useAuth } from '~/contexts/auth-provider'
import useSendSMS from '~/hooks/auth/use-send-sms'
import useSendCode from '~/hooks/auth/use-send-code'
import { toast } from 'sonner'
import handleHttpError from '~/lib/utils'
import { ERole } from '~/types/models'
import { useNavigate } from 'react-router'

function Login() {
  const { setAccessToken } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [timeDisabledSendSMS, setTimeDisabledSendSMS] = useState(0)
  const [timeDisabledSendCode, setTimeDisabledSendCode] = useState(0)

  const { mutateAsync: checkExistAccount, isPending: isCheckingExistAccount } = useCheckExistAccount()
  const { mutateAsync: authenticate, isPending: isAuthenticating } = useAuthenticate()
  const { mutateAsync: sendSMS } = useSendSMS()
  const { mutateAsync: sendCode } = useSendCode()

  const checkAccountForm = useForm<TCheckExistAccountSchema>({
    resolver: zodResolver(checkExistAccountSchema),
    defaultValues: {
      type: 'email',
      identifier: ''
    }
  })

  const identifier = checkAccountForm.watch('identifier')
  const loginMethod = checkAccountForm.watch('type')

  const authenticateForm = useForm<TAuthenticateSchema>({
    resolver: zodResolver(authenticateSchema),
    defaultValues: {
      authType: 'password',
      authValue: ''
    }
  })

  const authType = authenticateForm.watch('authType')

  const onSubmitCheckAccountForm = async (values: TCheckExistAccountSchema) => {
    if (step === 1 && values.identifier.trim()) {
      const res = await checkExistAccount({
        type: values.type,
        identifier: values.identifier
      })
      if (!res.success) {
        handleHttpError(res, checkAccountForm)
        return
      }

      const exist = res.data
      if (exist) {
        setStep(2)
      } else {
        //the null(error) case will show toast error instead
        checkAccountForm.setError('identifier', { message: 'Account does not exist' })
      }
    }
  }

  const onSubmitAuthenticateForm = async (values: TAuthenticateSchema) => {
    if (step === 2 && values.authValue.trim()) {
      const res = await authenticate({
        type: loginMethod,
        identifier: identifier,
        authType: values.authType,
        authValue: values.authValue
      })
      if (res.success) {
        setAccessToken(res.data.accessToken)
        if (res.data.role === ERole.STUDENT) {
          navigate('/my-lessons')
        } else {
          navigate('/lessons')
        }
        return
      }
      handleHttpError(res, authenticateForm)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeDisabledSendSMS > 0) {
        setTimeDisabledSendSMS((prev) => prev - 1)
      }
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [timeDisabledSendSMS])

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeDisabledSendCode > 0) {
        setTimeDisabledSendCode((prev) => prev - 1)
      }
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [timeDisabledSendCode])

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex items-center justify-between mb-2'>
            {step === 2 && (
              <Button variant='ghost' size='sm' onClick={handleBack}>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            )}
            <div className='flex-1'>
              <Badge variant='secondary' className='text-xs'>
                Step {step} of 2
              </Badge>
            </div>
            {step === 2 && <div className='w-9'></div>}
          </div>
          <CardTitle className='text-2xl font-bold'>{step === 1 ? 'Sign In' : 'Verify Identity'}</CardTitle>
          <CardDescription>
            {step === 1 ? 'Choose your preferred login method' : 'Complete authentication to access your account'}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          {step === 1 && (
            <>
              <Tabs
                value={loginMethod}
                onValueChange={(value) => {
                  checkAccountForm.setValue('type', value as 'email' | 'phone' | 'username')
                  checkAccountForm.setValue('identifier', '')
                }}
              >
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='email' className='flex cursor-pointer items-center gap-1'>
                    <Mail className='h-3 w-3' />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value='phone' className='flex cursor-pointer items-center gap-1'>
                    <Phone className='h-3 w-3' />
                    Phone
                  </TabsTrigger>
                  <TabsTrigger value='username' className='flex cursor-pointer items-center gap-1'>
                    <User className='h-3 w-3' />
                    Username
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Form {...checkAccountForm}>
                <form onSubmit={checkAccountForm.handleSubmit(onSubmitCheckAccountForm)} className='space-y-8'>
                  <FormField
                    control={checkAccountForm.control}
                    name='identifier'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{loginMethod.charAt(0).toUpperCase() + loginMethod.slice(1)}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full' disabled={isCheckingExistAccount}>
                    Continue {isCheckingExistAccount && <Loader2 className='h-4 w-4 animate-spin' />}
                  </Button>
                </form>
              </Form>
            </>
          )}
          {step === 2 && (
            <>
              <div className='  p-3 rounded-lg'>
                <div className='flex items-center gap-2 text-sm  '>
                  {loginMethod === 'email' && <Mail className='h-4 w-4' />}
                  {loginMethod === 'phone' && <Phone className='h-4 w-4' />}
                  {loginMethod === 'username' && <User className='h-4 w-4' />}
                  <span className='font-medium'>{identifier}</span>
                </div>
              </div>

              <Tabs
                value={authType}
                onValueChange={(value) => {
                  authenticateForm.setValue('authType', value as 'password' | 'sms' | 'code')
                  authenticateForm.setValue('authValue', '')
                }}
              >
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='password' className='flex items-center gap-1'>
                    <Lock className='h-3 w-3' />
                    Password
                  </TabsTrigger>
                  <TabsTrigger value='sms' className='flex items-center gap-1'>
                    <MessageSquare className='h-3 w-3' />
                    SMS
                  </TabsTrigger>
                  <TabsTrigger value='code' className='flex items-center gap-1'>
                    <Shield className='h-3 w-3' />
                    Email Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {authType === 'sms' && (
                <Button
                  variant='outline'
                  className='w-full'
                  disabled={timeDisabledSendSMS > 0}
                  onClick={async () => {
                    setTimeDisabledSendSMS(30)
                    const res = await sendSMS({
                      type: loginMethod,
                      identifier: identifier
                    })

                    if (!res.success) {
                      handleHttpError(res, authenticateForm)
                      return
                    }

                    const sentPhone = res.data
                    if (sentPhone) {
                      toast.success(`Check your phone ${sentPhone} for the code`)
                    }
                  }}
                >
                  Send SMS{timeDisabledSendSMS > 0 ? `(${timeDisabledSendSMS})` : null}
                </Button>
              )}

              {authType === 'code' && (
                <Button
                  variant='outline'
                  className='w-full'
                  disabled={timeDisabledSendCode > 0}
                  onClick={async () => {
                    setTimeDisabledSendCode(30)
                    const res = await sendCode({
                      type: loginMethod,
                      identifier: identifier
                    })

                    if (!res.success) {
                      handleHttpError(res, authenticateForm)
                      return
                    }

                    const sentEmail = res.data

                    if (sentEmail) {
                      toast.success(`Check your email ${sentEmail} for the code`)
                    }
                  }}
                >
                  Send Code{timeDisabledSendCode > 0 ? `(${timeDisabledSendCode})` : null}
                </Button>
              )}

              <Form {...authenticateForm}>
                <form onSubmit={authenticateForm.handleSubmit(onSubmitAuthenticateForm)} className='space-y-8'>
                  <FormField
                    control={authenticateForm.control}
                    name='authValue'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{authType.charAt(0).toUpperCase() + authType.slice(1)}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full' disabled={isAuthenticating}>
                    Continue {isAuthenticating && <Loader2 className='h-4 w-4 animate-spin' />}
                  </Button>
                </form>
              </Form>
            </>
          )}

          <div className='text-center text-sm text-muted-foreground'>
            {"Don't have an account? "}
            <button className='text-primary hover:underline font-medium'>Sign up</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
