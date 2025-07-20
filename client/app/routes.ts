import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('./routes/(main)/layout.tsx', [
    index('./routes/(main)/home.tsx'),
    layout('./routes/(main)/(instructors-dashboard)/layout.tsx', [
      route('lessons', './routes/(main)/(instructors-dashboard)/lessons/index.tsx'),
      route('students', './routes/(main)/(instructors-dashboard)/students/index.tsx')
    ]),
    layout('./routes/(main)/(students-dashboard)/layout.tsx', [
      route('my-lessons', './routes/(main)/(students-dashboard)/my-lessons/index.tsx'),
      route('my-profile', './routes/(main)/(students-dashboard)/my-profile/index.tsx')
    ]),
    route('messages', './routes/(main)/messages.tsx')
  ]),
  route('login', './routes/(auth)/login.tsx'),
  route('setup-account', './routes/(auth)/setup-account.tsx')
] satisfies RouteConfig
