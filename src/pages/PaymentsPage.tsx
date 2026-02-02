import moment from 'moment'
import React, { useEffect } from 'react'

import Pricetag from '@/components/Pricetag'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { truncateMiddle } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { usePaymentsQuery } from '../../generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PaymentsPageProps {}

const PaymentsPage: React.FC<PaymentsPageProps> = () => {
  const { data: paymentsQueryData } = usePaymentsQuery()
  const [copiedSignature, setCopiedSignature] = React.useState<string | null>(
    null
  )

  useEffect(() => {
    if (copiedSignature) {
      const timeout = setTimeout(() => {
        setCopiedSignature(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copiedSignature])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-light mb-6">Payments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Signature</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentsQueryData?.payments?.map((payment, index) => (
            <TableRow key={payment.id}>
              <TableCell>
                {(paymentsQueryData.payments?.length ?? 0) - index}
              </TableCell>
              <TableCell>{moment(payment.createdAt).fromNow()}</TableCell>
              <TableCell
                className="flex gap-1 items-center cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(payment.txSignature)
                  setCopiedSignature(payment.id)
                }}
              >
                <div
                  className={cn(
                    'w-fit h-fit rounded-sm p-1',
                    copiedSignature === payment.id
                      ? 'bg-green-500 text-white'
                      : 'bg-muted'
                  )}
                >
                  {copiedSignature !== payment.id ? (
                    <CopyIcon size={12} />
                  ) : (
                    <CheckIcon size={12} />
                  )}
                </div>
                {copiedSignature !== payment.id
                  ? truncateMiddle(payment.txSignature)
                  : 'Copied!'}
              </TableCell>
              <TableCell>
                <Pricetag
                  className="ml-auto"
                  price={payment.amount}
                  tokenMint={payment.tokenMint}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PaymentsPage
