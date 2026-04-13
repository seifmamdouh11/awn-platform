import React from 'react'
import CompanyNavbar from './CompanyNavbar/CompanyNavbar'
import CompanyDashboard from './CompanyDashboard/CompanyDashboard'
type Props = {
  children: React.ReactNode
}
export default function CompanyLayout({ children }: Props) {
  return (
    <>
    <CompanyNavbar />
    <div className='ps-20'>
      {children}
    </div>
    </>
  )
}
