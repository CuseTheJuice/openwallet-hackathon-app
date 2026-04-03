#!/usr/bin/env bash
# Example: x402 machine list + MoonPay OWS (`ows pay request`).
# Defaults to production CuseTheJuice admin API. Override with MAIL_API_BASE only for local dev.

set -euo pipefail

OWS_WALLET_UUID="${OWS_WALLET_UUID:?Set OWS_WALLET_UUID (from: ows wallet list)}"
MAIL_API_BASE="${MAIL_API_BASE:-https://mail.cusethejuice.com/admin-api}"

MAIL_EMAIL="${MAIL_EMAIL:?Set MAIL_EMAIL}"
MAIL_USERNAME="${MAIL_USERNAME:?Set MAIL_USERNAME (linux user)}"
MAIL_PASSWORD="${MAIL_PASSWORD:?Set MAIL_PASSWORD}"

API_URL="${MAIL_API_BASE}/machine/request/list"
JSON_DATA="$(printf '{"email":"%s","username":"%s","password":"%s","limit":5}' \
  "$MAIL_EMAIL" "$MAIL_USERNAME" "$MAIL_PASSWORD")"

echo "=== x402 + OWS pay request (machine list) ==="
echo "API_URL=$API_URL"
echo "Body (password redacted): $(echo "$JSON_DATA" | sed 's/"password":"[^"]*"/"password":"***"/')"
echo

ows pay request --wallet "$OWS_WALLET_UUID" "$API_URL" --method POST --body "$JSON_DATA"

echo
echo "=== Notes ==="
echo "- All x402 routes for OpenClaw/OWS: see skills/x402_mailbox_ows/SKILL.md"
echo "- Prices: GET ${MAIL_API_BASE}/ui/config"
echo "- Wallet balance: ows wallet balance $OWS_WALLET_UUID"
