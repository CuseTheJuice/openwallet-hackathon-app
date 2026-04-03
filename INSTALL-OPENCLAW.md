# Install OpenClaw skill (x402 mailbox + MoonPay OWS)

This repository ships an [OpenClaw](https://docs.openclaw.ai/) skill **`x402_mailbox_ows`** that teaches an agent to call this mail server’s **x402**-protected **`/admin-api`** endpoints using the **MoonPay OWS CLI** (`ows pay request`).

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

## Install alongside the mail server installer

When running **`install_postfix_x402.sh`**, pass:

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
| `scripts/test-ows-x402.sh` | Example `ows pay request` calls (update host, wallet UUID, credentials) |
| `scripts/install-openclaw-skill.sh` | CLI installer for `~/.openclaw/workspace/skills` |

## OpenWallet OWS hackathon (public GitHub repo)

The [OpenWallet OWS hackathon](https://hackathon.openwallet.sh/) expects a **public** GitHub repository for integrations using **OpenWallet by Moonpay**.

1. Create a **public** repo (or use a public fork) and ensure it contains at least:
   - `skills/x402_mailbox_ows/SKILL.md`
   - `scripts/install-openclaw-skill.sh`
   - `scripts/test-ows-x402.sh` (edit host, OWS wallet UUID, and mailbox JSON before demoing)
   - `INSTALL-OPENCLAW.md` (this file)
   - `workspace/x402-config-template.ini` (optional; documents the fixed pay-to address)
2. Push to GitHub and copy the repo URL (e.g. `https://github.com/your-org/your-public-repo`).
3. On the mail server, set **`X402_OWS_PUBLIC_REPO_URL`** to that URL in **`x402-policy.env`**, then restart the admin UI service, for example:

   ```bash
   sudo sed -i 's|^X402_OWS_PUBLIC_REPO_URL=.*|X402_OWS_PUBLIC_REPO_URL=https://github.com/your-org/your-public-repo|' /opt/postfix_x402/x402-policy.env
   sudo systemctl restart x402-admin-ui
   ```

4. The **home** page and **OpenClaw + OWS** admin page will then link to the hackathon site and your public repo.

`GET /admin-api/ui/config` also returns `ows_hackathon_url` and `ows_public_repo_url` for static pages that consume JSON config.

## Admin UI

After deploy, open **OpenClaw + OWS** in the admin sidebar (`/admin-api/ui/openclaw`) for the same summary, hackathon link, and optional public repo link.
