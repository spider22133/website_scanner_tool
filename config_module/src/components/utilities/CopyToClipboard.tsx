import React, { useState } from 'react'

// Props interface for the component
interface CopyToClipboardProps {
  textToCopy: string
  children: React.ReactNode
  onCopySuccess?: () => void
  onCopyError?: (error: Error) => void
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ textToCopy, children, onCopySuccess, onCopyError }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      onCopySuccess?.()

      // Reset the "copied" state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      const copyError = error instanceof Error ? error : new Error('Failed to copy text')
      onCopyError?.(copyError)
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <div onClick={handleCopy} style={{ cursor: 'pointer', display: 'inline-block' }} title={copied ? 'Copied!' : 'Click to copy'}>
      {children}
    </div>
  )
}
