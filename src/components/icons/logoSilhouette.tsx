import React from 'react'

interface LogoSilhouetteProps {
  className?: string
}

const LogoSilhouette: React.FC<LogoSilhouetteProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect x="1" y="1" width="18" height="18" fill="currentColor" />
    </svg>
  )
}

export default LogoSilhouette
