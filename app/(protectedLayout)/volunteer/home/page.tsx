"use client";

import React from "react";
import VolunteerHeroSection from "@/app/components/VolunteerLayout/VolunteerNavbar/VolunteerHome/HeroSection/VolunteerHeroSection";
import QuickActionsSection from "@/app/components/VolunteerLayout/VolunteerNavbar/VolunteerHome/QuickActionsSection/QuickActionsSection";
import ActiveOpportunitiesSection from "@/app/components/VolunteerLayout/VolunteerNavbar/VolunteerHome/Opportunitites/ActiveOpportunitiesSection";
import VolunteerStatsSection from "@/app/components/VolunteerLayout/VolunteerNavbar/VolunteerHome/StatsSection/VolunteerStatsSection";
import RecentApplicationsSection from "@/app/components/VolunteerLayout/VolunteerNavbar/VolunteerHome/RecentApplicationsSection/RecentApplicationsSection";

export default function VolunteerHome() {
  return (
    <div className="space-y-6 p-6 md:space-y-10 md:p-12">
      <VolunteerHeroSection />
      <QuickActionsSection />
      <ActiveOpportunitiesSection />
      <VolunteerStatsSection />
      <RecentApplicationsSection />
    </div>
  );
}