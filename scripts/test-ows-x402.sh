#!/usr/bin/env bash
# Example: x402 machine API + MoonPay OWS (`ows pay request`).
# Copy this file, set the variables below, then run. Do not commit real passwords or wallet UUIDs.

set -euo pipefail

# OWS wallet profile UUID from `ows wallet list` (not the on-chain pay-to address).
OWS_WALLET_UUID="${OWS_WALLET_UUID:-00000000-0000-0000-0000-000000000000}"

# Your mail admin API (HTTPS), no trailing slash.
MAIL_API_BASE="${MAIL_API_BASE:-https://mail.example.com/admin-api}"

# Mailbox credentials (use env vars to avoid putting secrets in the script file).
MAIL_EMAIL="${MAIL_EMAIL:-user@example.com}"
MAIL_USERNAME="${MAIL_LINUX_USER:-user}"
MAIL_PASSWORD="${MAIL_PASSWORD:-}"

API_URL="${MAIL_API_BASE}/machine/request/list"
JSON_DATA="$(printf '{"email":"%s","username":"%s","password":"%s","limit":5}' \
  "$MAIL_EMAIL" "$MAIL_USERNAME" "$MAIL_PASSWORD")"

echo "=== x402 + OWS pay request (example) ==="
echo "API_URL=$API_URL"
echo "Request body: $(echo "$JSON_DATA" | sed 's/"password":"[^"]*"/"password":"***"/')"
echo

ows pay request --wallet "$OWS_WALLET_UUID" "$API_URL" --method POST --body "$JSON_DATA"

echo
echo "=== Notes ==="
echo "- Set OWS_WALLET_UUID, MAIL_API_BASE, MAIL_EMAIL, MAIL_LINUX_USER, MAIL_PASSWORD (or export before running)."
echo "- Empty password yields auth failure; pass the real mailbox password for your host."
echo "- On 402, OWS should complete payment; success often shows a paid x402 line on Base USDC."
echo "- Balance: ows wallet balance <your-wallet-uuid>"
