"use client";
import VolunteerNavbar from '@/app/components/VolunteerLayout/VolunteerNavbar/VolunteerNavbar';
import { useLang } from '@/app/Hooks/LangHook/LangHook';
import React from 'react'
import { useSidebar } from '@/app/Context/SidebarContext';

type Props = {
    children: React.ReactNode
}
export default function VolunteerClientLayout({ children }: Props) {
    const { lang } = useLang()
    const isRTL = lang === "ar"
    const { isCollapsed } = useSidebar();

    return (
        <>
            <VolunteerNavbar />
            <div className={`pt-16 md:pt-0 transition-all duration-300 ${isRTL ? (isCollapsed ? "md:mr-20" : "md:mr-64") : (isCollapsed ? "md:ml-20" : "md:ml-64")}`}>
                {children}
            </div>
        </>
    )
}
