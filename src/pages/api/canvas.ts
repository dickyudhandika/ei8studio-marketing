/**
 * GET /api/canvas — load canvas config
 * POST /api/canvas — save canvas config + write page
 */
import type { APIRoute } from "astro";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { generateAstroPage } from "../../lib/page-writer";

export const prerender = false;

const PROJECT_ROOT = resolve(process.cwd());
const CONFIG_PATH = resolve(PROJECT_ROOT, "canvas.config.json");

export const GET: APIRoute = async () => {
  try {
    const config = readFileSync(CONFIG_PATH, "utf-8");
    return new Response(config, {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Config not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { page, sections, gaps } = body;

    // Read existing config
    let config: Record<string, unknown> = {};
    try {
      config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    } catch {
      config = { pages: {} };
    }

    // Update config
    const pages = (config as { pages: Record<string, unknown> }).pages || {};
    pages[page] = { sections, gaps, target: `src/pages/${page}.astro` };
    (config as { pages: Record<string, unknown> }).pages = pages;

    // Write config
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

    // Generate and write the .astro page
    const astroContent = generateAstroPage({ sections, gaps });
    const pagePath = resolve(PROJECT_ROOT, `src/pages/${page}.astro`);
    writeFileSync(pagePath, astroContent);

    return new Response(JSON.stringify({ success: true, pagePath }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
