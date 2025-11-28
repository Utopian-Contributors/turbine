'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { motion } from 'motion/react'
import type { HTMLAttributes } from 'react'
import { useState } from 'react'

interface ScriptCopyBtnProps extends HTMLAttributes<HTMLDivElement> {
  showMultiplePackageOptions?: boolean
  codeLanguage: string
  lightTheme: string
  darkTheme: string
  commandMap: Record<string, string>
  className?: string
}

export function ScriptCopyBtn({
  showMultiplePackageOptions = true,
  commandMap,
  className,
}: ScriptCopyBtnProps) {
  const packageManagers = Object.keys(commandMap)
  const [packageManager, setPackageManager] = useState(packageManagers[0])
  const [copied, setCopied] = useState(false)
  const command = commandMap[packageManager]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('w-full flex items-center justify-center', className)}>
      <div className="w-full space-y-2">
        <div className="mb-2 flex items-center justify-between">
          {showMultiplePackageOptions && (
            <div className="relative">
              <div className="inline-flex overflow-hidden rounded-md border border-border text-xs">
                {packageManagers.map((pm, index) => (
                  <div key={pm} className="flex items-center">
                    {index > 0 && (
                      <div className="h-4 w-px bg-border" aria-hidden="true" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative rounded-none bg-background px-2 hover:bg-background ${
                        packageManager === pm
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setPackageManager(pm)}
                    >
                      {pm}
                      {packageManager === pm && (
                        <motion.div
                          className="absolute inset-x-0 bottom-[0px] mx-auto h-0.5 w-[100%] bg-primary"
                          layoutId="activeTab"
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative flex items-center">
          <div
            className={cn(
              'w-full flex justify-between border rounded-md font-mono overflow-hidden cursor-pointer',
              copied
                ? 'border-green-600 bg-green-500 dark:bg-green-900'
                : 'bg-white dark:bg-black'
            )}
            onClick={copyToClipboard}
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          >
            <pre
              className={cn(
                'w-full text-sm bg-transparent mr-3 p-2 px-3 font-mono overflow-x-auto scrollbar-hide',
                copied ? 'text-white' : 'text-black dark:text-white'
              )}
            >
              {command}
            </pre>
            <Copy
              className={`h-4 w-4 mr-4 transform translate-y-[10px] text-primary dark:text-white transition-all duration-300 ${
                copied ? 'scale-0' : 'scale-100'
              }`}
            />
            <Check
              className={`absolute right-0 h-4 w-4 mr-4 transform translate-y-[10px] text-primary dark:text-white transition-all duration-300 ${
                copied ? 'text-white scale-100' : 'scale-0'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
