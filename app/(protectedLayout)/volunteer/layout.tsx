import React from 'react'
import VolunteerClientLayout from './VolunteerClientLayout';
import { Metadata } from 'next';
import { SidebarProvider } from '@/app/Context/SidebarContext';

type Props = {
    children: React.ReactNode
}

export const metadata: Metadata = {
    title: "Volunteer",
    description: "Awn platform for volunteering and community service",
};

export default function VolunteerLayout({ children }: Props) {


    return (
        <SidebarProvider>
            <VolunteerClientLayout>
                {children}
            </VolunteerClientLayout>
        </SidebarProvider>
    )
}
