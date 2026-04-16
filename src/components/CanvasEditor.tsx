"use client";

import { useState, useEffect, useRef } from "react";
import { Hero } from "./Hero";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label } from "ei8studio-design-system";

// Map component keys to actual React components
const COMPONENT_MAP: Record<string, React.ComponentType<Record<string, unknown>>> = {
  Hero: Hero as React.ComponentType<Record<string, unknown>>,
  Button: Button as React.ComponentType<Record<string, unknown>>,
  Card: Card as React.ComponentType<Record<string, unknown>>,
  Input: Input as React.ComponentType<Record<string, unknown>>,
  Label: Label as React.ComponentType<Record<string, unknown>>,
};

// Wrap design system components with demo content so they render nicely
const COMPONENT_DEMOS: Record<string, () => React.ReactNode> = {
  Hero: () => <Hero />,
  Button: () => (
    <div className="p-8 text-center">
      <div className="flex gap-4 justify-center">
        <Button size="lg">Primary</Button>
        <Button variant="outline" size="lg">Outline</Button>
      </div>
    </div>
  ),
  Card: () => (
    <div className="p-8 flex justify-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Card content</p>
        </CardContent>
      </Card>
    </div>
  ),
  Input: () => (
    <div className="p-8 flex justify-center">
      <div className="w-80 space-y-2">
        <Label>Email</Label>
        <Input placeholder="you@example.com" />
      </div>
    </div>
  ),
  Label: () => (
    <div className="p-8 text-center">
      <Label>Example Label</Label>
    </div>
  ),
};

interface Section {
  id: string;
  component: string;
  type: "react" | "astro";
  props: Record<string, unknown>;
}

interface ComponentDef {
  key: string;
  name: string;
  type: "react" | "astro";
  source: "design-system" | "local";
  importPath: string;
}

interface CanvasConfig {
  pages: Record<string, {
    sections: Section[];
    gaps: number[];
    target: string;
  }>;
}

export function CanvasEditor({ page = "index" }: { page?: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [gaps, setGaps] = useState<number[]>([]);
  const [registry, setRegistry] = useState<ComponentDef[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState("");
  const dragOverIndex = useRef<number | null>(null);

  // Load config on mount
  useEffect(() => {
    loadConfig();
    syncRegistry();
  }, []);

  async function loadConfig() {
    try {
      const res = await fetch("/api/canvas");
      const config: CanvasConfig = await res.json();
      const pageConfig = config.pages?.[page];
      if (pageConfig) {
        setSections(pageConfig.sections);
        setGaps(pageConfig.gaps);
      }
    } catch {
      setStatus("Failed to load config");
    }
  }

  async function syncRegistry() {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync");
      const data = await res.json();
      if (data.components) {
        setRegistry(data.components);
        setStatus(`Synced ${data.components.length} components`);
      }
    } catch {
      setStatus("Sync failed");
    }
    setSyncing(false);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, sections, gaps }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Saved! Page updated at " + data.pagePath);
      }
    } catch {
      setStatus("Save failed");
    }
    setSaving(false);
  }

  // Drag handlers
  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex.current = index;
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      return;
    }

    const newSections = [...sections];
    const [moved] = newSections.splice(dragIndex, 1);
    newSections.splice(index, 0, moved);

    // Rebuild gaps to match new order
    const newGaps: number[] = [];
    for (let i = 0; i < newSections.length - 1; i++) {
      newGaps.push(gaps[i] ?? 48);
    }

    setSections(newSections);
    setGaps(newGaps);
    setDragIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    dragOverIndex.current = null;
  }

  // Gap controls
  function updateGap(index: number, value: number) {
    const newGaps = [...gaps];
    newGaps[index] = value;
    setGaps(newGaps);
  }

  // Add component from registry
  function addComponent(comp: ComponentDef) {
    const newSection: Section = {
      id: `${comp.key}-${Date.now()}`,
      component: comp.key,
      type: comp.type,
      props: {},
    };
    const newSections = [...sections, newSection];
    const newGaps = [...gaps, 48];
    setSections(newSections);
    setGaps(newGaps);
  }

  // Remove section
  function removeSection(index: number) {
    const newSections = sections.filter((_, i) => i !== index);
    const newGaps = gaps.filter((_, i) => i !== index);
    setSections(newSections);
    setGaps(newGaps);
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-4 overflow-y-auto">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Components
        </h2>
        <div className="space-y-2">
          {registry.map((comp) => (
            <button
              key={comp.key}
              onClick={() => addComponent(comp)}
              className="w-full text-left px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm"
            >
              <div className="font-medium">{comp.name}</div>
              <div className="text-xs text-muted-foreground">
                {comp.source} · {comp.type}
              </div>
            </button>
          ))}
        </div>

        <hr className="my-4 border-border" />

        <button
          onClick={syncRegistry}
          disabled={syncing}
          className="w-full px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "↻ Sync Components"}
        </button>
      </aside>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-border p-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Editing: <span className="font-mono text-foreground">/{page}</span>
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <span className="text-xs text-muted-foreground">{status}</span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Layout"}
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            {sections.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">No sections yet</p>
                <p className="text-sm mt-1">
                  Add components from the sidebar to get started
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {sections.map((section, index) => (
                  <div key={section.id}>
                    {/* Gap control */}
                    {index > 0 && (
                      <div className="flex items-center justify-center py-2 group">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="128"
                            value={gaps[index - 1] ?? 48}
                            onChange={(e) =>
                              updateGap(index - 1, Number(e.target.value))
                            }
                            className="w-24 h-1 accent-primary"
                          />
                          <span className="text-xs text-muted-foreground font-mono w-8">
                            {gaps[index - 1] ?? 48}px
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Draggable section */}
                    <div
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`
                        relative group rounded-lg border-2 transition-all cursor-grab active:cursor-grabbing
                        ${
                          dragIndex === index
                            ? "border-primary opacity-50 scale-95"
                            : "border-transparent hover:border-border"
                        }
                      `}
                    >
                      {/* Section label */}
                      <div className="absolute -top-3 left-4 px-2 py-0.5 bg-background border border-border rounded text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {section.component} · {section.type}
                        <button
                          onClick={() => removeSection(index)}
                          className="ml-2 text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </div>

                      {/* Actual component preview */}
                      <div className="bg-muted/30 rounded-lg overflow-hidden">
                        {COMPONENT_DEMOS[section.component] ? (
                          COMPONENT_DEMOS[section.component]()
                        ) : (
                          <div className="p-8 text-center">
                            <div className="text-2xl font-semibold mb-2">
                              {section.component}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {section.type === "astro"
                                ? "🅰 Astro (preview unavailable — renders on save)"
                                : "⚛ React component"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
