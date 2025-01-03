import { Sidebar } from '@/components/bar/Sidebar'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    )

function RootComponent() {
  return (
    <React.Fragment>
      <Sidebar>
        <Outlet />
      </Sidebar>
      <React.Suspense>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </React.Suspense>
    </React.Fragment>
  )
}
