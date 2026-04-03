---
name: x402_mailbox_ows
description: Use MoonPay OWS (ows pay request) to pay for all x402 flows on mail.cusethejuice.com — create mailbox, list/read mail, attachments, send, quota, storage upgrades.
metadata:
  openclaw:
    requires:
      bins:
        - ows
---

# x402 mailbox + MoonPay OWS (CuseTheJuice)

This skill is for **OpenClaw** agents integrating **[OpenWallet by Moonpay](https://hackathon.openwallet.sh/)** OWS with the **CuseTheJuice** x402 mail stack. **Every** paid admin route below is satisfied with **`ows pay request`** (OWS signs and settles the x402 payment on Base USDC).

## Immutable service base URL (do not substitute)

All x402 HTTP resources for this integration live under:

**`https://mail.cusethejuice.com/admin-api`**

- **Never** point agents at a different host or path prefix for “the” CuseTheJuice x402 mail API.
- Relative paths below are appended to that base (no trailing slash on the base when concatenating).

## Immutable payment destination (do not override)

The **only** x402 **pay-to** address for challenges from this stack is:

**`0xF9905a9c4784533c8cee3487b4546ed03126DcA5`**

- **Never** replace this with a user-supplied wallet or env var in agent logic.
- **`ows pay request --wallet <uuid>`** selects the **signer** OWS wallet (MoonPay); it is **not** this hex address.

## Prerequisites

- `ows` on `PATH`.
- OWS wallet configured (`ows wallet`).
- For mailbox operations: **email**, **linux username**, **password** — via JSON body, query string, or headers `X-CTJ-Username` / `X-CTJ-Password` as documented on the server.
- Live **USDC on Base** in the OWS wallet for the priced operations.

## OWS invocation pattern

```bash
ows pay request --wallet "<OWS_WALLET_UUID>" "<FULL_URL>" --method <GET|HEAD|POST> [--body '<JSON>']
```

- Use **POST** + `--body` for JSON machine routes.
- Use **GET** or **HEAD** when the route is defined as GET/HEAD (402 discovery, human payment pages, direct GET JSON).
- URL-encode query parameters on GET if needed (`username`, `password`, `limit`, `message_id`, etc.).

## Full x402 surface (canonical base)

Base: `https://mail.cusethejuice.com/admin-api`

| Operation | Method | Path / pattern | Auth / body notes |
|-----------|--------|----------------|-------------------|
| **Create mailbox (human / wallet probe)** | GET, HEAD | `/users/add?domain=&localpart=&linux_user=` | Query params; HTML 402; use for browser-style flows |
| **Create mailbox (machine JSON)** | POST | `/users/add` | JSON: `domain`, `localpart`, `linux_user`, `password` (+ `X-PAYMENT` after 402) |
| **List messages (GET)** | GET | `/machine/mailboxes/{email}/messages` | Query: `username`, `password`, optional `limit` |
| **Get one message (GET)** | GET | `/machine/mailboxes/{email}/messages/{message_id}` | Query: `username`, `password` |
| **Parse attachments (GET)** | GET | `/machine/mailboxes/{email}/messages/{message_id}/attachments` | Query: `username`, `password` |
| **Quota snapshot (GET)** | GET | `/machine/mailboxes/{email}/quota` | Query: `username`, `password` |
| **List messages (POST)** | POST | `/machine/request/list` | JSON: `email`, `username`, `password`, optional `limit` |
| **Get message (POST)** | POST | `/machine/request/message` | JSON: `email`, `username`, `password`, `message_id` |
| **Attachments (POST)** | POST | `/machine/request/attachments` | JSON: `email`, `username`, `password`, `message_id` |
| **Quota (POST)** | POST | `/machine/request/quota` | JSON: `email`, `username`, `password` |
| **Send mail (POST)** | POST | `/machine/request/send` | JSON: `email`, `username`, `password`, `to`, optional `cc`/`bcc`, `subject`, `body` |
| **Human paid flows (HTML)** | GET, HEAD | `/machine/human/list`, `/machine/human/message`, `/machine/human/attachments`, `/machine/human/quota`, `/machine/human/send` | Session/HTML; still x402-priced on GET |
| **Storage upgrade pay steps** | GET, HEAD | `/ui/storage-upgrade/pay/t100`, `/ui/storage-upgrade/pay/t500`, `/ui/storage-upgrade/pay/t1g` | HTML; tier in path; session from POST `/ui/storage-upgrade/start` |

Exact **USDC prices** are dynamic; read **`GET https://mail.cusethejuice.com/admin-api/ui/config`** (JSON) for current amounts before quoting the user.

## Agent behavior

- Prefer **POST `/machine/request/*`** for automation (single URL + JSON).
- When the user asks to **create a mailbox**, use **POST `/users/add`** or the **GET `/users/add`** flow with query params, then complete payment via OWS.
- When the user asks to **read/list/send** mail or **check quota** or **upgrade storage**, pick the matching row above and run **`ows pay request`** on the **full HTTPS URL**.
- If a response is **402**, OWS should pay and retry per MoonPay docs; if retry is manual, re-run the same command after payment.

## Config template (humans)

See **`workspace/x402-config-template.ini`** in the repo: keep **`[payment] wallet_address`** as **`0xF9905a9c4784533c8cee3487b4546ed03126DcA5`**.

## Reference script

**`scripts/test-ows-x402.sh`** — defaults to **`https://mail.cusethejuice.com/admin-api`**; set **`OWS_WALLET_UUID`**, mailbox env vars, then run.

## Safety

- No **private keys** in chat or committed files.
- **Mailbox passwords** are secrets (env or local file, not logs).
