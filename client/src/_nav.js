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
import { CNavItem } from '@coreui/react'
import Cookies from 'js-cookie'

// Retrieve user details and permissions from cookies
const userdetail = JSON.parse(Cookies.get('admin') || '{}')
const permissionsString = Cookies.get('permission') || '[]'

// Safe parsing of permissions
const permissions =
  permissionsString.startsWith('[') && permissionsString.endsWith(']')
    ? JSON.parse(permissionsString.replace(/\\/g, '')) // Clean and parse permissions
    : []

const _nav = [
  // Example: Uncomment and modify this if you want to add a Docs link
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

if (permissions.includes('dashboard.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  })
}

if (permissions.includes('user.view')) {
  _nav.push({
    component: CNavItem,
    name: 'User',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  })
}

if (permissions.includes('role.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Role',
    to: '/role',
    icon: <CIcon icon={cilActionRedo} customClassName="nav-icon" />,
  })
}
if (permissions.includes('permission.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Permission',
    to: '/permission',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  })
}

export default _nav
