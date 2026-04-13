import React from 'react'
import MainClientLayout from './MainClientLayout'
import Navbar from '../components/MainLayout/Navbar/Navbar'
import Footer from '../components/MainLayout/Footer/Footer'
import { Metadata } from 'next'

type Props = {
  children: React.ReactNode
}


export default function MainLayout({ children }: Props) {
  return (
    <>
      <MainClientLayout>
        <main className=" ">
          {children}
        </main>
      </MainClientLayout>
    </>
  )
}
