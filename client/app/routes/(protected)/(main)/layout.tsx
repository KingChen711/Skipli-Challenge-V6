import { Outlet } from 'react-router'

function Layout() {
  return (
    <section className='flex min-h-screen flex-1 flex-col p-6 pt-[88px]'>
      <div className='mx-auto w-full max-w-[1620px]'>
        <Outlet />
      </div>
    </section>
  )
}

export default Layout
