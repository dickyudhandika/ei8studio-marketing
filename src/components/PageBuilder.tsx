"use client";

import { useState } from "react";
import { Button } from "ei8studio-design-system";
import { PAGE_TYPES, type PageType } from "../lib/page-types";
import { SECTION_MAP, type BusinessData } from "../lib/section-layouts";

const DEFAULT_DATA: BusinessData = {
  companyName: "",
  tagline: "",
  problemStatement: "",
  usps: [],
  targetAudience: "",
  ctaText: "",
  ctaLink: "",
};

export function PageBuilder() {
  // Step 1: page type
  const [pageType, setPageType] = useState<PageType | null>(null);

  // Step 2: free-form text
  const [businessText, setBusinessText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData>(DEFAULT_DATA);
  const [extracted, setExtracted] = useState(false);

  // Step 3: layout selections
  const [layouts, setLayouts] = useState<Record<string, string>>({});

  // Save state
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // ─── ACTIONS ─────────────────────────────────────────

  async function extractInfo() {
    if (!businessText.trim()) return;

    setExtracting(true);
    setStatus("Extracting business info...");

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: businessText }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setBusinessData(data.data);
        setExtracted(true);
        setStatus("Extracted! Preview updated below.");

        // Set default layouts
        if (pageType) {
          const defaults: Record<string, string> = {};
          pageType.sections.forEach((s) => {
            defaults[s.key] = s.defaultLayout;
          });
          setLayouts(defaults);
        }
      } else {
        setStatus("Extraction failed: " + (data.error || "unknown error"));
      }
    } catch {
      setStatus("Extraction failed — check your connection");
    }

    setExtracting(false);
  }

  function swapLayout(sectionKey: string, layoutKey: string) {
    setLayouts((prev) => ({ ...prev, [sectionKey]: layoutKey }));
  }

  async function saveToPage() {
    if (!pageType) return;

    setSaving(true);
    setStatus("Saving...");

    try {
      // Build sections config for the canvas API
      const sections = pageType.sections.map((s) => ({
        id: `${s.key}-1`,
        component: s.key,
        type: "react" as const,
        props: { layout: layouts[s.key] || s.defaultLayout, data: businessData },
      }));

      const gaps = pageType.sections.slice(0, -1).map(() => 48);

      const res = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: "index",
          sections,
          gaps,
          businessData,
          pageType: pageType.key,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("Saved to " + data.pagePath);
      } else {
        setStatus("Save failed: " + (data.error || "unknown"));
      }
    } catch {
      setStatus("Save failed");
    }

    setSaving(false);
  }

  // ─── RENDER ──────────────────────────────────────────

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left sidebar */}
      <aside className="w-80 border-r border-border overflow-y-auto">
        {/* Step 1: Page type */}
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Page Type
          </h2>
          <div className="space-y-2">
            {PAGE_TYPES.map((pt) => (
              <button
                key={pt.key}
                onClick={() => {
                  setPageType(pt);
                  setExtracted(false);
                  setBusinessData(DEFAULT_DATA);
                  const defaults: Record<string, string> = {};
                  pt.sections.forEach((s) => {
                    defaults[s.key] = s.defaultLayout;
                  });
                  setLayouts(defaults);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-sm ${
                  pageType?.key === pt.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div className="font-medium">{pt.name}</div>
                <div className={`text-xs mt-0.5 ${
                  pageType?.key === pt.key ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {pt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Business input */}
        {pageType && (
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Tell me about your business
            </h2>
            <textarea
              value={businessText}
              onChange={(e) => setBusinessText(e.target.value)}
              placeholder={`Write about ${pageType.name.toLowerCase()}...\n\nExample: "We are [company]. We help [audience] solve [problem] by [solution]. Our key strengths are [1], [2], [3]."`}
              className="w-full min-h-[160px] text-sm p-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <Button
              onClick={extractInfo}
              disabled={extracting || !businessText.trim()}
              className="w-full mt-3"
              size="sm"
            >
              {extracting ? "Extracting..." : "Extract & Preview"}
            </Button>

            {extracted && (
              <div className="mt-3 p-3 bg-muted rounded-md text-xs space-y-1">
                <div><span className="text-muted-foreground">Company:</span> {businessData.companyName}</div>
                <div><span className="text-muted-foreground">Tagline:</span> {businessData.tagline}</div>
                <div><span className="text-muted-foreground">Audience:</span> {businessData.targetAudience}</div>
                <div><span className="text-muted-foreground">USPs:</span> {businessData.usps.join(", ")}</div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Layout swapper */}
        {extracted && pageType && (
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Swap Layouts
            </h2>
            <div className="space-y-4">
              {pageType.sections.map((section) => (
                <div key={section.key}>
                  <div className="text-xs text-muted-foreground mb-1.5">{section.name}</div>
                  <div className="flex gap-1.5">
                    {section.layouts.map((layout) => (
                      <button
                        key={layout.key}
                        onClick={() => swapLayout(section.key, layout.key)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          (layouts[section.key] || section.defaultLayout) === layout.key
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {layout.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main preview area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-border p-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {pageType ? (
              <>
                <span className="font-mono text-foreground">/{pageType.key}</span>
                {" · "}
                {pageType.sections.length} sections
              </>
            ) : (
              "Pick a page type to start"
            )}
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <span className="text-xs text-muted-foreground">{status}</span>
            )}
            {extracted && (
              <Button
                onClick={saveToPage}
                disabled={saving}
                size="sm"
              >
                {saving ? "Saving..." : "Save to .astro"}
              </Button>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto">
          {!pageType ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg">Pick a page type</p>
                <p className="text-sm mt-1">Choose a template from the sidebar</p>
              </div>
            </div>
          ) : !extracted ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg">Tell me about your business</p>
                <p className="text-sm mt-1">Write in the sidebar, then click "Extract & Preview"</p>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              {pageType.sections.map((section) => {
                const Component = SECTION_MAP[section.key];
                if (!Component) return null;

                return (
                  <div key={section.key} className="group relative">
                    {/* Section label on hover */}
                    <div className="absolute top-2 left-4 px-2 py-0.5 bg-background border border-border rounded text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {section.name} · {layouts[section.key] || section.defaultLayout}
                    </div>
                    <Component
                      data={businessData}
                      layout={layouts[section.key] || section.defaultLayout}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
