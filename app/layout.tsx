import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Babua Hub | 90 Days Pattern DSA Mastery",
  description: "Master the Babua 90-day pattern-based DSA roadmap. The elite registry for engineering mastery, system design, and distributed protocols. No courses, just proof of work.",
  keywords: ["Babua DSA", "90 Days Pattern", "Pattern DSA", "Babua Hub", "Engineering Mastery", "System Design", "Low Level Design", "Distributed Systems", "90 Days Plan", "Pattern Based Learning"],
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

import { ProblemsProvider } from "@/components/problems-provider"
import { getProblems } from "@/lib/problems"
import { Toaster } from "@/components/ui/sonner"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const problems = await getProblems()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <ProblemsProvider initialProblems={problems}>
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ProblemsProvider>
      </body>
    </html>
  )
}
