# Install OpenClaw skill (x402 mailbox + MoonPay OWS)

This **public** hackathon repository ([openwallet-hackathon-app](https://github.com/CuseTheJuice/openwallet-hackathon-app)) documents an [OpenClaw](https://docs.openclaw.ai/) skill that calls the **CuseTheJuice production** x402 admin API at **`https://mail.cusethejuice.com/admin-api`** using the **MoonPay OWS CLI** (`ows pay request`). The skill lists **every** priced route (create mailbox, list/read mail, attachments, send, quota, storage tiers, human HTML flows). **Agents must not substitute another host** for this integration—the hackathon demo targets **mail.cusethejuice.com**, not “whatever server you run locally.”

The live mail stack is built from the upstream **[x402-bot-mailbox](https://github.com/CuseTheJuice/x402-bot-mailbox)** repo. The sections below about **`install_postfix_x402.sh`** apply when deploying from that project (optional for reviewers who only install the skill from this repo).

## Fixed payment address (skill)

The skill hardcodes the x402 **pay-to** address **`0xF9905a9c4784533c8cee3487b4546ed03126DcA5`**. It is **not** configurable inside the skill; agents are instructed never to substitute another address.

Your **OWS wallet ID** (UUID from `ows wallet`) is separate: it selects which MoonPay/OWS wallet **signs** the payment, not the destination address above.

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
