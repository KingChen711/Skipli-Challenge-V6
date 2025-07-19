import { Component } from 'react'
import { Outlet } from 'react-router'

export class Layout extends Component {
  render() {
    return <Outlet />
  }
}

export default Layout
