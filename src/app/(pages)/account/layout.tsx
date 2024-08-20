'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Gutter } from '../../_components/Gutter'
import { useAuth } from '../../_providers/Auth'
import { UserInfo } from './UserInfo'

import classes from './index.module.scss'

const profileNavItems = [
  {
    title: 'Personal Information',
    url: '/account',
    icon: '/assets/icons/user.svg',
  },
  {
    title: 'My Purchases',
    url: '/account/purchases',
    icon: '/assets/icons/purchases.svg',
  },
  {
    title: 'My Orders',
    url: '/account/orders',
    icon: '/assets/icons/orders.svg',
  },
  {
    title: 'Logout',
    url: '/logout',
    icon: '/assets/icons/logout.svg',
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Determine if the user is a guest
  const isGuest = user?.name === 'Guest'

  // Filter navigation items based on user status
  const filteredNavItems = profileNavItems.filter(item => {
    if (isGuest) {
      return (
        item.title !== 'Personal Information' &&
        item.title !== 'My Purchases' &&
        item.title !== 'My Orders'
      )
    }
    return true
  })

  return (
    <div className={classes.container}>
      <Gutter>
        <h3>My Profile</h3>
        <div className={classes.account}>
          <div className={classes.nav}>
            <UserInfo />

            <ul>
              {filteredNavItems.map(item => (
                <li key={item.url}>
                  <Link href={item.url} className={classes.navItem}>
                    <Image src={item.icon} alt={item.title} width={24} height={24} />
                    <p>{item.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {children}
        </div>
      </Gutter>
    </div>
  )
}
