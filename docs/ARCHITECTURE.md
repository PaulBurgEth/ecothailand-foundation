# Architecture

Written for someone who understands the business but not necessarily the code. It explains what the project is, where each piece lives, and how money and data flow.

## What this project does

EcoThailand Impact is a website where supporters fund real environmental restoration in the Thai Gulf (mangroves, coral, seagrass, education, community gardens) by buying "Impact Products." Each Impact Product is a token recorded on the Celo blockchain — a permanent, public receipt of the contribution. When someone buys, the money is split automatically on-chain: **80% to EcoThailand Foundation, 10% to EcoSynthesisX, 10% to ReFi/GreenPill Phangan.**

Live site: https://ecothailand.regenbazaar.com

## The three parts of the repository

| Folder | What it is | Who touches it |
|---|---|---|
| `app/` | The **website** people see and use (the "frontend" / DApp). Connects wallets, shows products, runs the buy ("mint") flow. | Web work — most day-to-day changes |
| `foundry/` | The **smart contracts** — the on-chain program that takes payment, splits it 80/10/10, and issues the token. Built with the Foundry toolkit. | Blockchain work — high-risk, change rarely |
| `hardhat/` | An alternative blockchain toolkit (deploy scripts, config). Secondary to `foundry`. | Blockchain work |

> **Rule of thumb:** the website (`app/`) is safe to iterate on. The contracts (`foundry/`, `hardhat/`) and the money-split logic are sensitive — never change them without explicit review.

## The website (`app/`) in detail

Built with **Next.js 16** (React 19) and **Tailwind CSS 4**, deployed on **Vercel** behind **Cloudflare**. Key files:

### Pages (what loads at each URL)
- `src/app/layout.tsx` — the shared wrapper for every page. Holds the page `<head>`: title, description, social-share tags, **structured data** (the machine-readable JSON that helps Google show rich results), fonts, theme color.
- `src/app/home/page.tsx` — the **main landing page**. Assembles all the sections (hero, mission, pipeline, the 5 product tiers, bundle, FAQ, footer) and holds the top navigation + wallet connect button.
- `src/app/share/[id]/page.tsx` — a **shareable landing page** for a single product level (e.g. `/share/3`). Used when someone shares their purchase.
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` — the legal pages.
- `src/app/api/metadata/[id]/route.ts` — serves the token's metadata (the standard NFT JSON wallets/marketplaces read).

### Auto-generated files (SEO / branding)
- `src/app/sitemap.ts` → `/sitemap.xml` (map of pages for search engines)
- `src/app/robots.ts` → `/robots.txt` (crawler rules)
- `src/app/manifest.ts` → `/manifest.webmanifest` (lets phones "Add to Home Screen")
- `src/app/icon.tsx`, `src/app/apple-icon.tsx` → the favicon / app icons (drawn in code, not image files)
- `src/app/opengraph-image.tsx` and `src/app/share/[id]/opengraph-image.tsx` → the **preview cards** shown when a link is shared on social media (1200×630 images, generated on the fly)

### Building blocks
- `src/components/` — the visual pieces (hero, footer, FAQ, the minting console, mobile menu, animations, etc.).
- `src/lib/constants.ts` — the **single source of truth for product data**: the 5 levels, prices, descriptions, images, the bundle, and the on-chain addresses (contract + the 80/10/10 recipients). Most "change the copy/price" edits happen here.
- `src/lib/abi.ts` — the contract's interface (how the website talks to the on-chain program).
- `src/lib/wagmi.ts` + `src/app/providers.tsx` — wallet connection setup (RainbowKit + Wagmi + Viem).
- `src/hooks/useImpactStats.ts` — reads on-chain stats (who owns what, prices).

## How a purchase flows (data + money)

1. Visitor opens the site → **Cloudflare → Vercel** serves the page.
2. They click **Connect Wallet** → RainbowKit/Wagmi opens their crypto wallet.
3. They pick a level and confirm → the website calls the **smart contract** on Celo, sending CELO (with a small price buffer for exchange-rate movement).
4. The contract takes payment, **splits it 80/10/10** to the three recipient addresses, and issues the token to the buyer.
5. The transaction is now **public and permanent** on Celo — the website reads it back to show ownership and a shareable card.

The website never holds anyone's money or keys; everything settles on-chain.

## External dependencies (and why)

- **Celo blockchain** — carbon-negative, very low fees, mobile-first. Chosen so ~90%+ of each contribution reaches the ground.
- **Vercel** — hosting/CDN for the website.
- **Cloudflare** — sits in front for caching/security (HSTS, etc.).
- **WalletConnect / RainbowKit** — the wallet-connection UI.
- **Pinata (IPFS)** — image hosting for token metadata (configured in `next.config.ts`).
- **Google Fonts** (Inter, Unbounded, Space Mono), **GSAP** (animations), **lucide-react** (icons).

## Non-obvious things

- **Icons and social cards are generated in code**, not stored as image files (`icon.tsx`, `opengraph-image.tsx`). They render through Next's `ImageResponse`. A quirk: any `<div>` with more than one child inside these must declare `display: flex` or the image generation crashes (this caused a real outage of the share previews — see DECISIONS.md, 2026-05-31).
- **Social-card image URLs must be absolute** (`https://.../images/...`), not relative, or they silently fail to embed.
- **Level/product images are auto-optimized** by Next.js into WebP at the right sizes — don't pre-shrink or hand-convert them.
- **Prices** show a USD figure plus an approximate CELO amount; the CELO figure comes live from the contract's oracle, with a hardcoded fallback in `constants.ts` so it never shows a blank.

## Fragile areas — do not touch without understanding first

- The **smart contracts** (`foundry/`, `hardhat/`) and the **80/10/10 split** and recipient addresses (`constants.ts` `RECIPIENTS`). Changing these moves real money.
- The **mint flow** in `src/components/MintingConsole.tsx` (payment value, slippage buffer, chain switching).
- The **on-the-fly image generators** (`opengraph-image.tsx`, `icon.tsx`) — subtle layout rules apply (see above).
