export const truncateMiddle = (address: string, size?: number) => {
  return `${address.slice(0, size ?? 4)}...${address.slice(-(size ?? 4))}`
}

export const abbreviateFilename = (filename: string, maxLength = 40) => {
  if (filename.length <= maxLength) return filename

  const lastDotIndex = filename.lastIndexOf('.')
  const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : ''
  const nameWithoutExt =
    lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename

  // Calculate how many characters to show on each side
  const availableLength = maxLength - extension.length - 3 // 3 for "..."
  const startLength = Math.ceil(availableLength / 2)
  const endLength = Math.floor(availableLength / 8)

  const start = nameWithoutExt.slice(0, startLength)
  const end = nameWithoutExt.slice(-endLength)

  return `${start}...${end}${extension}`
}