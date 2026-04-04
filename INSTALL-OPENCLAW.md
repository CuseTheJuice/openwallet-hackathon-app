# Install OpenClaw skill (x402 mailbox + MoonPay OWS)

This **public** hackathon repository ([openwallet-hackathon-app](https://github.com/CuseTheJuice/openwallet-hackathon-app)) documents an [OpenClaw](https://docs.openclaw.ai/) skill that calls the **CuseTheJuice production** x402 admin API at **`https://mail.cusethejuice.com/admin-api`** using the **MoonPay OWS CLI** (`ows pay request`). The skill lists **every** priced route (create mailbox, list/read mail, attachments, send, quota, storage tiers, human HTML flows). **Agents must not substitute another host** for this integration—the hackathon demo targets **mail.cusethejuice.com**, not “whatever server you run locally.”

The live mail stack is built from the upstream **[x402-bot-mailbox](https://github.com/CuseTheJuice/x402-bot-mailbox)** repo. The sections below about **`install_postfix_x402.sh`** apply when deploying from that project (optional for reviewers who only install the skill from this repo).

## Fixed payment address (skill)

The skill hardcodes the x402 **pay-to** address **`0xF9905a9c4784533c8cee3487b4546ed03126DcA5`**. It is **not** configurable inside the skill; agents are instructed never to substitute another address.

Your **OWS wallet ID** (UUID from `ows wallet list`) is separate: it selects which OWS wallet **signs** the payment, not the destination address above.

## One-shot install (recommended)

From a clone of this repository, run **`./install.sh`** at the repo root. It will:

1. Install the **OWS CLI** globally with `npm install -g @open-wallet-standard/core` if `ows` is not already on your `PATH` (requires **Node.js** and **npm**).
2. Install the **OpenClaw skill** by invoking `scripts/install-openclaw-skill.sh` (honours **`OPENCLAW_WORKSPACE`**).
3. Mark **`scripts/test-ows-x402.sh`** as executable.

Useful flags:

- **`./install.sh --skip-ows`** — if you already installed OWS yourself.
- **`./install.sh --hype-video`** — also runs **`npm install`** in **`hype-video/`** for the Remotion project.

Then follow **Next steps** printed at the end of the script (wallet, USDC on Base, OpenClaw restart). The sections below spell out the same prerequisites in more detail.

## Install OWS CLI (prerequisite)

The skill and test script call the **`ows`** binary ([Open Wallet Standard](https://openwallet.sh/) CLI). Install it **before** installing the OpenClaw skill.

**Install (global npm package):**

```bash
npm install -g @open-wallet-standard/core
```

Confirm the CLI is available:

```bash
ows --help
```

**Create or select a wallet** (encrypted vault under `~/.ows/`):

```bash
ows wallet create --name my-agent
ows wallet list
```

Copy the **wallet UUID** from `ows wallet list` for `OWS_WALLET_UUID` (see `scripts/test-ows-x402.sh`) and for `ows pay request --wallet "<uuid>"`.

**Fund the wallet** with **USDC on Base** so x402 payments to the mail admin API can settle. Check balance when needed:

```bash
ows wallet balance <OWS_WALLET_UUID>
```

Further background: [OWS specification](https://docs.openwallet.sh/), [hackathon hub](https://hackathon.openwallet.sh/). The [`ows pay request`](https://openwallet.sh/) flow signs and satisfies **HTTP 402** payment challenges (this integration uses **Base USDC** toward the fixed pay-to address above).

## What OpenClaw can do with an OWS-linked wallet on mail.cusethejuice.com

With this repo’s skill enabled and **`ows`** configured, an OpenClaw agent can use **`ows pay request`** against the production x402 API **`https://mail.cusethejuice.com/admin-api`**. The linked OWS wallet **pays each priced HTTP call** (micropayments in USDC on Base); the server’s x402 receiver is the fixed address in the skill, not the user’s OWS address.

**End-to-end mail operations (machine JSON API, preferred for agents):**

- **Create a mailbox** — `POST /users/add` with domain, local part, Linux username, and password (or the GET/HTML discovery flow).
- **List inbox** — `POST /machine/request/list` (optional limit) or GET routes under `/machine/mailboxes/{email}/messages`.
- **Read one message** — by `message_id` via `POST /machine/request/message` or GET.
- **Attachments** — fetch parsed attachment metadata for a message (`POST /machine/request/attachments` or GET).
- **Quota** — current usage snapshot (`POST /machine/request/quota` or GET).
- **Send email** — `POST /machine/request/send` with `to`, subject, body, optional `cc` / `bcc`.

**Human-oriented flows:** the same product exposes **HTML x402 pages** (GET/HEAD) under paths like `/machine/human/list`, `.../message`, `.../attachments`, `.../quota`, `.../send` for browser-style payment and session UX; agents can still drive them with `ows pay request` where appropriate.

**Storage upgrades:** paid tier steps under `/ui/storage-upgrade/pay/t100`, `t500`, `t1g` (typically after starting a flow via `POST /ui/storage-upgrade/start` in a real browser session).

**Pricing and links:** live USDC amounts and hackathon/repo URLs come from **`GET https://mail.cusethejuice.com/admin-api/ui/config`**. Operators can surface this repo in the admin UI via `X402_OWS_PUBLIC_REPO_URL` (see below). The **OpenClaw + OWS** admin page is at **`https://mail.cusethejuice.com/admin-api/ui/openclaw`**.

The canonical route table and invocation patterns for agents are in [`skills/x402_mailbox_ows/SKILL.md`](skills/x402_mailbox_ows/SKILL.md).

## Install from the command line

From a clone of this repository:

```bash
chmod +x scripts/install-openclaw-skill.sh
./scripts/install-openclaw-skill.sh
```

Default install location:

`~/.openclaw/workspace/skills/x402_mailbox_ows/SKILL.md`

Use a different OpenClaw workspace root:

```bash
export OPENCLAW_WORKSPACE=/path/to/your/openclaw/workspace
./scripts/install-openclaw-skill.sh
```

Then reload OpenClaw (e.g. `openclaw gateway restart` or `/new` in chat) and verify:

```bash
openclaw skills list
```

## Install alongside the mail server installer (upstream)

When running **`install_postfix_x402.sh`** from **x402-bot-mailbox**, pass:

```bash
sudo bash ./install_postfix_x402.sh --install-openclaw-skill
```

This copies the skill into:

`/opt/postfix_x402/openclaw-skill/x402_mailbox_ows/SKILL.md`

Copy that file into your **development machine’s** OpenClaw workspace `skills/x402_mailbox_ows/` if the agent does not run on the mail server.

Alternatively:

```bash
export X402_INSTALL_OPENCLAW_SKILL=1
sudo -E bash ./install_postfix_x402.sh
```

## Related files in this repo

| Path | Purpose |
|------|---------|
| `skills/x402_mailbox_ows/SKILL.md` | Skill source (YAML frontmatter + agent instructions) |
| `workspace/x402-config-template.ini` | Example INI; `wallet_address` must stay the fixed address when using this skill |
| `scripts/test-ows-x402.sh` | Example `ows pay request` (defaults to `https://mail.cusethejuice.com/admin-api`; set `OWS_WALLET_UUID` and mailbox env vars) |
| `scripts/install-openclaw-skill.sh` | CLI installer for `~/.openclaw/workspace/skills` |

## OpenWallet OWS hackathon (public GitHub repo)

The [OpenWallet OWS hackathon](https://hackathon.openwallet.sh/) expects a **public** GitHub repository for integrations using **OpenWallet by Moonpay**.

1. This repository is intended to satisfy that requirement: `skills/x402_mailbox_ows/SKILL.md`, `scripts/install-openclaw-skill.sh`, `scripts/test-ows-x402.sh`, `INSTALL-OPENCLAW.md`, and `workspace/x402-config-template.ini`.
2. On the **production** mail server, set **`X402_OWS_PUBLIC_REPO_URL`** to **`https://github.com/CuseTheJuice/openwallet-hackathon-app`** in **`x402-policy.env`**, then restart the admin UI service, for example:

   ```bash
   sudo sed -i 's|^X402_OWS_PUBLIC_REPO_URL=.*|X402_OWS_PUBLIC_REPO_URL=https://github.com/CuseTheJuice/openwallet-hackathon-app|' /opt/postfix_x402/x402-policy.env
   sudo systemctl restart x402-admin-ui
   ```

3. The **home** page and **OpenClaw + OWS** admin page will then link to the hackathon site and this public repo.

`GET https://mail.cusethejuice.com/admin-api/ui/config` returns `ows_hackathon_url`, `ows_public_repo_url`, and OpenClaw-related fields for static pages that consume JSON config.

## Admin UI

On **mail.cusethejuice.com**, open **OpenClaw + OWS** in the admin sidebar (`/admin-api/ui/openclaw`) for the same summary, hackathon link, and public repo link.
