import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Upload, Wand2, Download, ArrowRight, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-5/30 to-white">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Piqd</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-bold text-lg">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="btn-primary text-lg">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center py-24">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-100 rounded-full mb-8">
            <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-bold text-yellow-700">AI-Powered Photo Curation</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-gray-900">
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
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-3 border-yellow-300 font-bold">
                Continue
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 py-16">
          <Card className="border-2 border-yellow-100 hover:border-yellow-300 card-modern">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-3">
                <Upload className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-xl font-extrabold">Upload Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 font-medium">Drag & drop any number of photos - no limits!</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-100 hover:border-yellow-300 card-modern">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-3">
                <Wand2 className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-xl font-extrabold">AI Curation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 font-medium">Smart filters select the best shots automatically</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-100 hover:border-yellow-300 card-modern">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-3">
                <Download className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-xl font-extrabold">Get Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 font-medium">Download curated photos with matching captions</p>
            </CardContent>
          </Card>
        </section>

        <section className="py-16">
          <Card className="border-2 border-yellow-200 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
              <CardTitle className="text-2xl font-extrabold">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl shadow-lg shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-extrabold mb-2">Upload Your Photos</h4>
                  <p className="text-gray-600 font-medium">Drag and drop any number of photos - we accept all of them!</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl shadow-lg shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-extrabold mb-2">AI Processing</h4>
                  <p className="text-gray-600 font-medium">Our algorithms analyze each photo for quality, blur, colors, and variety</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl shadow-lg shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-extrabold mb-2">Get Best Shots</h4>
                  <p className="text-gray-600 font-medium">Receive curated photos that look great together, ready to post</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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

      <footer className="container mx-auto py-10 text-center border-t border-yellow-100">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <span className="text-xl font-extrabold">Piqd</span>
        </div>
        <p className="text-gray-500 font-medium">AI-Powered Photo Dump Curator</p>
      </footer>
    </div>
  )
}