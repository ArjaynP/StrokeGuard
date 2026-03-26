import type { Metadata, Viewport } from 'next'
import { DM_Sans, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700'],
})

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'StrokeGuard | ML-Powered Stroke Risk Assessment',
  description: 'StrokeGuard uses a custom-trained neural network to assess your stroke risk based on clinical and lifestyle factors. Early detection saves lives.',
  keywords: ['stroke', 'risk assessment', 'machine learning', 'health', 'medical', 'AI'],
  icons: {
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${dmSans.variable} ${sora.variable} font-sans antialiased min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
