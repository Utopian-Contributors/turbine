import { useCallback, useRef, useState } from 'react'

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  cost?: number
}

export interface ArchiveLinkJob {
  id: string
  url: string
  faviconPath: string | null
  seoTitle: string | null
  simpleReaderPath: string | null
  ultraReaderPath: string | null
}

interface UsageInfo {
  inputTokens: number
  outputTokens: number
  cost: number
}

const API_BASE =
  import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace('/graphql/', '').replace('/graphql', '') ||
  'http://localhost:4000'

export function useAgentChat(sessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [archiveLinks, setArchiveLinks] = useState<ArchiveLinkJob[]>([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const idCounter = useRef(0)

  const loadMessages = useCallback((msgs: Message[]) => {
    setMessages(msgs)
  }, [])

  const sendMessage = useCallback(
    async (userId: string, prompt: string, displayPrompt?: string, jobIds?: string[], onDone?: () => void) => {
      if (!sessionId || streaming) return

      setError(null)
      const userMsg: Message = {
        id: `local-${idCounter.current++}`,
        role: 'USER',
        content: displayPrompt ?? prompt,
      }
      const assistantMsg: Message = {
        id: `local-${idCounter.current++}`,
        role: 'ASSISTANT',
        content: '',
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(`${API_BASE}/agent/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, userId, prompt, ...(jobIds && jobIds.length > 0 ? { jobIds } : {}) }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          throw new Error(`Request failed: ${res.status}`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          let eventType = ''
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7)
            } else if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6))
              if (eventType === 'delta' && data.text) {
                setMessages((prev) => {
                  const updated = [...prev]
                  const last = updated[updated.length - 1]
                  if (last?.role === 'ASSISTANT') {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + data.text,
                    }
                  }
                  return updated
                })
              } else if (eventType === 'done') {
                const usage = data as UsageInfo
                setMessages((prev) => {
                  const updated = [...prev]
                  const last = updated[updated.length - 1]
                  if (last?.role === 'ASSISTANT') {
                    updated[updated.length - 1] = { ...last, cost: usage.cost }
                  }
                  return updated
                })
                onDone?.()
              } else if (eventType === 'archive-links') {
                const { jobs } = data as { jobs: ArchiveLinkJob[] }
                setArchiveLinks((prev) => {
                  const map = new Map(prev.map((j) => [j.url, j]))
                  for (const job of jobs) map.set(job.url, job)
                  return [...map.values()]
                })
              } else if (eventType === 'error') {
                setError(data.error)
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Stream failed')
        }
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [sessionId, streaming],
  )

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { messages, archiveLinks, streaming, error, sendMessage, loadMessages, cancel }
}
