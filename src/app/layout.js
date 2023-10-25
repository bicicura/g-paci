import './globals.css'
import ClientContainer from './components/ClientContainer.js'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gastón Paci',
  description: 'Buenos Aires based photographer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/ljf6fkv.css"
        ></link>
      </head>
      <body className="inter.className">
        <ClientContainer>{children}</ClientContainer>
      </body>
    </html>
  )
}
