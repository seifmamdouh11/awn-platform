import type { Metadata } from "next";
import { Noto_Sans_Arabic, Poppins } from "next/font/google";
import "./globals.css";
import LangProvider from "./Hooks/LangHook/LangHook";
import MainClientLayout from "./MainClientLayout";
import ThemeProvider from "./Hooks/ThemeHook/ThemeProvider";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-en",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-ar",
});

export const metadata: Metadata = {
  title: {
    default: "Awn | عون",
    template: "%s | Awn"
  },
  description: "Awn platform for volunteering and community service",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${notoArabic.variable} antialiased min-h-[100dvh] overflow-hidden`}>
        <div id="main-scroller" className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden">
          <LangProvider>
            <MainClientLayout>
              <ThemeProvider>
                {children}
                <ScrollToTopButton />
              </ThemeProvider>
            </MainClientLayout>
          </LangProvider>
        </div>
      </body>
    </html>
  );
}