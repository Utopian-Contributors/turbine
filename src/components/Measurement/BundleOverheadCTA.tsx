import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BundleOverheadCTAProps {}

const BundleOverheadCTA: React.FC<BundleOverheadCTAProps> = () => {
  return (
    <div className="border border-gray-200 rounded-xl shadow-sm bg-gray-500/10 p-4">
      <h2 className="text-lg font-semibold text-gray-600 mb-2">
        Optimize the network overhead
      </h2>
      <p>
        Large amount of script files can increase network overhead and slow down
        page load times significantly.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Use a bundler to load scripts more efficiently
      </p>
    </div>
  )
}

export default BundleOverheadCTA
