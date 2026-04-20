import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Upload, MessageSquare, Download } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Piqd</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto py-16">
        <section className="text-center py-16">
          <h2 className="text-5xl font-bold mb-6">
            Perfect Photo Dumps
            <span className="text-primary"> Effortlessly</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload 15-200 photos, get 6-9 curated best shots, and 3 ready-to-post captions in under 2 minutes.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Free
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 py-16">
          <FeatureCard
            icon={<Upload className="h-8 w-8" />}
            title="Upload Photos"
            description="Drag and drop 15-200 photos from your device"
          />
          <FeatureCard
            icon={<Sparkles className="h-8 w-8" />}
            title="AI Curation"
            description="Smart selection picks the best photos that look great together"
          />
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8" />}
            title="Auto Captions"
            description="Get 3 ready-to-post captions in different tones"
          />
        </section>

        <section className="py-16">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Three simple steps to your perfect photo dump</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Upload Your Photos</h4>
                  <p className="text-muted-foreground">Select 15-200 photos from your camera roll</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Auto-Curation</h4>
                  <p className="text-muted-foreground">AI selects 6-9 photos that work well together</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Download & Post</h4>
                  <p className="text-muted-foreground">Get numbered photos and captions ready for Instagram</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="text-center py-16">
          <h3 className="text-2xl font-bold mb-4">Ready to create your photo dump?</h3>
          <Link href="/signup">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </section>
      </main>

      <footer className="container mx-auto py-8 text-center text-muted-foreground">
        <p>Piqd - Photo Dump Curator</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}