import React, { useEffect, useState } from 'react'

interface PreloadImageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  src?: string | null
  className: string
  children?: (error: boolean) => React.ReactNode
}

const PreloadImage: React.FC<PreloadImageProps> = ({
  src,
  className,
  children,
  ...props
}) => {
  const [error, setError] = useState<boolean>(false)
  useEffect(() => {
    if (!src) {
      setError(true)
      return
    }
    const img = new Image()
    img.src = src
    img.onload = () => setError(false)
    img.onerror = () => setError(true)
  }, [src])

  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={className}
      {...props}
    >
      {children && children(error)}
    </div>
  )
}

export default PreloadImage
