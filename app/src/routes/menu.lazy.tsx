import { Card, CardHeader } from '@/components/ui/card'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { LuInfo } from 'react-icons/lu'
import { MdOutlineExplore, MdOutlineStyle } from 'react-icons/md'

export const Route = createLazyFileRoute('/menu')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useNavigate()
  const { t } = useTranslation()

  const settings: {
    path: string
    locate?: string
    icon: ReactElement
  }[] = [
    {
      path: 'preferences',
      icon: <MdOutlineStyle />,
    },
    {
      path: 'explore',
      icon: <MdOutlineExplore />,
      locate: 'sidebar',
    },
    {
      path: 'about',
      icon: <LuInfo />,
    },
  ]

  return (
    <div className="flex flex-col w-full h-full px-16 gap-8">
      {settings.map((item) => (
        <Card
          className="max-w-full cursor-pointer dark:hover:bg-white/5 hover:bg-black/5"
          key={item.path}
          onClick={() => router({ to: `/settings/${item.path}` })}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            {item.icon}
            <div className="flex flex-col select-none ml-1 items-start justify-start text-start">
              <p className="text-medium">
                {item?.locate
                  ? t(`${item.locate}.${item.path}`)
                  : t(`settings.name.${item.path}`)}
              </p>
              <p className="text-small text-default-500">
                {t(`settings.description.${item.path}`)}
              </p>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
