# OpenWallet hackathon — x402 mailbox + MoonPay OWS

Public submission for the [OpenWallet OWS hackathon](https://hackathon.openwallet.sh/): an [OpenClaw](https://docs.openclaw.ai/) skill and helper scripts to pay for **x402**-protected mail **admin-api** routes using the **MoonPay OWS CLI** (`ows pay request`).

**Production API (this integration always uses this host):** **`https://mail.cusethejuice.com/admin-api`** — not a generic “your mail server” placeholder. The skill instructs agents never to swap in another origin for CuseTheJuice flows.

**Repository:** [github.com/CuseTheJuice/openwallet-hackathon-app](https://github.com/CuseTheJuice/openwallet-hackathon-app)

## Contents

| Path | Description |
|------|-------------|
| [skills/x402_mailbox_ows/SKILL.md](skills/x402_mailbox_ows/SKILL.md) | OpenClaw skill (`ows` required) |
| [scripts/install-openclaw-skill.sh](scripts/install-openclaw-skill.sh) | Installs skill into `~/.openclaw/workspace/skills/x402_mailbox_ows/` |
| [scripts/test-ows-x402.sh](scripts/test-ows-x402.sh) | Example `ows pay request` against **mail.cusethejuice.com** (set `OWS_WALLET_UUID` + mailbox env vars; optional `MAIL_API_BASE` for local dev only) |
| [INSTALL-OPENCLAW.md](INSTALL-OPENCLAW.md) | Full install + hackathon publishing notes |
| [workspace/x402-config-template.ini](workspace/x402-config-template.ini) | Example local config; fixed x402 pay-to matches the skill |

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
