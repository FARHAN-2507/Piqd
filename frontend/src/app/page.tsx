import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Upload, Wand2, Download, ArrowRight, Star, Play, Instagram, Twitter, Mail, Menu, X, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-5/30 to-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-yellow-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">Piqd</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/upload" className="font-semibold text-gray-600 hover:text-yellow-600 transition-colors">
                Upload
              </Link>
              <Link href="/#how-it-works" className="font-semibold text-gray-600 hover:text-yellow-600 transition-colors">
                How It Works
              </Link>
              <Link href="/#features" className="font-semibold text-gray-600 hover:text-yellow-600 transition-colors">
                Features
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-lg hidden sm:flex">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="btn-primary text-lg">Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-100 rounded-full mb-8">
            <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-bold text-yellow-700">AI-Powered Photo Curation</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900">
            Perfect Photo Dumps
            <span className="block bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Upload any number of photos, get your best shots curated with AI, and receive ready-to-post captions in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" className="btn-primary text-xl px-12 py-7">
                Start Free
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-yellow-300 font-bold">
                Continue
              </Button>
            </Link>
          </div>
        </section>

        {/* Demo Video Section */}
        <section className="py-16" id="how-it-works">
          <Card className="border-3 border-yellow-200 shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Play className="h-10 w-10 text-yellow-500 ml-1" />
                </div>
                <h3 className="text-2xl font-extrabold mb-3">See How It Works</h3>
                <p className="text-gray-600 font-medium">Watch the 30-second demo</p>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h4 className="font-extrabold mb-1">1. Upload</h4>
                  <p className="text-sm text-gray-500">Drop your photos</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h4 className="font-extrabold mb-1">2. AI Magic</h4>
                  <p className="text-sm text-gray-500">We analyze & select</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Download className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h4 className="font-extrabold mb-1">3. Download</h4>
                  <p className="text-sm text-gray-500">Get best shots + captions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="py-16" id="features">
          <h3 className="text-3xl md:text-4xl font-extrabold text-center mb-12">Why Piqd?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-yellow-100 hover:border-yellow-300 card-modern">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-3">
                  <Upload className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-xl font-extrabold">No Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-medium">Upload any number of photos - 1 or 1000, we process them all!</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-100 hover:border-yellow-300 card-modern">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-3">
                  <Wand2 className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-xl font-extrabold">Smart AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-medium">Detects blur, selects best colors, ensures variety in your dump</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-100 hover:border-yellow-300 card-modern">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-3">
                  <Sparkles className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-xl font-extrabold">Auto Captions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-medium">Get 3 ready-to-post captions with hashtags automatically</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sample Results */}
        <section className="py-16">
          <h3 className="text-3xl font-extrabold text-center mb-12">Sample Results</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-yellow-200 overflow-hidden">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="font-extrabold">Before: 50+ Photos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <p className="text-gray-400 font-medium">Mixed photos uploaded</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-200 overflow-hidden">
              <CardHeader className="bg-green-50">
                <CardTitle className="font-extrabold">After: 6-9 Best Shots</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <p className="text-green-600 font-medium">Curated selection</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20">
          <h3 className="text-3xl font-extrabold mb-8">Ready to create your perfect dump?</h3>
          <Link href="/upload">
            <Button size="lg" className="btn-primary text-xl px-14 py-8">
              Start Now - It's Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-extrabold">Piqd</span>
              </div>
              <p className="text-gray-400 font-medium">AI-Powered Photo Dump Curator</p>
            </div>
            <div>
              <h4 className="font-extrabold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/upload" className="text-gray-400 hover:text-yellow-400 transition-colors">Upload</Link></li>
                <li><Link href="/#how-it-works" className="text-gray-400 hover:text-yellow-400 transition-colors">How It Works</Link></li>
                <li><Link href="/#features" className="text-gray-400 hover:text-yellow-400 transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 font-medium">
            © 2024 Piqd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}