# Known Issues / Technical Debt

Things that work but are brittle, unfinished, or need a human decision. Append as discovered.

---

## Open as of 2026-05-31

### 1. Production deploy is not committed to git  ⚠️ action needed
The 2026-05-31 changes were deployed to Vercel production via `vercel --prod` but the code still lives **only in the local working tree** on branch `improve/seo-perf-legal-a11y` (uncommitted). The live site and the repo are out of sync. **Next step:** commit the branch and open a PR against `main` (origin: `PaulBurgEth/ecothailand-foundation`) so the deploy is reproducible. Do not push to `main` directly.

### 2. Legal pages are not lawyer-reviewed
`/privacy` and `/terms` (and the footer disclaimer) are plain-language drafts written to be accurate to the implementation, but they have **not** had legal sign-off. The contact point is a generic link to ecothailand.org (no dedicated legal email). Treat as good-faith placeholders; have counsel review before relying on them, especially the liability and "not an investment" language given this is a financial/crypto product.

### 3. Small-text color contrast may fail WCAG AA (mobile)
Many labels use `text-[9px]`/`text-[10px]` uppercase mono in `slate-400`/`slate-500` on the dark background (e.g. footer status chip, card stat labels). These are likely below the WCAG AA contrast ratio and are small touch/read targets. Not fixed this session — needs a design judgment call on color/size, not a mechanical change.

### 4. Root OG image is heavy (~609 KB PNG)
`/opengraph-image` renders two full 624 KB JPGs into the card. It works and is cached, but is large. Could be slimmed (smaller embedded art / fewer layers) toward <300 KB. Low priority — it's served once per scrape, not per pageview.

### 5. Share OG images are also large (~500 KB each)
Same family as #4 — the `share/[id]` card embeds a full-resolution level JPG. Acceptable (cached, scraper-only) but could use a downsized source image.

### 6. Social scrapers cache aggressively
After the OG fix, Twitter/Facebook/LinkedIn may still show the old (blank) preview until their caches expire. Force a refresh via each platform's card/debug validator if needed.

### 7. `app/.vercel/` is committed-adjacent
The Vercel project link lives in `app/.vercel/project.json` (projectName `app`). Fine, but note the production deploy targets that linked project, not a git-integration build.

### 8. Two Next.js dev-port notes
- `next dev` has no `-p` flag, so it honors the `PORT` env var; `.claude/launch.json` sets `autoPort: true` to avoid port-3000 collisions.
- `hardhat/` has only a placeholder `test` script (no real server); `foundry` exposes `anvil` (port 8545) as an optional local chain, saved in `launch.json` but not auto-started.
