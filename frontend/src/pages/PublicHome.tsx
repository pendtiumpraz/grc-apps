import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const inter = Inter({ subsets: ['latin'] })

export default function PublicHomePage() {
  const [activeTab, setActiveTab] = useState('home')

  const slides = [
    {
      id: 1,
      title: "Welcome to KOMPL.AI",
      subtitle: "Enterprise Governance, Risk, and Compliance Platform",
      description: "Transform your compliance operations with AI-powered automation and intelligent insights",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&h=600&fit=crop&crop=entropy&auto=format",
      buttonText: "Get Started"
    },
    {
      id: 2,
      title: "AI-Powered Compliance",
      subtitle: "Automate Regulatory Compliance",
      description: "Leverage AI to automate compliance processes, reduce manual work by 80%, and ensure regulatory adherence",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&h=600&fit=crop&crop=entropy&auto=format",
      buttonText: "Learn More"
    },
    {
      id: 3,
      title: "Multi-Tenant Architecture",
      subtitle: "Secure and Scalable",
      description: "Enterprise-grade multi-tenant architecture with complete data isolation and role-based access control",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&h=600&fit=crop&crop=entropy&auto=format",
      buttonText: "Explore Features"
    },
    {
      id: 4,
      title: "Comprehensive GRC Domains",
      subtitle: "All-in-One Solution",
      description: "RegOps, PrivacyOps, RiskOps, and AuditOps - complete governance, risk, and compliance coverage",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&h=600&fit=crop&crop=entropy&auto=format",
      buttonText: "View Solutions"
    }
  ]

  const handleScroll = (direction: 'up' | 'down') => {
    const slideContainer = document.getElementById('slide-container')
    if (slideContainer) {
      const currentSlide = parseInt(slideContainer.getAttribute('data-current-slide') || '0')
      if (direction === 'down' && currentSlide < slides.length - 1) {
        slideContainer.setAttribute('data-current-slide', String(currentSlide + 1))
      } else if (direction === 'up' && currentSlide > 0) {
        slideContainer.setAttribute('data-current-slide', String(currentSlide - 1))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" onWheel={(e) => {
      if (e.deltaY > 0) {
        handleScroll('down')
      } else {
        handleScroll('up')
      }
    }}>
      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">KOMPL.AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Solutions</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Login
              </button>
              <button className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide Container */}
      <div id="slide-container" data-current-slide="0" className="pt-16">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`min-h-screen flex items-center justify-center transition-all duration-700 ease-in-out ${
              index === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="text-center text-white px-4 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{slide.title}</h1>
              <p className="text-2xl md:text-3xl mb-8">{slide.subtitle}</p>
              <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">{slide.description}</p>
              <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors transform hover:scale-105 transition-transform">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const slideContainer = document.getElementById('slide-container')
              if (slideContainer) {
                slideContainer.setAttribute('data-current-slide', String(index))
              }
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === 0 ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}