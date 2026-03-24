# Audience Capture Strategy — mcp-scan

The original plan drives all traffic to GitHub with no way to build a direct audience.
Social media reach is rented. Email is owned. This fixes that.

---

## 1. EMAIL LIST (Highest priority — do this first)

**Tool:** Buttondown (free up to 100 subscribers, $9/mo after) — https://buttondown.com
Alternative: Loops.so (free tier) or ConvertKit (free up to 1,000)

**What to offer:** "Get notified when mcp-scan publishes new MCP security advisories. No spam. Security findings only."

**Setup (30 minutes):**
1. Create free Buttondown account
2. Set up a list called "MCP Security Advisories"
3. Create a simple signup page (Buttondown provides one automatically)
4. Your signup URL will be: buttondown.email/[yourname]

**Where to add the signup link:**
- GitHub README — add a "Security Advisories" section with signup link
- LinkedIn Featured section (add alongside repo link)
- Twitter/X bio
- Every future LinkedIn carousel — last slide or first comment

**What to send:** When mcp-scan finds a new class of vulnerability or publishes an advisory, send a 3-paragraph email. That's it. Low frequency = high trust.

---

## 2. GITHUB DISCUSSIONS (Set up tonight)

1. Go to github.com/rodolfboctor/mcp-scan/settings
2. Scroll to Features, enable "Discussions"
3. Create two categories:
   - "Security Advisories" — for publishing findings
   - "Findings from the Wild" — for users to share what they found

**Why this works:** GitHub sends notification emails to everyone who has "watched" your repo when you post a Discussion. This turns your star count into a broadcast channel.

**Add to README:** "Watch this repo to get notified of new MCP security advisories."

---

## 3. LINKEDIN FEATURED SECTION (Set up tonight)

LinkedIn Featured section is premium real estate that shows up on your profile before your experience section. Right now you have none.

Add these two items:
1. **GitHub repo link:** "mcp-scan — Security scanner for MCP server configs" → github.com/rodolfboctor/mcp-scan
2. **Email signup:** "Get MCP security advisories" → your Buttondown link

To add Featured section on LinkedIn:
1. Go to your profile
2. Click "Add section"
3. Select "Featured"
4. Add link → paste GitHub URL
5. Repeat for email signup

---

## 4. MONETIZATION SEEDS (Plant now, harvest later)

These don't require building anything. Add them to the README and profile tonight.

**Consulting / Security Audits**
Add to README under a "Need Help?" section:
"Need a full MCP security review for your team or product? I offer paid MCP security audits. Contact: [your email]"
Price: $500–2,000 per engagement depending on scope.
This is the fastest path to revenue from open-source visibility.

**GitHub Sponsors**
Set up at: github.com/sponsors
Create two tiers:
- $5/month: "Early access to new scanner types before public release"
- $25/month: "Priority GitHub issue responses + direct email support"

**Future: Open Core**
Free: CLI scanner (what you have now)
Paid ($29/mo per team): Web dashboard, team reports, Slack alerts, CI/CD integration, compliance exports

Don't build this yet. Build the audience first. When you have 500+ GitHub stars and a real email list, the demand signal will tell you whether to build it.

---

## 5. GITHUB SOCIAL PREVIEW (Set up tonight)

Currently: No custom preview image. GitHub shows a generic default when anyone shares your repo link.

To create and set the preview image, see GITHUB-PREVIEW-SPEC.md.

To set it on GitHub:
1. Go to github.com/rodolfboctor/mcp-scan/settings
2. Scroll to "Social preview"
3. Upload the 1280x640px image

---

## PRIORITY ORDER (Do these tonight before launch)

1. [ ] Create Buttondown email list (30 min)
2. [ ] Add signup link to GitHub README
3. [ ] Enable GitHub Discussions
4. [ ] Add Featured section to LinkedIn with repo + email links
5. [ ] Set GitHub social preview image
6. [ ] Add "Security Audits available" to README
