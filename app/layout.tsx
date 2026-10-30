import './globals.css'
import type { Metadata } from 'react'

export const metadata: Metadata = {
  title: 'ID Logistics Canada - Site Operations Platform',
  description: 'Centralized Site Operations & Facility Management Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-zinc-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
