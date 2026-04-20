export function normalizeDomain(input: string): string {
  let hostname = input.trim().toLowerCase()
  if (hostname.includes('://')) {
    try {
      hostname = new URL(hostname).hostname
    } catch {
      /* keep as-is */
    }
  }
  hostname = hostname.replace(/^www\./, '')
  hostname = hostname.replace(/\.+$/, '')
  return hostname
}
