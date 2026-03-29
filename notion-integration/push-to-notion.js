#!/usr/bin/env node
/**
 * mcp-scan -> Notion MCP bridge
 * Reads mcp-scan --json output from stdin, creates/updates Notion security database.
 *
 * Setup:
 *   1. Create a Notion integration at https://www.notion.com/my-integrations
 *   2. Create a database with properties listed below
 *   3. Share your database with the integration
 *   4. Set NOTION_API_KEY and NOTION_DATABASE_ID in your environment
 *
 * Usage:
 *   npx mcp-scan@latest --json | NOTION_API_KEY=xxx NOTION_DATABASE_ID=yyy node push-to-notion.js
 *
 * Required database properties:
 *   - Name (title)
 *   - Server (rich_text)
 *   - AI Tool (rich_text)
 *   - Severity (select)
 *   - Finding ID (rich_text)
 *   - Config Path (rich_text)
 *   - Fix (rich_text)
 *   - Scan Date (date)
 *   - Status (select)
 */

import { Client } from "@notionhq/client";

const SEVERITY_COLORS = {
  CRITICAL: "red",
  HIGH: "orange",
  MEDIUM: "yellow",
  LOW: "blue",
  INFO: "gray",
};

async function main() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.error(
      "Error: NOTION_API_KEY and NOTION_DATABASE_ID environment variables are required."
    );
    console.error(
      "Usage: npx mcp-scan@latest --json | NOTION_API_KEY=xxx NOTION_DATABASE_ID=yyy node push-to-notion.js"
    );
    process.exit(1);
  }

  const notion = new Client({ auth: apiKey });

  // Read mcp-scan JSON from stdin
  let raw = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) raw += chunk;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("Error: Could not parse mcp-scan JSON output. Make sure you ran with --json flag.");
    process.exit(1);
  }

  const { results = [] } = parsed;
  let pushed = 0;
  let updated = 0;
  let skipped = 0;
  const scanDate = new Date().toISOString();

  for (const server of results) {
    const { serverName, toolName, configPath = "", findings = [] } = server;

    if (findings.length === 0) {
      skipped++;
      continue;
    }

    for (const finding of findings) {
      const { id: findingId, severity = "INFO", description = "", fixRecommendation = "" } = finding;
      const pageTitle = `${serverName}: ${findingId}`;

      // Check for existing entry (idempotent - don't create duplicates)
      const existing = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            { property: "Server", rich_text: { equals: serverName } },
            { property: "Finding ID", rich_text: { equals: findingId } },
            { property: "AI Tool", rich_text: { equals: toolName } },
          ],
        },
      });

      const props = {
        Name: { title: [{ text: { content: pageTitle } }] },
        Server: { rich_text: [{ text: { content: serverName } }] },
        "AI Tool": { rich_text: [{ text: { content: toolName } }] },
        Severity: {
          select: {
            name: severity,
            color: SEVERITY_COLORS[severity] || "default",
          },
        },
        "Finding ID": { rich_text: [{ text: { content: findingId } }] },
        "Config Path": { rich_text: [{ text: { content: configPath } }] },
        Fix: {
          rich_text: [{ text: { content: fixRecommendation || "See mcp-scan documentation" } }],
        },
        "Scan Date": { date: { start: scanDate } },
      };

      if (existing.results.length > 0) {
        // Update existing page but preserve Status (don't reset "Fixed" back to "Open")
        await notion.pages.update({
          page_id: existing.results[0].id,
          properties: props,
        });
        updated++;
        console.log(`  ~ ${serverName} (${toolName}): ${findingId} [${severity}] — updated`);
      } else {
        // Create new page with Status: Open
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            ...props,
            Status: { select: { name: "Open" } },
          },
          children: [
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [{ text: { content: description } }],
              },
            },
          ],
        });
        pushed++;
        console.log(`  + ${serverName} (${toolName}): ${findingId} [${severity}] — created`);
      }
    }
  }

  const total = pushed + updated;
  console.log(`\nDone: ${pushed} created, ${updated} updated, ${skipped} clean servers skipped.`);
  console.log(`Total findings tracked in Notion: ${total}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
