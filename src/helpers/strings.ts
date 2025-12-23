export const truncateMiddle = (address: string, size?: number) => {
  return `${address.slice(0, size ?? 4)}...${address.slice(-(size ?? 4))}`
}
