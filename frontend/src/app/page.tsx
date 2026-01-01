'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, CheckCircle, Zap, Lock, Globe, Users, Activity, Star, ChevronDown, ChevronUp, Clock, Award, TrendingUp, BarChart3, FileText, Search, MessageSquare, Database, Globe2, Check } from 'lucide-react';
import AnimatedGridBackground from '@/components/AnimatedGridBackground';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PublicHome() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Apa itu KOMPL.AI?",
      answer: "KOMPL.AI adalah platform Governance, Risk, dan Compliance (GRC) berbasis AI yang membantu perusahaan mengelola regulasi, risiko, privasi data, dan audit dalam satu platform terintegrasi."
    },
    {
      question: "Apakah platform ini cocok untuk perusahaan kecil?",
      answer: "Ya, KOMPL.AI dirancang untuk perusahaan dari segala ukuran. Kami menawarkan paket yang fleksibel sesuai kebutuhan bisnis Anda."
    },
    {
      question: "Bagaimana dengan keamanan data?",
      answer: "Kami menggunakan enkripsi AES-256-GCM, isolasi data multi-tenant, dan mematuhi standar ISO 27001, SOC 2, dan GDPR untuk memastikan keamanan data Anda."
    },
    {
      question: "Apakah ada dukungan teknis?",
      answer: "Ya, kami menyediakan dukungan teknis 24/7 melalui email, chat, dan telepon untuk semua paket berbayar."
    },
    {
      question: "Bagaimana cara memulai?",
      answer: "Anda dapat mendaftar untuk free trial 14 hari tanpa kartu kredit. Setelah itu, pilih paket yang sesuai dengan kebutuhan bisnis Anda."
    }
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "CTO, PT Teknologi Indonesia",
      content: "KOMPL.AI membantu kami mengurangi waktu compliance assessment dari 2 bulan menjadi 2 minggu. Sangat recommended!",
      rating: 5
    },
    {
      name: "Siti Rahayu",
      role: "Head of Compliance, Bank Nasional",
      content: "Platform ini sangat lengkap untuk manajemen regulasi dan risk. AI assistant-nya sangat membantu dalam analisis.",
      rating: 5
    },
    {
      name: "Ahmad Wijaya",
      role: "CISO, Perusahaan Fintech",
      content: "Security dan privacy management jadi jauh lebih mudah dengan KOMPL.AI. Dashboard-nya sangat informatif.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Multi-Tenant Architecture",
      description: "Manajemen multiple tenant dengan isolasi data yang aman dan scalable",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: Globe,
      title: "RegOps - Regulation Management",
      description: "Mapping regulasi, compliance assessment, dan policy management",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Lock,
      title: "PrivacyOps - Data Protection",
      description: "Data inventory, DSR automation, DPIA assessment",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Zap,
      title: "RiskOps - Risk Management",
      description: "Risk register, vulnerability management, vendor assessment",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Activity,
      title: "AuditOps - Audit & Governance",
      description: "Audit planning, evidence management, control testing",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Users,
      title: "AI-Powered Assistant",
      description: "Asisten AI cerdas untuk analisis, rekomendasi, dan auto-fill",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Database,
      title: "Document Management",
      description: "Generate, store, dan analisis dokumen dengan AI",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: BarChart3,
      title: "Real-time Monitoring",
      description: "Dashboard dengan charts dan real-time updates",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Search,
      title: "Advanced Search",
      description: "Cari dokumen, regulasi, dan data dengan cepat",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: MessageSquare,
      title: "Collaboration Tools",
      description: "Kolaborasi tim dengan comments dan notifications",
      color: "from-amber-500 to-yellow-600"
    },
    {
      icon: FileText,
      title: "Auto-Generated Reports",
      description: "Generate reports otomatis dalam berbagai format",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: Globe2,
      title: "Multi-Language Support",
      description: "Support Bahasa Indonesia dan English",
      color: "from-sky-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">KOMPL.AI</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Pricing
              </a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                FAQ
              </a>
              <Button
                onClick={() => scrollToSection('cta')}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 bg-[#0a0e1a]"
      >
        <AnimatedGridBackground />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-[#0a0e1a]/80 to-blue-900/10 z-10"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-6">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-semibold text-sm">AI-Powered GRC Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                Transformasi Manajemen<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Governance, Risk & Compliance
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Platform GRC terintegrasi dengan AI untuk manajemen risiko, kepatuhan regulasi, dan audit yang komprehensif. Hemat waktu hingga 80% dengan otomatisasi cerdas.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <Button
                  onClick={() => window.location.href = '/auth'}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/30"
                >
                  Mulai Free Trial 14 Hari
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => scrollToSection('demo')}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-xl transition-all"
                >
                  Jadwalkan Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">ISO 27001 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">GDPR Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">24/7 Support</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                  <p className="text-4xl font-bold text-white">500+</p>
                  <p className="text-gray-400 text-sm">Perusahaan</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                  <p className="text-4xl font-bold text-white">10K+</p>
                  <p className="text-gray-400 text-sm">Pengguna</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                  <p className="text-4xl font-bold text-white">99.9%</p>
                  <p className="text-gray-400 text-sm">Uptime</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                  <p className="text-4xl font-bold text-white">80%</p>
                  <p className="text-gray-400 text-sm">Waktu Terhemat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gray-900"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fitur Lengkap untuk Manajemen GRC
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk manajemen Governance, Risk, dan Compliance dalam satu platform terintegrasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 group">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 bg-gray-800"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Apa Kata Mereka?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Lihat apa yang dikatakan oleh pengguna kami tentang KOMPL.AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-gray-900"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Paket fleksibel untuk kebutuhan bisnis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
              <h3 className="text-white font-bold text-2xl mb-2">Starter</h3>
              <p className="text-gray-400 text-sm mb-6">Untuk tim kecil</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Rp 500K</span>
                <span className="text-gray-400 text-sm">/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Hingga 5 pengguna</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>RegOps & PrivacyOps</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Basic AI Assistant</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>10GB storage</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button
                onClick={() => window.location.href = '/auth'}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Pilih Starter
              </Button>
            </div>

            {/* Professional */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 backdrop-blur-sm border-2 border-cyan-500 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-white font-bold text-2xl mb-2">Professional</h3>
              <p className="text-gray-400 text-sm mb-6">Untuk bisnis menengah</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Rp 2.5M</span>
                <span className="text-gray-400 text-sm">/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Hingga 25 pengguna</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Semua domain modules</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Advanced AI Assistant</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>100GB storage</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button
                onClick={() => window.location.href = '/auth'}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Pilih Professional
              </Button>
            </div>

            {/* Enterprise */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
              <h3 className="text-white font-bold text-2xl mb-2">Enterprise</h3>
              <p className="text-gray-400 text-sm mb-6">Untuk perusahaan besar</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Unlimited pengguna</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Dedicated AI model</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Unlimited storage</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>24/7 dedicated support</span>
                </li>
              </ul>
              <Button
                onClick={() => window.location.href = '/contact'}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Hubungi Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-20 bg-gray-800"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang KOMPL.AI
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-white font-semibold">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="py-20 bg-gradient-to-br from-gray-900 to-gray-950"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap untuk Memulai?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Bergabung dengan 500+ perusahaan yang telah mempercayai platform kami untuk manajemen GRC yang komprehensif. Mulai free trial 14 hari tanpa kartu kredit.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => window.location.href = '/auth'}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/30"
              >
                Mulai Free Trial Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => window.location.href = '/contact'}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-xl transition-all"
              >
                Hubungi Sales
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-green-400" />
                <span className="text-gray-400 text-sm">ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-gray-400 text-sm">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="text-gray-400 text-sm">GDPR Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-gray-400 text-sm">80% Time Saved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">KOMPL.AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Platform GRC berbasis AI untuk manajemen risiko, kepatuhan regulasi, dan audit yang komprehensif.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm">Testimonials</a></li>
                <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                <li><a href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a></li>
                <li><a href="/compliance" className="text-gray-400 hover:text-white transition-colors text-sm">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 KOMPL.AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors text-sm">LinkedIn</a>
              <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
