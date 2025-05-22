"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8">We apologize for the inconvenience. Please try again later.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
