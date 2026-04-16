/**
 * Page Type Definitions — pre-built section structures for marketing pages.
 */

export interface SectionLayout {
  key: string;
  name: string;
}

export interface SectionType {
  key: string;
  name: string;
  layouts: SectionLayout[];
  defaultLayout: string;
}

export interface PageType {
  key: string;
  name: string;
  description: string;
  sections: SectionType[];
}

export const PAGE_TYPES: PageType[] = [
  {
    key: "saas-landing",
    name: "SaaS Landing",
    description: "Classic product page — hero, problem, features, CTA",
    sections: [
      {
        key: "hero",
        name: "Hero",
        defaultLayout: "centered",
        layouts: [
          { key: "centered", name: "Centered" },
          { key: "split-left", name: "Split Left" },
        ],
      },
      {
        key: "problem",
        name: "Problem",
        defaultLayout: "text-only",
        layouts: [
          { key: "text-only", name: "Text Only" },
          { key: "icon-grid", name: "Icon Grid" },
        ],
      },
      {
        key: "features",
        name: "Features",
        defaultLayout: "3-col-cards",
        layouts: [
          { key: "3-col-cards", name: "3-Column Cards" },
          { key: "alternating-rows", name: "Alternating Rows" },
        ],
      },
      {
        key: "cta",
        name: "Call to Action",
        defaultLayout: "full-width",
        layouts: [
          { key: "full-width", name: "Full Width" },
          { key: "compact", name: "Compact" },
        ],
      },
    ],
  },
  {
    key: "agency-site",
    name: "Agency Site",
    description: "Service showcase — hero, services, testimonials, CTA",
    sections: [
      {
        key: "hero",
        name: "Hero",
        defaultLayout: "centered",
        layouts: [
          { key: "centered", name: "Centered" },
          { key: "split-left", name: "Split Left" },
        ],
      },
      {
        key: "services",
        name: "Services",
        defaultLayout: "3-col-cards",
        layouts: [
          { key: "3-col-cards", name: "3-Column Cards" },
          { key: "alternating-rows", name: "Alternating Rows" },
        ],
      },
      {
        key: "testimonials",
        name: "Testimonials",
        defaultLayout: "3-col-cards",
        layouts: [
          { key: "3-col-cards", name: "3-Column Cards" },
          { key: "single-featured", name: "Single Featured" },
        ],
      },
      {
        key: "cta",
        name: "Call to Action",
        defaultLayout: "full-width",
        layouts: [
          { key: "full-width", name: "Full Width" },
          { key: "compact", name: "Compact" },
        ],
      },
    ],
  },
  {
    key: "product-launch",
    name: "Product Launch",
    description: "Build hype — hero, problem, solution, social proof, CTA",
    sections: [
      {
        key: "hero",
        name: "Hero",
        defaultLayout: "centered",
        layouts: [
          { key: "centered", name: "Centered" },
          { key: "split-left", name: "Split Left" },
        ],
      },
      {
        key: "problem",
        name: "Problem",
        defaultLayout: "text-only",
        layouts: [
          { key: "text-only", name: "Text Only" },
          { key: "icon-grid", name: "Icon Grid" },
        ],
      },
      {
        key: "solution",
        name: "Solution",
        defaultLayout: "split-left",
        layouts: [
          { key: "split-left", name: "Split Left" },
          { key: "centered", name: "Centered" },
        ],
      },
      {
        key: "social-proof",
        name: "Social Proof",
        defaultLayout: "stats",
        layouts: [
          { key: "stats", name: "Stats" },
          { key: "logos", name: "Logos" },
        ],
      },
      {
        key: "cta",
        name: "Call to Action",
        defaultLayout: "full-width",
        layouts: [
          { key: "full-width", name: "Full Width" },
          { key: "compact", name: "Compact" },
        ],
      },
    ],
  },
];

export function getPageType(key: string): PageType | undefined {
  return PAGE_TYPES.find((p) => p.key === key);
}
