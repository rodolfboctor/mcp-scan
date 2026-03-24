# GitHub Social Preview Image Spec — mcp-scan

## Dimensions: 1280x640px (GitHub's required OG image size)

---

## Design

Background: #000000

Center of image (vertically and horizontally):
- "mcp-scan" — Inter 600, 72px, #F5F5F7, letter-spacing -0.02em
- 12px gap
- "Security scanner for MCP server configs" — Inter 400, 28px, #86868B
- 24px gap
- "npx mcp-scan" — JetBrains Mono 400, 24px, #339DFF

Bottom-right corner (48px margin from edges):
- "Rodolf Boctor" — Inter 400, 16px, #86868B

Optional subtle texture:
- 5% opacity dot grid pattern (#F5F5F7 dots, 20px spacing, 1px dot size)
- This is the ONLY decorative element allowed

No logos. No borders. No gradients. No icons.

---

## How to Create It

**Option 1 — Figma (fastest):**
1. New frame: 1280x640px
2. Fill: #000000
3. Add text layers as specified above
4. Export as PNG

**Option 2 — HTML/CSS (if no Figma):**
Create a simple HTML file with the design, open in Chrome, screenshot at exactly 1280x640px.

**Option 3 — Canva:**
Custom dimensions: 1280x640. Use their "bg color" to set #000000. Add text manually.

---

## How to Upload to GitHub

1. Go to github.com/rodolfboctor/mcp-scan/settings
2. Scroll to "Social preview" section
3. Click "Edit" → "Upload an image"
4. Upload your 1280x640px PNG
5. Save

After upload, test by pasting the repo URL into Twitter's card validator:
https://cards-dev.twitter.com/validator
