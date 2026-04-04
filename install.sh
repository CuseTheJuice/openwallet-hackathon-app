#!/usr/bin/env bash
# One-shot install: OWS CLI (if missing), OpenClaw x402_mailbox_ows skill.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS="${REPO_ROOT}/scripts"
OWS_PKG="@open-wallet-standard/core"
SKIP_OWS=0

usage() {
  cat <<'EOF'
Usage: ./install.sh [options]

  Installs everything needed to use this repo with OpenClaw + OWS:
    • OWS CLI (ows) via npm global, if not already on PATH
    • Copies skills/x402_mailbox_ows into your OpenClaw workspace
    • Makes helper scripts executable

  Options:
    --skip-ows     Do not run npm install -g (use if ows is already installed)
    -h, --help     Show this help

  Environment:
    OPENCLAW_WORKSPACE   OpenClaw workspace root (default: ~/.openclaw/workspace)

  Examples:
    ./install.sh
    OPENCLAW_WORKSPACE=/path/to/workspace ./install.sh
    ./install.sh --skip-ows
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-ows)
      SKIP_OWS=1
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ ! -f "${SCRIPTS}/install-openclaw-skill.sh" ]]; then
  echo "ERROR: expected ${SCRIPTS}/install-openclaw-skill.sh (run from repo root after clone)." >&2
  exit 1
fi

chmod +x "${SCRIPTS}/install-openclaw-skill.sh" "${SCRIPTS}/test-ows-x402.sh"

echo "==> Repository: ${REPO_ROOT}"

if [[ "${SKIP_OWS}" -eq 0 ]]; then
  if command -v ows &>/dev/null; then
    echo "==> OWS CLI already on PATH: $(command -v ows)"
  else
    if ! command -v npm &>/dev/null; then
      echo "ERROR: 'ows' not found and 'npm' not on PATH." >&2
      echo "Install Node.js (includes npm), then re-run ./install.sh" >&2
      echo "Or install OWS manually: https://openwallet.sh/ — then ./install.sh --skip-ows" >&2
      exit 1
    fi
    echo "==> Installing OWS CLI: npm install -g ${OWS_PKG}"
    npm install -g "${OWS_PKG}"
    command -v ows &>/dev/null || {
      echo "ERROR: npm install -g succeeded but 'ows' is still not on PATH." >&2
      echo "Fix your npm global bin path, or run: sudo npm install -g ${OWS_PKG}" >&2
      exit 1
    }
    echo "==> ows -> $(command -v ows)"
  fi
else
  echo "==> Skipping OWS install (--skip-ows). Ensure 'ows' works (e.g. ows --help)."
fi

echo "==> Installing OpenClaw skill (x402_mailbox_ows)"
bash "${SCRIPTS}/install-openclaw-skill.sh"

cat <<EOF

==> Done.

Next steps:
  • Create/fund an OWS wallet:  ows wallet create --name my-agent && ows wallet list
  • Fund USDC on Base, then test:  export OWS_WALLET_UUID=... MAIL_EMAIL=... MAIL_USERNAME=... MAIL_PASSWORD=...
      ${SCRIPTS}/test-ows-x402.sh
  • Restart OpenClaw (e.g. openclaw gateway restart) and check:  openclaw skills list

Details: README.md and INSTALL-OPENCLAW.md
EOF
