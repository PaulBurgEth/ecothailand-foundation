# Decisions Log

Append-only record of non-obvious changes, why they were made, alternatives considered, and trade-offs accepted.

---

## 2026-05-31 — Design / SEO / Performance / Copyright review + production deploy

Triggered by a review request on the live site (https://ecothailand.regenbazaar.com). Worked on branch `improve/seo-perf-legal-a11y`. Deployed to Vercel production (deployment `dpl_2RE4awMVwByk8x3n7TNR8zwhYang`).

### Fixed: broken social-share preview images (highest impact)
- **What:** `app/src/app/share/[id]/opengraph-image.tsx` was returning HTTP 200 with **0 bytes** for every `/share/1..5/opengraph-image`. Every social share of a level link showed a blank preview.
- **Root cause (two parts):** (1) the embedded `<img src={level.image}>` used a *relative* URL, but Satori/`ImageResponse` requires an *absolute* URL; (2) a Satori crash — `Expected <div> to have explicit "display: flex" ... if it has more than one child node` — caused by a `<div>` whose content was `{level.description.slice(...)}` plus a literal `...` (two child nodes).
- **Fix:** absolute URL (`${PRODUCTION_URL}${level.image}`) + collapsed the two children into one template string. Also removed the `images:` override in `share/[id]/page.tsx` `generateMetadata` so the branded 1200×630 card is actually used instead of the raw JPG.
- **Why this way:** matches the working pattern already in the root `opengraph-image.tsx`.
- **Verified:** all 5 endpoints now return ~500 KB valid 1200×630 PNGs, live on production.

### Replaced 398 KB favicon with code-generated icons
- **What:** `/favicon.png` was a 398 KB JPEG mislabeled `.png`, reused as Apple icon AND JSON-LD Organization logo.
- **Fix:** added `app/src/app/icon.tsx` (64×64, ~1.7 KB) and `app/src/app/apple-icon.tsx` (180×180) using Next's metadata-file convention + `ImageResponse` to draw a leaf glyph on the brand background. Deleted the raster `favicon.png`. JSON-LD `logo` now points at `/apple-icon`.
- **Alternative considered:** shipping a hand-made `.ico`/PNG set. Rejected — code-generated icons stay in sync with brand colors and add no binary assets to the repo.
- **Trade-off:** icons are now server-rendered routes (negligible cost, cached).

### Added legal pages + financial disclaimer
- **What:** new `app/src/app/privacy/page.tsx` and `app/src/app/terms/page.tsx`, plus footer links and a short disclaimer in `Footer.tsx`.
- **Why:** the site connects wallets and sells priced products; it had no Privacy Policy, Terms, or risk disclaimer.
- **Content stance:** plain-language, accurate to the actual implementation (80/10/10 split; names Celo, WalletConnect/RainbowKit, Vercel, Cloudflare; "Impact Products are not investments", on-chain transactions irreversible, no refunds). **Not lawyer-reviewed** — see KNOWN_ISSUES.
- **Both pages added to `sitemap.ts`** at priority 0.3.

### SEO additions
- **Product/Offer JSON-LD:** `layout.tsx` now emits a `schema.org/Product` + `Offer` entry per tier (built from `LEVELS` + `BUNDLE_DATA` in `lib/constants.ts`) inside the existing `@graph`. Enables rich pricing results.
- **PWA manifest:** added `app/src/app/manifest.ts` (`/manifest.webmanifest`) — name, icons, theme/background color, `display: standalone`.
- **theme-color:** added via `export const viewport` in `layout.tsx` (`#022c22`).

### Accessibility fixes
- Corrected wrong alt text: `Footer.tsx` logo `alt="X"` → `"EcoSynthesisX logo"`; `AboutMission.tsx` logo `alt="Celo"` → `"EcoSynthesisX logo"` (it was never a Celo logo).
- Added `aria-label`s to the mobile menu toggle (`home/page.tsx`) and the two footer social buttons, plus `rel="noopener noreferrer"` on the footer external links.

### Repo cleanup
- Deleted 11 unreferenced image assets from `app/public/images/` (`-v2.jpg` duplicates, `.png` copies, a 16-byte broken `ecosynthesisx-logo.jpg`) + the old `favicon.png`. `public/images/` went 7.8 MB → 3.2 MB. Verified zero references in `src/` before deleting.

### Findings that needed NO change (verified, documented to avoid re-investigation)
- **Level images are already optimized.** The live home page serves 59 responsive WebP variants via Next's `/_next/image` optimizer (~68–127 KB each), not the 624 KB source JPGs. The common "images too big" advice does not apply.
- **`--- CELO` price flash is a non-issue.** `MintingConsole.tsx` `displayPriceCELO` already falls back to the hardcoded `TIER_CELO_PRICES` number; it never renders `---`.
- **GSAP licensing is a non-issue.** GSAP (incl. plugins) became 100% free under Webflow in 2025; no attribution required.

### Deploy method
- Deployed with `vercel --prod` from the linked `app/` project (Vercel CLI 50.37.3, authed as `paulburgeth`). No git remote build trigger was used. **The deployed code is currently uncommitted** — see KNOWN_ISSUES.
