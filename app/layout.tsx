import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent invisible text during font load
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Babua LMS",
  description: "Master the Babua LMS. The elite registry for engineering mastery, system design, and distributed protocols. No courses, just proof of work.",
  keywords: ["Babua LMS", "Babua DSA", "Babua Hub", "Engineering Mastery", "System Design", "Low Level Design", "Distributed Systems", "Coding Interview Preparation"],
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
      <head>
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://api.dicebear.com" />
      </head>
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
              "name": "Babua LMS",
              "description": "A comprehensive LMS for mastering data structures and algorithms.",
              "provider": {
                "@type": "Organization",
                "name": "Babua Hub",
                "sameAs": "https://aveshpathaklms.vercel.app/"
              },
              "courseCode": "BABUA-LMS",
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
