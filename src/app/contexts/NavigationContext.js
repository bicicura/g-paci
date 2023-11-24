import { createContext, useState, useEffect } from 'react'
import supabase from '../../../utils/supabaseClient'

export const NavigationContext = createContext()

const NavigationProvider = ({ children }) => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const { signal } = new AbortController()

  async function getTableData() {
    try {
      setLoading(true)
      // const response = await fetch(
      //   `/api/navigation-data?timestamp=${new Date().getTime()}`,
      //   {
      //     method: 'GET',
      //     cache: 'no-store',
      //     next: { revalidate: 10 },
      //   }
      // )
      // const data = await response.json()

      const { data, error } = await supabase
        .from('works')
        .select(
          `
    *,
    works_images (
      img,
      order
    )
  `
        )
        .eq('status', 'active')
        .order('id', { foreignTable: 'works_images' }) // Assuming 'id' is your primary key in 'works_images'
        .limit(1, { foreignTable: 'works_images' })

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
