/**
 * Page Writer — generates .astro page content from layout config.
 */

import { findComponent } from "./component-registry";

interface SectionConfig {
  id: string;
  component: string;
  type: "react" | "astro";
  props: Record<string, unknown>;
}

interface PageLayout {
  sections: SectionConfig[];
  gaps: number[];
}

export function generateAstroPage(layout: PageLayout): string {
  const imports: string[] = [];
  const body: string[] = [];

  // Collect unique imports
  const imported = new Set<string>();

  for (const section of layout.sections) {
    const def = findComponent(section.component);
    if (!def) continue;

    if (def.type === "react" && !imported.has(section.component)) {
      imports.push(
        `import { ${section.component} } from "${def.importPath}";`
      );
      imported.add(section.component);
    } else if (def.type === "astro" && !imported.has(section.component)) {
      imports.push(
        `import ${section.component} from "${def.importPath}.astro";`
      );
      imported.add(section.component);
    }
  }

  // Generate body with gaps
  for (let i = 0; i < layout.sections.length; i++) {
    const section = layout.sections[i];
    const def = findComponent(section.component);
    if (!def) continue;

    if (i > 0) {
      const gap = layout.gaps[i - 1] ?? 48;
      body.push(`    <div style="margin-top: ${gap}px">`);
    } else {
      body.push(`    <div>`);
    }

    if (def.type === "react") {
      body.push(`      <${section.component} client:load />`);
    } else {
      body.push(`      <${section.component} />`);
    }

    body.push(`    </div>`);
  }

  return `---
import BaseLayout from "../layouts/BaseLayout.astro";
${imports.join("\n")}
---

<BaseLayout title="ei8studio — Creative Digital Studio">
  <main>
${body.join("\n")}
  </main>

  <footer class="border-t border-border py-8">
    <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} ei8studio. Built with the ei8studio Design System.
    </div>
  </footer>
</BaseLayout>
`;
}
