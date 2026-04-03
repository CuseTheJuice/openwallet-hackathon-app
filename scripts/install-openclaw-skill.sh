#!/usr/bin/env bash
# Install the x402_mailbox_ows OpenClaw skill into the OpenClaw workspace (default ~/.openclaw/workspace/skills).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_SRC="${REPO_ROOT}/skills/x402_mailbox_ows/SKILL.md"
DEST_ROOT="${OPENCLAW_WORKSPACE:-${HOME}/.openclaw/workspace}"
DEST="${DEST_ROOT}/skills/x402_mailbox_ows"

if [[ ! -f "$SKILL_SRC" ]]; then
  echo "ERROR: missing ${SKILL_SRC}" >&2
  exit 1
fi

mkdir -p "$DEST"
cp -f "$SKILL_SRC" "${DEST}/SKILL.md"
chmod a+r "${DEST}/SKILL.md"

echo "Installed OpenClaw skill: ${DEST}/SKILL.md"
echo "Restart the OpenClaw gateway or start a new session (e.g. openclaw skills list)."
echo "See INSTALL-OPENCLAW.md in the repository for full instructions."
