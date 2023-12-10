import { createContext, useState, useEffect } from 'react'
import supabase from '../../../utils/supabaseClient'
import { WORK_STATUS_ACTIVE } from '../../../constants'

export const NavigationContext = createContext()

const NavigationProvider = ({ children }) => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInfoActive, setIsInfoActive] = useState(false)

  async function getTableData() {
    try {
      setLoading(true)
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
        .eq('status', WORK_STATUS_ACTIVE)
        .order('order', { ascending: true, foreignTable: 'works_images' })
        .limit(1, { foreignTable: 'works_images' })

      const workWithImages = data.filter(item => item.works_images.length > 0)

      // Find the overview item
      const overview = workWithImages.find(item => item.slug === 'overview')

      // Move the overview item to the beginning of the array if it exists
      if (overview) {
        const reorderedData = [
          overview,
          ...workWithImages.filter(item => item.slug !== 'overview'),
        ]
        return setLinks(reorderedData)
      }

      setLinks(workWithImages)
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
    <NavigationContext.Provider
      value={{ links, setLinks, loading, isInfoActive, setIsInfoActive }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
