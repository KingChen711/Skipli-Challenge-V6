import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  layout('./routes/(main)/layout.tsx', [
    layout('./routes/(main)/(instructors-dashboard)/layout.tsx', [
      route('lessons', './routes/(main)/(instructors-dashboard)/lessons.tsx'),
      route('students', './routes/(main)/(instructors-dashboard)/students/index.tsx')
    ]),
    layout('./routes/(main)/(students-dashboard)/layout.tsx', [
      route('my-lessons', './routes/(main)/(students-dashboard)/my-lessons.tsx')
    ]),
    route('messages', './routes/(main)/messages.tsx')
  ]),
  route('login', './routes/(auth)/login.tsx')
] satisfies RouteConfig
