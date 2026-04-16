/**
 * POST /api/sync — re-scan design system + local components
 * Returns updated component registry.
 */
import type { APIRoute } from "astro";
import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve } from "path";

export const prerender = false;

const PROJECT_ROOT = resolve(process.cwd());
const DS_ROOT = resolve(PROJECT_ROOT, "../ei8studio-design-system");
const LOCAL_COMPONENTS = resolve(PROJECT_ROOT, "src/components");

interface ComponentDef {
  key: string;
  name: string;
  type: "react" | "astro";
  source: "design-system" | "local";
  importPath: string;
}

export const GET: APIRoute = async () => {
  try {
    const components: ComponentDef[] = [];
    const seen = new Set<string>();

    // Scan local components
    if (existsSync(LOCAL_COMPONENTS)) {
      const files = readdirSync(LOCAL_COMPONENTS);
      for (const file of files) {
        const isTsx = file.endsWith(".tsx");
        const isAstro = file.endsWith(".astro");
        const isStory = file.includes(".stories.");

        if (isStory || (!isTsx && !isAstro)) continue;

        const key = file.replace(/\.(tsx|astro)$/, "");

        // Skip the canvas editor and page builder
        if (key === "CanvasEditor" || key === "PageBuilder") continue;

        // Convert PascalCase to display name
        const name = key.replace(/([A-Z])/g, " $1").trim();

        components.push({
          key,
          name,
          type: isTsx ? "react" : "astro",
          source: "local",
          importPath: `../components/${key}`,
        });
        seen.add(key);
      }
    }

    // Scan design system exports
    const dsIndexPath = resolve(DS_ROOT, "src/index.ts");
    if (existsSync(dsIndexPath)) {
      const indexContent = readFileSync(dsIndexPath, "utf-8");
      const exportRegex = /export\s+\{[^}]*?(\w+)[^}]*\}\s+from\s+["']\.\/components\/ui\/\w+["']/g;
      let match;

      while ((match = exportRegex.exec(indexContent)) !== null) {
        const key = match[1];
        // Skip types and variants
        if (key.includes("Props") || key.includes("Variants") || key === "type") continue;
        if (seen.has(key)) continue;

        const name = key.replace(/([A-Z])/g, " $1").trim();
        components.push({
          key,
          name,
          type: "react",
          source: "design-system",
          importPath: "ei8studio-design-system",
        });
      }
    }

    return new Response(JSON.stringify({ success: true, components }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
