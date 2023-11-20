import { createContext, useState, useEffect } from 'react'

export const NavigationContext = createContext()

const NavigationProvider = ({ children }) => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  async function getTableData() {
    try {
      setLoading(true)
      const response = await fetch('/api/navigation-data')
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTableData()
  }, [])

  return (
    <NavigationContext.Provider value={{ links, setLinks, loading }}>
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
