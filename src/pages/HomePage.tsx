import Statistics from '@/components/Dashboard/Statistics'
import { ChartAreaInteractive } from '@/components/ui/chart-area-interactive'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div>
      <title>Turbine | Home</title>
      <header className="flex h-(--header-height) items-center gap-2">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <h1 className="text-base font-medium">Bandwidth savings</h1>
        </div>
      </header>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <Statistics
          statistics={[
            {
              label: 'Total Savings',
              total: 251.5 + 5.45 + 1.25,
              change: 1.5,
              unit: 'TB',
              description: 'Total bandwidth saved this month',
            },
            {
              label: 'CDN',
              total: 251.4,
              change: -2.31,
              unit: 'TB',
              description: 'Saved CDN bandwidth this month',
            },
            {
              label: 'Bundle',
              total: 5.45,
              change: 4.12,
              unit: 'TB',
              description: 'Saved bundle bandwidth this month',
            },
            {
              label: 'Font',
              total: 1.25,
              change: 20.56,
              unit: 'TB',
              description: 'Saved font bandwidth this month',
            },
          ]}
        />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </div>
    </div>
  )
}

export default HomePage
