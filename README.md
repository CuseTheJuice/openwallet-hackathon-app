# OpenWallet hackathon — x402 mailbox + MoonPay OWS

Public submission for the [OpenWallet OWS hackathon](https://hackathon.openwallet.sh/): an [OpenClaw](https://docs.openclaw.ai/) skill and helper scripts to pay for **x402**-protected mail **admin-api** routes using the **MoonPay OWS CLI** (`ows pay request`).

**Production API (this integration always uses this host):** **`https://mail.cusethejuice.com/admin-api`** — not a generic “your mail server” placeholder. The skill instructs agents never to swap in another origin for CuseTheJuice flows.

**Repository:** [github.com/CuseTheJuice/openwallet-hackathon-app](https://github.com/CuseTheJuice/openwallet-hackathon-app)

## How this fits the [OWS Hackathon](https://hackathon.openwallet.sh/) tracks

We focused on **Agentic Storefronts & Real-World Commerce**, **Pay-Per-Call Services & API Monetization**, and **Multi-Agent Systems & Autonomous Economies**. Here is how this repo maps to each.

| Track | How this submission fits |
| ----- | ------------------------ |
| **Agentic Storefronts & Real-World Commerce** | A storefront or agent-run business still needs **email**: onboarding users, receipts, newsletters, and support inboxes. This skill lets an **OpenClaw** operator treat **production mail** as a metered utility: create mailboxes, send and read mail, and scale storage by paying **CuseTheJuice** over **x402** from an **OWS** wallet—so the agent can run real outbound/commerce workflows without a separate billing integration for every mail action. |
| **Pay-Per-Call Services & API Monetization** | The **admin API** at **`https://mail.cusethejuice.com/admin-api`** is monetized **per HTTP call** (list, read, send, quota, attachments, tiers, and related routes). **`ows pay request`** satisfies **402** challenges in **USDC on Base**; there is no subscription abstraction in the skill—each capability is a **pay-per-call** API in the hackathon sense. |
| **Multi-Agent Systems & Autonomous Economies** | **OWS** is built for **delegated, policy-scoped** wallet use: different agents or tools can share a vault with **API keys and spend policies** instead of one opaque hot key. A **mail** agent can pay for x402 mail calls while other agents pay other x402 vendors, with **separate budgets and audit trails**—composable rails for swarms or pipelines that all settle in **USDC** over **x402**. |

For setup, routes, and agent behavior, see [INSTALL-OPENCLAW.md](INSTALL-OPENCLAW.md) and [skills/x402_mailbox_ows/SKILL.md](skills/x402_mailbox_ows/SKILL.md).

## Contents

| Path | Description |
|------|-------------|
| [skills/x402_mailbox_ows/SKILL.md](skills/x402_mailbox_ows/SKILL.md) | OpenClaw skill (`ows` required) |
| [scripts/install-openclaw-skill.sh](scripts/install-openclaw-skill.sh) | Installs skill into `~/.openclaw/workspace/skills/x402_mailbox_ows/` |
| [scripts/test-ows-x402.sh](scripts/test-ows-x402.sh) | Example `ows pay request` against **mail.cusethejuice.com** (set `OWS_WALLET_UUID` + mailbox env vars; optional `MAIL_API_BASE` for local dev only) |
| [INSTALL-OPENCLAW.md](INSTALL-OPENCLAW.md) | Full install + hackathon publishing notes |
| [workspace/x402-config-template.ini](workspace/x402-config-template.ini) | Example local config; fixed x402 pay-to matches the skill |
| [hype-video/](hype-video/) | **30s Remotion hype reel** ([`npx create-video@latest`](https://www.remotion.dev/docs/cli/create-video)); run `npm run render` inside that folder for `out/hype.mp4` |

## Quick start

**1. Install the OWS CLI** (required for `ows pay request`; see [Open Wallet Standard](https://openwallet.sh/)):

```bash
npm install -g @open-wallet-standard/core
ows wallet list   # use a wallet UUID as OWS_WALLET_UUID for the test script
```

**2. Install the OpenClaw skill** into your workspace:

```bash
chmod +x scripts/install-openclaw-skill.sh scripts/test-ows-x402.sh
./scripts/install-openclaw-skill.sh
# optional: OPENCLAW_WORKSPACE=... ./scripts/install-openclaw-skill.sh
```

**3. Optional:** run [`scripts/test-ows-x402.sh`](scripts/test-ows-x402.sh) against **`https://mail.cusethejuice.com/admin-api`** after setting `OWS_WALLET_UUID` and mailbox env vars (USDC on Base required).

[INSTALL-OPENCLAW.md](INSTALL-OPENCLAW.md) has the full setup: OWS install, wallet funding, what an OpenClaw agent can do on **mail.cusethejuice.com** with an OWS-linked wallet, and linking this repo from the live admin UI (`X402_OWS_PUBLIC_REPO_URL`).
