import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from '@/store/store'
import AppRoutes from '@/routes/route.jsx'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster position="top-right" />
    </Provider>
  )
}

export default App
