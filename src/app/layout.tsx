import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jetbrains-mono'
})

export const metadata: Metadata = {
  title: 'BEL OUARRAQ MOHAMMED - Portfolio',
  description: 'Final-year Computer Engineering Student & DevOps & Cloud Enthusiast - Interactive macOS-style portfolio',
  keywords: 'portfolio, devops, cloud, kubernetes, docker, computer engineering, student',
  authors: [{ name: 'BEL OUARRAQ MOHAMMED' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>
        {children}
      </body>
    </html>
  )
}
