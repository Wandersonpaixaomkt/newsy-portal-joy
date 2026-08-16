import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/noticia/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/noticia/$slug"!</div>
}
