import AudienceServicesSection from '@/app/components/ServicesPageLayout/AudienceServicesSection/AudienceServicesSection'
import ServicesHero from '@/app/components/ServicesPageLayout/HeroSection/ServicesHero'
import ServicesCTASection from '@/app/components/ServicesPageLayout/ServicesCTASection/ServicesCTASection'
import ServicesGridSection from '@/app/components/ServicesPageLayout/ServicesGridSection/ServicesGridSection'
import React from 'react'

export default function Services() {
  return (
    <>
    <ServicesHero />
    <ServicesGridSection />
    <AudienceServicesSection />
    <ServicesCTASection />
    </>
  )
}
