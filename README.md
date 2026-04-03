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

```bash
chmod +x scripts/install-openclaw-skill.sh scripts/test-ows-x402.sh
./scripts/install-openclaw-skill.sh
# optional: OPENCLAW_WORKSPACE=... ./scripts/install-openclaw-skill.sh
```

See [INSTALL-OPENCLAW.md](INSTALL-OPENCLAW.md) for linking this repo from a live mail server admin UI (`X402_OWS_PUBLIC_REPO_URL`).

## Upstream

Derived from **[x402-bot-mailbox](https://github.com/CuseTheJuice/x402-bot-mailbox)** (full Postfix installer and admin UI). This repo is the minimal **public** surface for hackathon reviewers; behavior and URLs stay aligned with **mail.cusethejuice.com**.
