/**
 * POST /api/extract — extract structured business data from free-form text.
 * Uses OpenRouter to parse the input.
 */
import type { APIRoute } from "astro";

export const prerender = false;

const SYSTEM_PROMPT = `You are a business info extractor. Given free-form text about a company, extract structured data.

Return ONLY valid JSON, no markdown, no explanation.

JSON schema:
{
  "companyName": string,
  "tagline": string (one sentence pitch),
  "problemStatement": string (what pain they solve),
  "usps": string[] (2-3 key differentiators, each one short phrase),
  "targetAudience": string (who they serve),
  "ctaText": string (suggested call-to-action text like "Get Started" or "Book a Call"),
  "ctaLink": string (leave empty if not mentioned)
}

Rules:
- If something isn't mentioned, make a reasonable guess or use empty string
- Keep usps short — each should be a punchy phrase, not a paragraph
- Tagline should be one compelling sentence
- problemStatement should focus on the pain, not the solution`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Text too short — tell me more about your business" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY not set" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return new Response(
        JSON.stringify({ error: "LLM returned empty response" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse JSON from response (handle markdown code blocks)
    let extracted;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      extracted = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse LLM response", raw: content }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, data: extracted }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
