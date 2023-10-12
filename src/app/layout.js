import './globals.css'
import { Inter } from 'next/font/google'
import ClientContainer from './components/ClientContainer.js'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gastón Paci',
  description: 'Buenos Aires based photographer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientContainer>{children}</ClientContainer>
      </body>
    </html>
  )
}
