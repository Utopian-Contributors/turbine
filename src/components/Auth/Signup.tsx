import { Link } from '@radix-ui/themes'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { CreateUserInput } from 'generated/graphql'

const signupValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(
      /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "()<>:;,+-=*]).*$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  repeat: Yup.string()
    .required('Please repeat your password')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value
    }),
})

const Signup: React.FC<{
  onSubmit: (data: CreateUserInput) => void
  error?: string
}> = ({ onSubmit, error }) => {
  return (
    <Formik
      initialValues={{ name: '', email: '', password: '', repeat: '' }}
      onSubmit={({ name, email, password }) =>
        onSubmit({ name, email, password })
      }
      validationSchema={signupValidationSchema}
    >
      {({ handleSubmit, handleChange, errors }) => (
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create your account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              required
              onChange={handleChange}
            />
            {errors['email'] ? (
              <FieldDescription className="text-red-500">
                {errors['email']}
              </FieldDescription>
            ) : (
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••••••"
              required
              onChange={handleChange}
            />
            {errors['password'] ? (
              <FieldDescription className="text-red-500">
                {errors['password']}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••••••••••"
              required
              onChange={handleChange}
            />
            {errors['repeat'] ? (
              <FieldDescription className="text-red-500">
                {errors['repeat']}
              </FieldDescription>
            ) : (
              <FieldDescription>Please confirm your password.</FieldDescription>
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
              type="submit"
              onClick={() => handleSubmit()}
            >
              Create Account
            </Button>
          </Field>
          <Field>
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/auth/login">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      )}
    </Formik>
  )
}

export default Signup
