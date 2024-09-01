'use client'

import React, { useCallback, useRef, useState } from 'react'
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
  name: string
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

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      setError(null)

      try {
        // Attempt to log in first
        await login(data)
        if (redirect?.current) router.push(redirect.current as string)
        else router.push('/')
        window.location.href = '/'
      } catch (loginError) {
        // If login fails, try to create an account
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            const errorData = await response.json()
            setError(errorData.message || 'There was an error creating the account.')
            setLoading(false)
            return
          }

          // Account creation succeeded, now log in
          await login(data)
          if (redirect?.current) router.push(redirect.current as string)
          else router.push('/')
          window.location.href = '/'
        } catch (createError) {
          setError('There was an error with the credentials provided. Please try again.')
          setLoading(false)
        }
      }
    },
    [login, router],
  )

  const loginAsGuest = () => {
    const guestEmail = `${uuidv4()}@guest.com`
    setValue('name', 'Guest')
    setValue('email', guestEmail)
    setValue('password', 'guest')
    handleSubmit(onSubmit)()
  }

  const easyLogin = () => {
    setValue('name', 'Customer') // Pre-set the name to 'Customer'
    handleSubmit(onSubmit)()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Message error={error} className={classes.message} />
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
        onClick={easyLogin}
        className={classes.submit}
      />
      <Button
        type="button"
        appearance="secondary"
        label="Continue as Guest"
        onClick={loginAsGuest}
        className={classes.submit}
      />
      <div className={classes.links}>
        <Link href={`/create-account${allParams}`}>Create an account</Link>
        <br />
        <Link href={`/recover-password${allParams}`}>Recover your password</Link>
      </div>
    </form>
  )
}

export default LoginForm
