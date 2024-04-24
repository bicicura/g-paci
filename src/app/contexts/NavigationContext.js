import { createContext, useState, useEffect } from 'react'
import supabase from '../../../utils/supabaseClient'
import {
  WORK_STATUS_ACTIVE,
  NAV_SECTION_WORK,
  NAV_SECTION_INFO,
} from '../../../constants'
import { usePathname, useRouter } from 'next/navigation'

export const NavigationContext = createContext()

const NavigationProvider = ({ children }) => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInfoActive, setIsInfoActive] = useState(false)
  const [isWorkActive, setIsWorkActive] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const toggleNavigation = section => {
    if (section === NAV_SECTION_WORK) {
      setIsInfoActive(false)
      return setIsWorkActive(!isWorkActive)
    } else if (section === NAV_SECTION_INFO) {
      setIsWorkActive(false)
      setIsInfoActive(!isInfoActive)
    }
  }

  const getNavigationData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('works')
        .select(`*, works_images (img, order)`)
        .eq('status', WORK_STATUS_ACTIVE)
        .order('order', { ascending: true, foreignTable: 'works_images' })
        .limit(1, { foreignTable: 'works_images' })

      // filter out if a work does not has any imgs
      const workWithImages = data.filter(item => item.works_images.length > 0)

      // sort works by order field, from lowest to highest
      workWithImages.sort((a, b) => a.order - b.order)

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

      // if there are works available and there is no overview and user is in index... redirect
      if (workWithImages.length && overview === undefined && pathname === '/') {
        const slug = workWithImages[0].slug
        router.push('/work/' + slug)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getNavigationData()
  }, [])

  return (
    <NavigationContext.Provider
      value={{
        links,
        loading,
        setLinks,
        isInfoActive,
        isWorkActive,
        setIsInfoActive,
        setIsWorkActive,
        toggleNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
