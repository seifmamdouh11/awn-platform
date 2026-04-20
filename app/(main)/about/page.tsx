import AboutHero from '@/app/components/AboutPageLayout/HeroSection/AboutHero'
import MissionVisionSection from '@/app/components/AboutPageLayout/MissionVisionSection/MissionVisionSection'
import OurStorySection from '@/app/components/AboutPageLayout/OurStorySection/OurStorySection'
import PlatformHighlightsSection from '@/app/components/AboutPageLayout/PlatformHighlightsSection/PlatformHighlightsSection'
import React from 'react'

export default function About() {
  return (
    <main className="overflow-x-hidden">
      <AboutHero />
      <OurStorySection />
      <MissionVisionSection />
      <PlatformHighlightsSection />
    </main>
  )
}
