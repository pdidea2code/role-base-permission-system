import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilActionRedo,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import Cookies from 'js-cookie'

const userdetail = JSON.parse(Cookies.get('admin'))

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]
if (userdetail.role === 'superadmin') {
  _nav.push(
    {
      component: CNavItem,
      name: 'Permission',
      to: '/permission',
      icon: <CIcon icon={cilActionRedo} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Admin',
      to: '/admin',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
  )
}

export default _nav
