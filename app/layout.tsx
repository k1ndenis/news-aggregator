import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News Aggregator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  )
}