import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  layout('./routes/(main)/layout.tsx', [
    route('lessons', './routes/(main)/lessons.tsx'),
    route('my-lessons', './routes/(main)/my-lessons.tsx'),
    route('messages', './routes/(main)/messages.tsx'),
    route('students', './routes/(main)/students.tsx')
  ]),
  route('login', './routes/(auth)/login.tsx')
] satisfies RouteConfig
