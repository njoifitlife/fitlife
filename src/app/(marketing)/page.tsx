import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Heart, ShieldCheck, TrendingUp, Bone, Apple } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary tracking-tight">
            NjoiFitLife
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card to-background">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Designed for women 40+
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
              Your strongest chapter starts now
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Personalized fitness, nutrition, and bone health coaching built
              around your body&apos;s changing needs. Build strength, protect
              your bones, and feel your best — at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start your journey
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Built for your body, your goals, your life
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Every program is designed around the science of fitness after 40 —
              not adapted from a generic plan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Dumbbell className="h-5 w-5" />}
              title="Strength building"
              description="Resistance training that supports bone density and lean muscle — the two things that matter most after 40."
            />
            <FeatureCard
              icon={<Heart className="h-5 w-5" />}
              title="Joint-friendly options"
              description="Every workout includes low-impact alternatives. Train hard without the wear and tear."
            />
            <FeatureCard
              icon={<Bone className="h-5 w-5" />}
              title="Bone health focus"
              description="A dedicated hub connecting strength, weight-bearing activity, balance, and nutrition to support healthy aging."
            />
            <FeatureCard
              icon={<Apple className="h-5 w-5" />}
              title="Nutrition guidance"
              description="Personalized 7-day meal suggestions matched to your dietary preferences — no calorie counting required."
            />
            <FeatureCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Progress tracking"
              description="Log workouts, see your streaks, and celebrate every milestone along the way."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Safe &amp; evidence-based"
              description="General fitness and nutrition guidance — not medical advice. Your safety is always the priority."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-14">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Step
              number="1"
              title="Tell us about you"
              description="A short assessment about your goals, fitness level, schedule, and preferences. Takes about 5 minutes."
            />
            <Step
              number="2"
              title="Get your plan"
              description="We build a personalized 4-week workout and nutrition plan based on your answers — no guesswork."
            />
            <Step
              number="3"
              title="Follow along"
              description="Your dashboard shows today's workout, today's meal, and your progress. Just open the app and go."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-14">
            What our members say
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <TestimonialCard
              quote="I haven't felt this strong since my 30s. The modifications made it possible to start where I was, and the progression kept me challenged."
              name="Sarah M."
              detail="Age 47, 12 weeks in"
            />
            <TestimonialCard
              quote="Finally a program that understands my body. The bone health focus and joint-friendly options make all the difference."
              name="Jennifer R."
              detail="Age 52, 8 weeks in"
            />
            <TestimonialCard
              quote="The 10-minute workouts on busy days kept my streak alive. I've never been this consistent with any fitness program."
              name="Angela T."
              detail="Age 43, 16 weeks in"
            />
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            One membership. Full access.
          </h2>
          <p className="text-muted-foreground mb-2 max-w-md mx-auto">
            $14.99/month or $119/year (best value).
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
            Same features, same support — choose the billing that works for you.
          </p>
          <Link href="/pricing">
            <Button size="lg">See pricing</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 NjoiFitLife. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground max-w-md text-center md:text-right">
              NjoiFitLife provides general fitness and nutrition information and
              is not medical care. Consult a healthcare professional before
              beginning any exercise program.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  detail,
}: {
  quote: string;
  name: string;
  detail: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
            {name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{detail}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
