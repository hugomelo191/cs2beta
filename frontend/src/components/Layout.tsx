import { ReactNode } from 'react'
import { Header } from './layout/header'
import { Footer } from './layout/footer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
} 