'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { Message } from '../../../_components/Message'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

type FormData = {
  name?: string
  email: string
  password: string
}

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    // Pre-set the name to "Customer" for Easy Login
    setValue('name', 'Customer')
  }, [setValue])

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      try {
        // Check if user already exists or create a new account
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.message !== 'User already exists') {
            setError('There was an error creating the account.')
            setLoading(false)
            return
          }
        }

        // Log in the user after successful account creation or if the user already exists
        await login(data)
        if (redirect?.current) router.push(redirect.current as string)
        else router.push('/')
        window.location.href = '/'
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
        setLoading(false)
      }
    },
    [login, router],
  )

  // Function to handle guest login with a unique email
  const loginAsGuest = () => {
    const guestEmail = `${uuidv4()}@guest.com`
    setValue('name', 'Guest')
    setValue('email', guestEmail)
    setValue('password', 'guest')
    handleSubmit(onSubmit)()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Message error={error} className={classes.message} />
      {/* Name field is hidden, pre-set to "Customer" */}
      <Input
        name="email"
        label="Email Address"
        required
        register={register}
        error={errors.email}
        type="email"
      />
      <Input
        name="password"
        type="password"
        label="Password"
        required
        register={register}
        error={errors.password}
      />
      <Button
        type="submit"
        appearance="primary"
        label={loading ? 'Processing' : 'Easy Login'}
        disabled={loading}
        className={classes.submit}
      />
      <Button
        type="button"
        appearance="secondary"
        label="Continue as Guest"
        onClick={loginAsGuest}
        disabled={loading}
        className={classes.submit}
      />
      <div className={classes.links}>
        <Link href={`/recover-password${allParams}`}>Recover your password</Link>
      </div>
    </form>
  )
}

export default LoginForm
