import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className='pt-6'>
      <title>Turbine | Home</title>
      <header className="flex h-(--header-height) items-center gap-2">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <h1 className="text-base font-medium">Dashboard</h1>
        </div>
      </header>
      <div className="flex flex-col gap-4 py-4 lg:gap-6 lg:py-6 px-4 lg:px-6">
        <p style={{ color: '#a8a49c' }}>Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

export default HomePage
