import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}
