import { createContext, useState, useEffect } from 'react'

export const NavigationContext = createContext()

const NavigationProvider = ({ children }) => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const { signal } = new AbortController()

  async function getTableData() {
    try {
      setLoading(true)
      const response = await fetch('/api/navigation-data', {
        ...signal,
        cache: 'no-cache',
      })
      const data = await response.json()
      // Find the overview item
      const overview = data.find(item => item.slug === 'overview')

      // Move the overview item to the beginning of the array if it exists
      if (overview) {
        const reorderedData = [overview, ...data.filter(item => item.slug !== 'overview')]
        return setLinks(reorderedData)
      }

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
