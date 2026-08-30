import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Heart, ShieldCheck, TrendingUp, Bone, Apple } from "lucide-react";

function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      {/* Warm circle backdrop */}
      <circle cx="240" cy="240" r="210" fill="#F5ECE5" />
      <circle cx="240" cy="240" r="170" fill="#ECDDD3" fillOpacity="0.6" />

      {/* Yoga / strength pose figure */}
      {/* Head */}
      <circle cx="240" cy="120" r="28" fill="#D4857A" />
      {/* Hair */}
      <path d="M212 115 Q215 85 240 82 Q265 85 268 115 Q268 100 260 95 Q250 90 240 92 Q230 90 220 95 Q212 100 212 115Z" fill="#5C4545" />
      {/* Neck */}
      <rect x="234" y="148" width="12" height="14" rx="4" fill="#E8A87C" />
      {/* Torso - tank top */}
      <path d="M218 162 Q222 155 240 155 Q258 155 262 162 L268 220 Q254 226 240 226 Q226 226 212 220Z" fill="#D4857A" />
      {/* Sports bra neckline detail */}
      <path d="M222 162 Q230 158 240 158 Q250 158 258 162" stroke="#C47068" strokeWidth="2" fill="none" />
      {/* Arms - warrior pose extended */}
      {/* Left arm */}
      <path d="M218 168 L148 178 L120 176" stroke="#E8A87C" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Left hand */}
      <circle cx="118" cy="176" r="7" fill="#E8A87C" />
      {/* Right arm */}
      <path d="M262 168 L332 178 L360 176" stroke="#E8A87C" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Right hand with dumbbell */}
      <circle cx="362" cy="176" r="7" fill="#E8A87C" />
      {/* Dumbbell */}
      <rect x="350" y="160" width="24" height="6" rx="3" fill="#8A7272" />
      <rect x="348" y="156" width="8" height="14" rx="2" fill="#5C4545" />
      <rect x="370" y="156" width="8" height="14" rx="2" fill="#5C4545" />

      {/* Leggings */}
      <path d="M212 220 L218 226 L208 310 L195 370 L210 372 L225 312 L240 260 L255 312 L270 372 L285 370 L272 310 L262 226 L268 220Z" fill="#5C4545" />
      {/* Shoe left */}
      <path d="M195 370 Q190 378 188 382 Q186 388 200 390 L214 388 Q214 380 210 372Z" fill="#D4857A" />
      {/* Shoe right */}
      <path d="M285 370 Q290 378 292 382 Q294 388 280 390 L266 388 Q266 380 270 372Z" fill="#D4857A" />

      {/* Decorative elements */}
      {/* Energy sparkles */}
      <circle cx="140" cy="140" r="4" fill="#E8A87C" fillOpacity="0.8" />
      <circle cx="340" cy="130" r="3" fill="#D4857A" fillOpacity="0.6" />
      <circle cx="160" cy="260" r="5" fill="#7BAE7E" fillOpacity="0.5" />
      <circle cx="320" cy="280" r="4" fill="#E8A87C" fillOpacity="0.7" />
      <circle cx="380" cy="220" r="3" fill="#7BAE7E" fillOpacity="0.4" />
      <circle cx="100" cy="220" r="3" fill="#D4857A" fillOpacity="0.5" />

      {/* Small star accents */}
      <path d="M155 100 L157 106 L163 106 L158 110 L160 116 L155 112 L150 116 L152 110 L147 106 L153 106Z" fill="#E8A87C" fillOpacity="0.7" />
      <path d="M330 100 L332 106 L338 106 L333 110 L335 116 L330 112 L325 116 L327 110 L322 106 L328 106Z" fill="#7BAE7E" fillOpacity="0.6" />

      {/* Ground / mat */}
      <ellipse cx="240" cy="392" rx="100" ry="8" fill="#D4857A" fillOpacity="0.2" />
    </svg>
  );
}

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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F9E4D4] via-[#FDF0E8] to-[#F5E1EE]">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#E8A87C]/15 blur-3xl" />
          <div className="absolute top-40 -left-32 w-80 h-80 rounded-full bg-[#D4857A]/10 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-[#7BAE7E]/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
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
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/60 backdrop-blur-sm">
                    View plans
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-[380px] h-[380px]">
                <HeroIllustration />
              </div>
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
      <section className="py-20 bg-gradient-to-br from-[#F5ECE5] via-card to-[#F0E6DE]">
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
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#F9E4D4] via-[#FDF0E8] to-[#F5E1EE]">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#D4857A]/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#E8A87C]/10 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            One membership. Full access.
          </h2>
          <p className="text-muted-foreground mb-2 max-w-md mx-auto">
            $14.99/month or $114/year (best value).
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
