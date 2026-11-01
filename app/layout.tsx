'use client'

import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-[#070708]">
      <body className="h-full m-0 p-0 bg-[#070708] text-zinc-100 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
