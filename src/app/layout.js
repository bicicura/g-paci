import './globals.css'
import ClientContainer from './components/ClientContainer.js'

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
      <body>
        <ClientContainer>{children}</ClientContainer>
      </body>
    </html>
  )
}
