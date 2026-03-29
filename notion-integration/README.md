# mcp-scan + Notion MCP Integration

Push mcp-scan security findings to a Notion database.

## Setup

### 1. Create a Notion integration

Go to [notion.com/my-integrations](https://www.notion.com/my-integrations) and create a new integration.
Copy the Internal Integration Token.

### 2. Create the Notion database

Create a new database in Notion with these properties:

| Property | Type |
|----------|------|
| Name | Title |
| Server | Text |
| AI Tool | Text |
| Severity | Select (Critical/High/Medium/Low/Info) |
| Finding ID | Text |
| Config Path | Text |
| Fix | Text |
| Scan Date | Date |
| Status | Select (Open/In Progress/Fixed) |

### 3. Share database with your integration

Open the database → Share → Invite your integration.

### 4. Get the database ID

From the database URL: `notion.so/YOUR_WORKSPACE/DATABASE_ID?v=...`
The database ID is the 32-character string before the `?`.

### 5. Install dependencies

```bash
cd notion-integration
npm install @notionhq/client
```

## Usage

```bash
# Run scan and push to Notion
npx mcp-scan@latest --json | NOTION_API_KEY=secret_xxx NOTION_DATABASE_ID=yyy node push-to-notion.js
```

Or with environment variables in a `.env` file:

```bash
export NOTION_API_KEY=secret_xxx
export NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
npx mcp-scan@latest --json | node push-to-notion.js
```

## With Notion MCP (Claude Desktop / Claude Code)

Configure Notion MCP in your `.mcp.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer YOUR_NOTION_TOKEN\"}"
      }
    }
  }
}
```

Then ask Claude:

> "Run mcp-scan with --json output. Parse the results and use Notion MCP to create a security database. Each finding should be a row with: server name, severity, finding description, the AI tool it affects, config path, and fix recommendation."

Claude will use mcp-scan output + Notion MCP tools to populate your workspace automatically.
