"use client";
import VolunteerNavbar from '@/app/components/VolunteerLayout/VolunteerNavbar/VolunteerNavbar';
import { useLang } from '@/app/Hooks/LangHook/LangHook';
import React from 'react'
type Props = {
    children: React.ReactNode
}
export default function VolunteerClientLayout({ children }: Props) {
    const { lang } = useLang()
    const isRTL = lang === "ar"

    return (
        <>
            <VolunteerNavbar />
            <div className={`pt-16 md:pt-0 ${isRTL ? "md:mr-64" : "md:ml-64"}`}>
                {children}
            </div>
        </>
    )
}
