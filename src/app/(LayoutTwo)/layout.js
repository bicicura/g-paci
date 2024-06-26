import '../globals.css'
import { Inter } from 'next/font/google'
import DashboardNav from '../components/Dashboard/DashboardNav'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

import { Providers } from '../providers'

export const metadata = {
  title: 'Gastón Paci',
  description: 'Buenos Aires based photographer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={
          inter.className + ' text-white max-w-3xl mx-auto min-h-screen bg-background'
        }
      >
        <DashboardNav />
        <main className="max-w-3xl pb-16 mx-auto mt-16 ">
          <Providers>{children}</Providers>
        </main>
        <Toaster
          richColors
          position="bottom-right"
          closeButton
        />
      </body>
    </html>
  )
}
