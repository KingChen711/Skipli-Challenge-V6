import { Outlet } from 'react-router'

function Layout() {
  return (
    <section className='flex min-h-screen flex-1 flex-col pt-[64px]'>
      <div className='mx-auto w-full'>
        <Outlet />
      </div>
    </section>
  )
}

export default Layout
