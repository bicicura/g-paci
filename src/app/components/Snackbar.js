import { useSnackbar } from '../contexts/SnackbarContext'
import { useState, useEffect } from 'react'

const Snackbar = () => {
  const { snackbar, closeSnackbar } = useSnackbar()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (snackbar.open) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false) // Primero, hacemos que el Snackbar sea invisible
        setTimeout(() => closeSnackbar(), 300) // Luego lo cerramos después de que la transición haya finalizado
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [snackbar.open])

  if (!snackbar.open && !isVisible) {
    return null
  }

  return (
    <div
      className={`fixed flex gap-12 text-md font-bold bottom-0 right-0 p-4 m-4 rounded shadow-xl border-2 ${
        snackbar.type === 'success'
          ? 'bg-green-300 border-green-500 text-green-900'
          : 'bg-red-300 border-red-500 text-red-900'
      } transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <p>{snackbar.message}</p>
      <button onClick={() => setIsVisible(false)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="rotate-45 text-inherit"
          width="13"
          height="14"
          viewBox="0 0 24 24"
        >
          <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"></path>
        </svg>
      </button>
    </div>
  )
}

export default Snackbar
