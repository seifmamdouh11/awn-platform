import CTASection from '@/app/components/MainLayout/CTAsection/CTASection'
import HomeSection from '@/app/components/MainLayout/HomeSection/HomeSection'
import HowItWorkSection from '@/app/components/MainLayout/HowItWorkSection/HowItWorkSection'
import OpportunitiesSection from '@/app/components/MainLayout/OpportunitiesSection/OpportunitiesSection'
import PartnersSection from '@/app/components/MainLayout/PartnersSection/PartnersSection'
import React from 'react'

export default function Home() {
  return (
    <>
    <HomeSection />
    <HowItWorkSection />
    <PartnersSection />
    <OpportunitiesSection />
    <CTASection />
    </>
  )
}
