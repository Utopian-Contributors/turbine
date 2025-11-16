import { Link } from '@radix-ui/themes'
import { Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { LoaderCircleIcon } from 'lucide-react'

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const Login: React.FC<{
  onSubmit: (data: { email: string; password: string }) => void
  loading?: boolean
  error?: string
}> = ({ onSubmit, loading, error }) => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(login) => {
        onSubmit(login)
      }}
      validationSchema={loginValidationSchema}
    >
      {({ handleSubmit, handleChange, errors }) => (
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              required
              onChange={handleChange}
            />
            {errors['email'] && (
              <FieldDescription className="text-red-500">
                {errors['email']}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••••••"
              required
              onChange={handleChange}
            />
            {errors['password'] && (
              <FieldDescription className="text-red-500">
                {errors['password']}
              </FieldDescription>
            )}
          </Field>
          {error && (
            <Field>
              <FieldDescription className="text-center text-red-500">
                {error}
              </FieldDescription>
            </Field>
          )}
          <Field>
            <Button
              className="bg-green-600 hover:bg-green-700"
              type="submit"
              onClick={() => handleSubmit()}
            >
              {loading && (
                <LoaderCircleIcon className="mr-2 animate-spin" size={16} />
              )}
              Login
            </Button>
          </Field>
          <Field>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      )}
    </Formik>
  )
}

export default Login
