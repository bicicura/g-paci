'use client'

import { NextUIProvider } from '@nextui-org/react'
import { SnackbarProvider } from './contexts/SnackbarContext'
import Snackbar from './components/Snackbar'

export function Providers({ children }) {
  return (
    <SnackbarProvider>
      <Snackbar />
      <NextUIProvider>{children}</NextUIProvider>
    </SnackbarProvider>
  )
}
