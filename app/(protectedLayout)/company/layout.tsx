"use client";
import CompanyNavbar from '@/app/components/CompanyLayout/CompanyNavbar/CompanyNavbar'
import { useLang } from '@/app/Hooks/LangHook/LangHook';
import React from 'react'
type Props = {
    children: React.ReactNode
}
export default function CompanyLayout({ children }: Props) {
    const { lang } = useLang()
    const isRTL = lang === "ar"

    return (
        <>
            <CompanyNavbar />
            {/* on desktop push content past the sidebar; on mobile push below the topbar */}
            <div className={`pt-16 md:pt-0 ${isRTL ? "md:mr-64" : "md:ml-64"}`}>
                {children}
            </div>
        </>
    )
}
