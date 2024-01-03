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
      className={`fixed items-center z-50 flex gap-12 text-md font-bold bottom-0 right-0 p-4 m-4 rounded shadow-xl border-2 ${
        snackbar.type === 'success'
          ? 'bg-green-300 border-green-500 text-green-900'
          : 'bg-red-300 border-red-500 text-red-900'
      } transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex gap-2">
        {snackbar.type === 'error' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        ) : snackbar.type === 'success' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        )}

        <p>{snackbar.message}</p>
      </div>
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
