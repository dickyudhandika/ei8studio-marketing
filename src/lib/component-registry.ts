/**
 * Component Registry — auto-discovers available components
 * from the design system + local components directory.
 */

export interface ComponentDef {
  key: string;
  name: string;
  type: "react" | "astro";
  source: "design-system" | "local";
  importPath: string;
}

// Design system components (from ei8studio-design-system/src/index.ts)
const DESIGN_SYSTEM_COMPONENTS: ComponentDef[] = [
  {
    key: "Hero",
    name: "Hero Section",
    type: "react",
    source: "design-system",
    importPath: "ei8studio-design-system",
  },
  {
    key: "Card",
    name: "Card",
    type: "react",
    source: "design-system",
    importPath: "ei8studio-design-system",
  },
];

// Local components (scanned from src/components/)
const LOCAL_COMPONENTS: ComponentDef[] = [
  {
    key: "Hero",
    name: "Hero Section",
    type: "react",
    source: "local",
    importPath: "../components/Hero",
  },
  {
    key: "CTA",
    name: "Call to Action",
    type: "astro",
    source: "local",
    importPath: "../components/CTA",
  },
];

export function getRegistry(): ComponentDef[] {
  // Deduplicate — local overrides design-system
  const seen = new Set<string>();
  const result: ComponentDef[] = [];

  for (const comp of LOCAL_COMPONENTS) {
    if (!seen.has(comp.key)) {
      seen.add(comp.key);
      result.push(comp);
    }
  }
  for (const comp of DESIGN_SYSTEM_COMPONENTS) {
    if (!seen.has(comp.key)) {
      seen.add(comp.key);
      result.push(comp);
    }
  }

  return result;
}

export function findComponent(key: string): ComponentDef | undefined {
  return getRegistry().find((c) => c.key === key);
}
