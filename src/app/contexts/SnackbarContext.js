import { createContext, useState, useContext } from 'react'

const SnackbarContext = createContext()

export const useSnackbar = () => useContext(SnackbarContext)

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'info', // Puedes definir 'success', 'info', 'warning', 'error'
  })

  const showSnackbar = (message, type = 'info') => {
    setSnackbar({ open: true, message, type })
  }

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <SnackbarContext.Provider value={{ snackbar, showSnackbar, closeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  )
}
