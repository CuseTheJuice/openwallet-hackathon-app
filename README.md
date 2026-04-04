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
| [install.sh](install.sh) | **One-shot installer** (OWS CLI if needed + OpenClaw skill + script perms; optional `--hype-video`) |
| [skills/x402_mailbox_ows/SKILL.md](skills/x402_mailbox_ows/SKILL.md) | OpenClaw skill (`ows` required) |
| [scripts/install-openclaw-skill.sh](scripts/install-openclaw-skill.sh) | Installs skill into `~/.openclaw/workspace/skills/x402_mailbox_ows/` (used by `install.sh`) |
| [scripts/test-ows-x402.sh](scripts/test-ows-x402.sh) | Example `ows pay request` against **mail.cusethejuice.com** (set `OWS_WALLET_UUID` + mailbox env vars; optional `MAIL_API_BASE` for local dev only) |
| [INSTALL-OPENCLAW.md](INSTALL-OPENCLAW.md) | Full install + hackathon publishing notes |
| [workspace/x402-config-template.ini](workspace/x402-config-template.ini) | Example local config; fixed x402 pay-to matches the skill |
| [hype-video/](hype-video/) | **30s Remotion hype reel** with background music (`public/hype-music.wav`); `npm run render` → `out/x402-email-hype.mp4` |

## Installation

**Prerequisites:** [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) (includes **npm**) for installing the [OWS](https://openwallet.sh/) CLI, and an [OpenClaw](https://docs.openclaw.ai/) workspace if you want the skill under `~/.openclaw/workspace` (default).

**One command** from a fresh clone:

```bash
git clone https://github.com/CuseTheJuice/openwallet-hackathon-app.git
cd openwallet-hackathon-app
chmod +x install.sh   # if your checkout did not preserve execute bit
./install.sh
```

What **`./install.sh`** does:

| Step | Action |
|------|--------|
| OWS CLI | Runs `npm install -g @open-wallet-standard/core` **only if** `ows` is not already on your `PATH` |
| OpenClaw skill | Copies [`skills/x402_mailbox_ows/SKILL.md`](skills/x402_mailbox_ows/SKILL.md) to **`${OPENCLAW_WORKSPACE:-~/.openclaw/workspace}/skills/x402_mailbox_ows/SKILL.md`** |
| Scripts | `chmod +x` on `scripts/install-openclaw-skill.sh` and `scripts/test-ows-x402.sh` |

**Flags:** `./install.sh --skip-ows` if OWS is already installed; `./install.sh --hype-video` to also run **`npm install`** in [`hype-video/`](hype-video/) (Remotion). Run `./install.sh --help` for usage.

**After install:** create or choose a wallet (`ows wallet list`), fund **USDC on Base**, restart OpenClaw (`openclaw gateway restart` or a new session), verify with `openclaw skills list`. To smoke-test the API:

```bash
export OWS_WALLET_UUID='…'   # from ows wallet list
export MAIL_EMAIL='…' MAIL_USERNAME='…' MAIL_PASSWORD='…'
./scripts/test-ows-x402.sh
```

[INSTALL-OPENCLAW.md](INSTALL-OPENCLAW.md) covers wallet funding, every priced route, what the agent can do on **mail.cusethejuice.com**, server-side **`X402_OWS_PUBLIC_REPO_URL`**, and manual steps if you prefer not to use **`install.sh`**.
