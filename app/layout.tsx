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
  title: "Babua DSA Sheet | 90 Days Pattern Mastery Roadmap",
  description: "Master the Babua DSA Sheet - a comprehensive 90-day pattern-based DSA roadmap. The elite registry for engineering mastery, system design, and distributed protocols. No courses, just proof of work.",
  keywords: ["Babua DSA Sheet", "Babua DSA", "90 Days Pattern", "Pattern DSA", "Babua Hub", "Engineering Mastery", "System Design", "Low Level Design", "Distributed Systems", "90 Days Plan", "Pattern Based Learning", "DSA Roadmap", "Coding Interview Preparation"],
  generator: "v0.app",
}

import { ProblemsProvider } from "@/components/problems-provider"
import { getProblems } from "@/lib/problems"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <ProblemsProvider initialProblems={[]}>
          {children}
          <Toaster />
        </ProblemsProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "Babua DSA Sheet",
              "description": "A comprehensive 90-day pattern-based DSA roadmap and sheet for mastering data structures and algorithms.",
              "provider": {
                "@type": "Organization",
                "name": "Babua Hub",
                "sameAs": "https://aveshpathaklms.vercel.app/"
              },
              "courseCode": "DSA-90",
              "educationalLevel": "Intermediate to Advanced"
            })
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
