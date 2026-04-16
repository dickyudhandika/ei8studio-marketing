import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "ei8studio-design-system";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          We build digital
          <span className="text-primary"> experiences</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          ei8studio crafts websites, design systems, and creative tools that
          actually ship. No fluff, just good work.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Get in touch</Button>
          <Button variant="outline" size="lg">Our work</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Design Systems</CardTitle>
            <CardDescription>
              Token-driven, component-first. Build once, scale everywhere.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Web Development</CardTitle>
            <CardDescription>
              Next.js, Astro, and modern tooling. Fast, accessible, beautiful.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Creative Tools</CardTitle>
            <CardDescription>
              Internal tools, automations, and prototypes that save time.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}
