import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('./routes/(protected)/layout.tsx', [
    layout('./routes/(protected)/(main)/layout.tsx', [
      index('./routes/(protected)/(main)/home.tsx'),
      layout('./routes/(protected)/(main)/(instructors-dashboard)/layout.tsx', [
        route('lessons', './routes/(protected)/(main)/(instructors-dashboard)/lessons/index.tsx'),
        route('students', './routes/(protected)/(main)/(instructors-dashboard)/students/index.tsx')
      ]),
      layout('./routes/(protected)/(main)/(students-dashboard)/layout.tsx', [
        route('my-lessons', './routes/(protected)/(main)/(students-dashboard)/my-lessons/index.tsx'),
        route('my-profile', './routes/(protected)/(main)/(students-dashboard)/my-profile/index.tsx')
      ])
    ]),
    layout('./routes/(protected)/(messages)/layout.tsx', [
      route('messages', './routes/(protected)/(messages)/messages.tsx')
    ])
  ]),
  route('login', './routes/(auth)/login.tsx'),
  route('setup-account', './routes/(auth)/setup-account.tsx')
] satisfies RouteConfig
