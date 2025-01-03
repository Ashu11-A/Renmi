import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { IconContext } from 'react-icons/lib'
import './App.css'
import { SplashScreen } from './components/SplashScreen'
import { ThemeProvider } from './components/themeProvider'
import './lib/i18n'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })
const query = new QueryClient()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={query}>
    <ThemeProvider>
      <IconContext.Provider value={{ style: { height: '1.5rem', width: '1.5rem' } }}>
        <div className='flex h-screen w-screen overflow-hidden'>
          <SplashScreen>
            <RouterProvider router={router} />
          </SplashScreen>
        </div>
      </IconContext.Provider>
    </ThemeProvider>
  </QueryClientProvider>
)
