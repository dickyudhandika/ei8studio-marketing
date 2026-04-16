/**
 * Section Layout Renderers — render section content in different layout variants.
 */
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "ei8studio-design-system";

export interface BusinessData {
  companyName: string;
  tagline: string;
  problemStatement: string;
  usps: string[];
  targetAudience: string;
  ctaText: string;
  ctaLink: string;
}

interface SectionProps {
  data: BusinessData;
  layout: string;
}

// ─── HERO ──────────────────────────────────────────────

export function HeroSection({ data, layout }: SectionProps) {
  if (layout === "split-left") {
    return (
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {data.companyName}
            </h1>
            <p className="text-xl text-muted-foreground">{data.tagline}</p>
            <div className="flex gap-4">
              <a href={data.ctaLink || "#"}>
                <Button size="lg">{data.ctaText || "Get Started"}</Button>
              </a>
            </div>
          </div>
          <div className="bg-muted rounded-lg aspect-video flex items-center justify-center text-muted-foreground">
            Image placeholder
          </div>
        </div>
      </section>
    );
  }

  // Default: centered
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {data.companyName}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {data.tagline}
        </p>
        <div className="flex gap-4 justify-center">
          <a href={data.ctaLink || "#"}>
            <Button size="lg">{data.ctaText || "Get Started"}</Button>
          </a>
          <Button variant="outline" size="lg">Learn more</Button>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM ───────────────────────────────────────────

export function ProblemSection({ data, layout }: SectionProps) {
  if (layout === "icon-grid" && data.usps.length > 0) {
    return (
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-semibold text-center mb-4">The Problem</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            {data.problemStatement}
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {data.usps.map((usp, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-2 text-lg font-bold">
                    {i + 1}
                  </div>
                  <CardTitle className="text-lg">{usp}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: text-only
  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-4">The Problem</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {data.problemStatement}
        </p>
      </div>
    </section>
  );
}

// ─── FEATURES ──────────────────────────────────────────

export function FeaturesSection({ data, layout }: SectionProps) {
  if (layout === "alternating-rows") {
    return (
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">What We Offer</h2>
          <div className="space-y-16 max-w-4xl mx-auto">
            {data.usps.map((usp, i) => (
              <div key={i} className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 ? "md:direction-rtl" : ""}`}>
                <div className={`space-y-4 ${i % 2 ? "md:order-2" : ""}`}>
                  <div className="text-sm text-primary font-medium">Feature {i + 1}</div>
                  <h3 className="text-2xl font-semibold">{usp}</h3>
                </div>
                <div className={`bg-muted rounded-lg aspect-video flex items-center justify-center text-muted-foreground ${i % 2 ? "md:order-1" : ""}`}>
                  Image placeholder
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: 3-col-cards
  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {data.usps.map((usp, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">{usp}</CardTitle>
                <CardDescription>
                  {data.targetAudience
                    ? `Built for ${data.targetAudience}`
                    : "Feature description goes here"}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ──────────────────────────────────────────

export function ServicesSection({ data, layout }: SectionProps) {
  return <FeaturesSection data={data} layout={layout} />;
}

// ─── TESTIMONIALS ──────────────────────────────────────

export function TestimonialsSection({ data, layout }: SectionProps) {
  const quotes = [
    { text: "They delivered exactly what we needed, fast.", author: "Happy Client" },
    { text: "The best agency experience we've had.", author: "Another Client" },
    { text: "Professional, fast, and great results.", author: "Third Client" },
  ];

  if (layout === "single-featured") {
    return (
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8">What People Say</h2>
          <blockquote className="text-2xl text-muted-foreground italic mb-4">
            "{quotes[0].text}"
          </blockquote>
          <p className="text-sm text-muted-foreground">— {quotes[0].author}</p>
        </div>
      </section>
    );
  }

  // Default: 3-col-cards
  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">What People Say</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {quotes.map((q, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">"{q.text}"</p>
                <p className="text-sm font-medium">— {q.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOLUTION ──────────────────────────────────────────

export function SolutionSection({ data, layout }: SectionProps) {
  if (layout === "centered") {
    return (
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
          <h2 className="text-3xl font-semibold mb-4">Our Solution</h2>
          <p className="text-muted-foreground text-lg">{data.tagline}</p>
        </div>
      </section>
    );
  }

  // Default: split-left
  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Our Solution</h2>
            <p className="text-muted-foreground text-lg">{data.tagline}</p>
          </div>
          <div className="bg-muted rounded-lg aspect-video flex items-center justify-center text-muted-foreground">
            Image placeholder
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF ──────────────────────────────────────

export function SocialProofSection({ data, layout }: SectionProps) {
  if (layout === "logos") {
    return (
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground mb-8 uppercase tracking-wider">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center text-muted-foreground">
            {["Company A", "Company B", "Company C", "Company D"].map((name) => (
              <div key={name} className="text-lg font-semibold opacity-50">{name}</div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: stats
  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-primary">100+</div>
            <div className="text-sm text-muted-foreground mt-1">Projects delivered</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">40%</div>
            <div className="text-sm text-muted-foreground mt-1">Time saved</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground mt-1">Happy clients</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ───────────────────────────────────────────────

export function CTASection({ data, layout }: SectionProps) {
  if (layout === "compact") {
    return (
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-12 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Ready to start?</h2>
            <p className="text-sm text-muted-foreground">{data.tagline}</p>
          </div>
          <a href={data.ctaLink || "mailto:hello@example.com"}>
            <Button>{data.ctaText || "Get in touch"}</Button>
          </a>
        </div>
      </section>
    );
  }

  // Default: full-width
  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-3xl font-semibold">Ready to start?</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {data.tagline}
        </p>
        <a
          href={data.ctaLink || "mailto:hello@example.com"}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-11 px-8 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {data.ctaText || "Get in touch"}
        </a>
      </div>
    </section>
  );
}

// ─── SECTION MAP ───────────────────────────────────────

export const SECTION_MAP: Record<string, React.ComponentType<SectionProps>> = {
  hero: HeroSection,
  problem: ProblemSection,
  features: FeaturesSection,
  services: ServicesSection,
  testimonials: TestimonialsSection,
  solution: SolutionSection,
  "social-proof": SocialProofSection,
  cta: CTASection,
};
