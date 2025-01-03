import { useNavigate } from '@tanstack/react-router'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { FaBars, FaRegMoon } from 'react-icons/fa'
import { FiSettings } from 'react-icons/fi'
import { MdOutlineDownloadForOffline, MdOutlineExplore, MdOutlineWbSunny } from 'react-icons/md'
import { useTheme } from '../themeProvider'
import { Button } from '../ui/button'
import { RiHomeLine } from 'react-icons/ri'

export function Sidebar ({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useNavigate()

  const handleChangeCollapsed = () => {
    setIsCollapsed((state) => {
      localStorage.setItem('sidebar_collapsed', String(!state))
      return !state
    })
  }

  const handleTheme = () => theme === 'light'
    ? setTheme('dark')
    : setTheme('light')

  useEffect(() => setIsCollapsed(Boolean(localStorage.getItem('sidebar_collapsed') ?? false)), [])

  const items: {
    locale: 'top' | 'footer'
    onClick: () => void
    icon: ReactElement
  }[] = [
    {
      locale: 'top',
      onClick: handleChangeCollapsed,
      icon:  <FaBars />
    },
    {
      locale: 'top',
      onClick: () => router({ to: '/' }),
      icon: <RiHomeLine />
    },
    {
      locale: 'top',
      onClick: () => router({ to: '/explore' }),
      icon: <MdOutlineExplore />
    },
    {
      locale: 'top',
      onClick: () => router({ to: '/download' }),
      icon: <MdOutlineDownloadForOffline />  // {/* MdOutlineDownloading */}
    },
    {
      locale: 'footer',
      onClick: handleTheme,
      icon: theme === 'dark' ? <FaRegMoon /> : <MdOutlineWbSunny />
    },
    {
      locale: 'footer',
      onClick: () => router({ to: '/menu' }),
      icon: <FiSettings />
    }
  ]

  return (
    <div className='flex flex-1 relative'>
      <nav className='fixed h-full z-50 pl-5'>
        <div className='flex h-full flex-col justify-between'>
          <div className='flex flex-col gap-5 pt-10'>
            {items.filter((item) => item.locale === 'top').map((item, index) => (
              <Button
                key={index}
                onClick={item.onClick}
                variant={'outline'}
              >
                {item.icon}
              </Button>
            ))}
          </div>
          <div className='flex flex-col gap-5 pb-10'>
            {items.filter((item) => item.locale === 'footer').map((item, index) => (
              <Button
                key={index}
                onClick={item.onClick}
                variant={'outline'}
              >
                {item.icon}
              </Button>
            ))}
          </div>
        </div>
        {isCollapsed}
      </nav>
      <main className='flex flex-1 relative ml-24 mr-4 mt-10 overflow-y-scroll'>
        {children}
      </main>
    </div>
  )
}