import React from 'react'
import CompanyClientLayout from './CompanyClientLayout'
import { Metadata } from 'next';
import { SidebarProvider } from '@/app/Context/SidebarContext';

type Props = {
    children: React.ReactNode
}

export const metadata: Metadata = {
    title: "Company",
    description: "Awn platform for volunteering and community service",
};

export default function CompanyLayout({ children }: Props) {
    return (
        <SidebarProvider>
            <CompanyClientLayout>
                {children}
            </CompanyClientLayout>
        </SidebarProvider>
    )
}
