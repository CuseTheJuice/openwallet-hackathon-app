---
name: x402_mailbox_ows
description: Use MoonPay OWS (ows pay request) to pay for all x402 flows on mail.cusethejuice.com — mailbox lifecycle, list/read, reply/reply-all/forward, move/delete, folders, attachments, send, quota, downloads, password reset, account delete, storage upgrades.
metadata:
  openclaw:
    requires:
      bins:
        - ows
---

# x402 mailbox + MoonPay OWS (CuseTheJuice)

This skill is for **OpenClaw** agents integrating **[OpenWallet by Moonpay](https://hackathon.openwallet.sh/)** / **[Open Wallet Standard](https://openwallet.sh/)** OWS with the **CuseTheJuice** x402 mail stack. **Every** paid admin route below is satisfied with **`ows pay request`** (the OWS-linked wallet signs and settles the x402 payment on Base USDC).

## Capabilities on https://mail.cusethejuice.com (with OWS)

When the user’s OpenClaw session has this skill and a working **`ows`** install with a **funded USDC-on-Base** wallet (`ows pay request --wallet <uuid>`), the agent can autonomously **pay for and call** the x402-gated **admin API** at **`https://mail.cusethejuice.com/admin-api`**. In practice the agent can:

- **Onboard mail:** create mailboxes (`POST /users/add` or GET/HTML flows).
- **Read mail:** list messages, open a message by id, inspect attachment metadata (machine `POST /machine/request/*` or equivalent GET paths).
- **Thread actions:** **reply**, **reply-all**, **forward**, **move** between folders, **delete** messages (dedicated `POST /machine/request/...` routes below).
- **Folders:** **create**, **delete**, **rename** IMAP folders via `POST /machine/request/folder/...`.
- **Mailbox ops:** **download** mailbox data, **reset-password**, **delete-account** (`POST /machine/request/mailbox/...`).
- **Send mail:** submit outbound messages (`POST /machine/request/send`).
- **Operations:** check per-mailbox **quota**; start **storage tier** upgrade payment URLs when the user wants a larger quota (human/HTML paths under `/ui/storage-upgrade/`).
- **Discover prices:** use **`GET .../ui/config`** JSON so quoted USDC amounts match the live server (includes `machine_reply_price_usdc`, `machine_forward_price_usdc`, `mailbox_download_price_usdc`, etc.).

Each operation is a **separate priced HTTP request**; OWS pays the challenge so the server returns 200 with the requested data or action. The **pay-to** address in challenges is fixed below (CuseTheJuice receiver), not the user’s OWS wallet address.

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

- **`ows` on `PATH`** — install: `npm install -g @open-wallet-standard/core` ([OWS](https://openwallet.sh/)).
- OWS wallet configured (`ows wallet create`, `ows wallet list`).
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
| **Reply** | POST | `/machine/request/reply` | JSON: mailbox auth + `message_id` + reply `body`; optional `subject` if the server accepts it |
| **Reply all** | POST | `/machine/request/reply-all` | JSON: mailbox auth + `message_id` + reply `body` (and optional `subject`) |
| **Forward** | POST | `/machine/request/forward` | JSON: mailbox auth + `message_id` + `to`; optional `subject`, `body` |
| **Move message** | POST | `/machine/request/move` | JSON: mailbox auth + `message_id` + destination folder field (e.g. `folder` — confirm with server if 400) |
| **Delete message** | POST | `/machine/request/delete` | JSON: mailbox auth + `message_id` |
| **Create folder** | POST | `/machine/request/folder/create` | JSON: mailbox auth + folder name field (e.g. `folder`) |
| **Delete folder** | POST | `/machine/request/folder/delete` | JSON: mailbox auth + `folder` |
| **Rename folder** | POST | `/machine/request/folder/rename` | JSON: mailbox auth + existing + new name (e.g. `folder` + `new_folder`) |
| **Download mailbox** | POST | `/machine/request/mailbox/download` | JSON: mailbox auth; priced export (see `mailbox_download_price_usdc` in `/ui/config`) |
| **Reset mailbox password** | POST | `/machine/request/mailbox/reset-password` | JSON: mailbox auth + `new_password` (or server-documented fields) |
| **Delete mailbox account** | POST | `/machine/request/mailbox/delete-account` | JSON: mailbox auth + any confirmation fields the server requires |
| **Human paid flows (HTML)** | GET, HEAD | `/machine/human/list`, `/machine/human/message`, `/machine/human/attachments`, `/machine/human/quota`, `/machine/human/send`, `/machine/human/reply`, `/machine/human/forward` | Session/HTML; still x402-priced on GET |
| **Storage upgrade pay steps** | GET, HEAD | `/ui/storage-upgrade/pay/t100`, `/ui/storage-upgrade/pay/t500`, `/ui/storage-upgrade/pay/t1g` | HTML; tier in path; session from POST `/ui/storage-upgrade/start` |

Exact **USDC prices** are dynamic; read **`GET https://mail.cusethejuice.com/admin-api/ui/config`** (JSON). Example keys on the live server include: `account_setup_price_usdc`, `machine_list_price_usdc`, `machine_message_price_usdc`, `machine_attachment_price_usdc`, `machine_send_message_price_usdc`, `machine_reply_price_usdc`, `machine_reply_all_price_usdc`, `machine_forward_price_usdc`, `machine_move_price_usdc`, `machine_delete_message_price_usdc`, `machine_folder_create_price_usdc`, `machine_folder_delete_price_usdc`, `machine_folder_rename_price_usdc`, `machine_mailbox_action_price_usdc`, `mailbox_quota_check_price_usdc`, `mailbox_download_price_usdc`, `mailbox_reset_password_price_usdc`, `mailbox_delete_account_price_usdc`, `quota_upgrade_100mb_price_usdc`, `quota_upgrade_500mb_price_usdc`, `quota_upgrade_1gb_price_usdc` (names mirror production JSON).

If a **400** response lists missing JSON keys, use those names exactly (field naming may evolve on the server).

## Agent behavior

- Prefer **POST `/machine/request/*`** for automation (single URL + JSON).
- When the user asks to **create a mailbox**, use **POST `/users/add`** or the **GET `/users/add`** flow with query params, then complete payment via OWS.
- When the user asks to **read/list/send**, **reply / forward / move / delete**, **manage folders**, **download or reset or delete the mailbox**, **check quota**, or **upgrade storage**, pick the matching row above and run **`ows pay request`** on the **full HTTPS URL**.
- If a response is **402**, OWS should pay and retry per MoonPay docs; if retry is manual, re-run the same command after payment.

## Config template (humans)

See **`workspace/x402-config-template.ini`** in the repo: keep **`[payment] wallet_address`** as **`0xF9905a9c4784533c8cee3487b4546ed03126DcA5`**.

## Reference script

**`scripts/test-ows-x402.sh`** — defaults to **`https://mail.cusethejuice.com/admin-api`**; set **`OWS_WALLET_UUID`**, mailbox env vars, then run.

## Safety

- No **private keys** in chat or committed files.
- **Mailbox passwords** are secrets (env or local file, not logs).
