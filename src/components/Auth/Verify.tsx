import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import { Flex } from '@radix-ui/themes'
import { Formik } from 'formik'

interface VerifyProps {
  onSubmit: (data: { otp: string }) => void
  onResendCode: () => void
  message?: string
  error?: string
}

const Verify: React.FC<VerifyProps> = ({
  onSubmit,
  onResendCode,
  message,
  error,
}) => {
  return (
    <Flex
      direction="column"
      align="stretch"
      gap="lg"
      style={{ textAlign: 'center' }}
    >
      <Formik initialValues={{ otp: '' }} onSubmit={onSubmit}>
        {({ handleSubmit, setValues }) => (
          <FieldGroup>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-light">Enter verification code</h1>
              <p className="text-muted-foreground text-sm text-balance">
                We sent a 6-digit code to your email.
              </p>
            </div>
            {error && (
              <Field>
                <FieldDescription className="text-center text-red-500">
                  {error}
                </FieldDescription>
              </Field>
            )}
            {message && (
              <Field>
                <FieldDescription className="text-center text-green-500">
                  {message}
                </FieldDescription>
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="otp" className="sr-only">
                Verification code
              </FieldLabel>
              <InputOTP
                maxLength={6}
                id="otp"
                name="otp"
                onChange={(value) => setValues({ otp: value })}
                required
              >
                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription className="text-center">
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>
            <Button type="submit" onClick={() => handleSubmit()}>
              Verify
            </Button>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{' '}
              <Button variant="link" onClick={() => onResendCode()}>
                Resend
              </Button>
            </FieldDescription>
          </FieldGroup>
        )}
      </Formik>
    </Flex>
  )
}

export default Verify
