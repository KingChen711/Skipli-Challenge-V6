import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  layout('./routes/(main)/layout.tsx', [route('dashboard', './routes/(main)/dashboard.tsx')])
] satisfies RouteConfig
