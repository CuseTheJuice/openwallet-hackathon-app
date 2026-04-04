# 30s hype video — OpenWallet hackathon app

[Remotion](https://www.remotion.dev/) project scaffolded with `npx create-video@latest` (blank template). **Composition `MyComp`**: 30 seconds, 1280×720, 30 fps (900 frames) promoting the **x402 mailbox + OWS + OpenClaw** integration for **mail.cusethejuice.com**.

## Commands

```bash
npm install
npm run dev          # Remotion Studio (preview + scrub timeline)
npm run render       # writes out/hype.mp4 (H.264)
npm run lint
```

Re-render after edits to `src/Composition.tsx` or `src/Root.tsx`. Output files under `out/` are gitignored.

## Scene breakdown

| Time   | Content                                              |
| ------ | ---------------------------------------------------- |
| 0–4s   | Title: x402 mailbox, OWS · OpenClaw · Base USDC      |
| 4–9s   | HTTP 402, pay-per-call, USDC on Base                 |
| 9–15s  | Production API URL + mail capabilities               |
| 15–21s | OWS hackathon tracks (storefront, pay-per-call, MAS) |
| 21–27s | Example `ows pay request` snippet                    |
| 27–30s | Outro: GitHub repo + hackathon.openwallet.sh         |

## License

Remotion [license terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) apply to the tooling. Treat this folder’s creative content as part of the parent repository’s license unless noted otherwise.
