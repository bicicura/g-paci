import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navigation/Navbar.js'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gastón Paci',
  description: 'Buenos Aires based photographer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Navbar />
      </body>
    </html>
  )
}
