import '../globals.css'
import { Inter } from 'next/font/google'
import DashboardNav from '../components/Dashboard/DashboardNav'

const inter = Inter({ subsets: ['latin'] })

import { Providers } from '../providers'

export const metadata = {
  title: 'Gastón Paci',
  description: 'Buenos Aires based photographer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + ' text-white min-h-screen bg-background'}>
        <DashboardNav />
        <main className="mt-20 mb-16 max-w-3xl mx-auto ">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}