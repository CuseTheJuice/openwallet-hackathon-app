import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";

const BG = "#04060c";
const ACCENT = "#00e8c8";
const ACCENT2 = "#a78bfa";
const MUTED = "rgba(255,255,255,0.55)";

function fadeUp(frame: number, start: number, end: number) {
  const opacity = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(frame, [start, end], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return { opacity, transform: `translateY(${y}px)` };
}

function Grid() {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 90, [0, 45, 90], [0.04, 0.09, 0.04]);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `
          linear-gradient(${ACCENT}22 1px, transparent 1px),
          linear-gradient(90deg, ${ACCENT}22 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        opacity: pulse,
      }}
    />
  );
}

function Vignette() {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  );
}

function Hero() {
  const frame = useCurrentFrame();
  const a = fadeUp(frame, 0, 22);
  const b = fadeUp(frame, 12, 34);
  const c = fadeUp(frame, 24, 46);
  const glow = interpolate(frame, [0, 40], [0.25, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      className="flex flex-col items-center justify-center px-10 text-center"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <p
        className="mb-3 text-sm font-bold uppercase tracking-[0.35em] md:text-base"
        style={{ ...a, color: ACCENT }}
      >
        CuseTheJuice × OpenWallet
      </p>
      <h1
        className="text-5xl font-black leading-none tracking-tight md:text-7xl"
        style={{
          ...b,
          fontFamily: "'Archivo Black', sans-serif",
          color: "#f4f4f5",
          textShadow: `0 0 ${60 * glow}px ${ACCENT}44`,
        }}
      >
        x402 MAILBOX
      </h1>
      <p
        className="mt-6 text-xl font-semibold md:text-2xl"
        style={{ ...c, color: MUTED }}
      >
        OWS wallet · OpenClaw · Base USDC
      </p>
    </AbsoluteFill>
  );
}

function PayScene() {
  const frame = useCurrentFrame();
  const a = fadeUp(frame, 0, 18);
  const b = fadeUp(frame, 14, 32);
  const c = fadeUp(frame, 26, 48);
  const badge = interpolate(frame, [8, 28], [0.6, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      className="flex flex-col items-center justify-center px-8 text-center"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <div
        className="mb-6 rounded-full border-2 px-6 py-2 text-2xl font-black md:text-4xl"
        style={{
          ...a,
          borderColor: ACCENT2,
          color: ACCENT2,
          boxShadow: `0 0 ${40 * badge}px ${ACCENT2}33`,
        }}
      >
        HTTP 402
      </div>
      <h2
        className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl"
        style={{ ...b, color: "#fafafa" }}
      >
        Pay per API call
      </h2>
      <p
        className="mt-5 max-w-xl text-lg md:text-xl"
        style={{ ...c, color: MUTED }}
      >
        Micropayments in USDC on Base — no subscription wall. Your OWS wallet
        signs; the mail stack settles.
      </p>
    </AbsoluteFill>
  );
}

function MailApiScene() {
  const frame = useCurrentFrame();
  const a = fadeUp(frame, 0, 20);
  const b = fadeUp(frame, 16, 38);
  const underline = interpolate(frame, [20, 45], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      className="flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <p
        className="mb-4 text-center text-sm uppercase tracking-widest"
        style={{ ...a, color: ACCENT }}
      >
        Production API
      </p>
      <div style={b} className="text-center">
        <p
          className="break-all text-lg font-medium text-cyan-100 md:text-2xl lg:text-3xl"
          style={{
            textDecoration: "underline",
            textDecorationColor: `rgba(0,232,200,${0.2 + underline * 0.6})`,
            textUnderlineOffset: "8px",
          }}
        >
          mail.cusethejuice.com/admin-api
        </p>
        <p
          className="mt-8 text-center text-base md:text-lg"
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            color: MUTED,
            lineHeight: 1.6,
          }}
        >
          Create mailbox · List & read · Attachments · Quota · Send · Storage
          tiers
        </p>
      </div>
    </AbsoluteFill>
  );
}

function TracksScene() {
  const frame = useCurrentFrame();
  const items = [
    "Agentic storefronts & commerce",
    "Pay-per-call services",
    "Multi-agent economies",
  ];
  return (
    <AbsoluteFill
      className="flex flex-col items-center justify-center gap-5 px-8"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <p
        className="mb-2 text-sm font-bold uppercase tracking-[0.3em]"
        style={{ ...fadeUp(frame, 0, 16), color: ACCENT2 }}
      >
        OWS Hackathon tracks
      </p>
      {items.map((label, i) => {
        const st = 10 + i * 14;
        const style = fadeUp(frame, st, st + 22);
        return (
          <div
            key={label}
            className="w-full max-w-2xl rounded-xl border px-6 py-4 text-left text-lg font-semibold md:text-2xl"
            style={{
              ...style,
              borderColor: `${ACCENT}55`,
              background: "rgba(0,232,200,0.06)",
              color: "#f4f4f5",
            }}
          >
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

function CodeScene() {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 18) % 2 === 0 ? "█" : " ";
  const reveal = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const code = `ows pay request --wallet "$OWS_WALLET_UUID" \\
  "https://mail.cusethejuice.com/admin-api/machine/request/list" \\
  --method POST --body '{"email":"…","username":"…","password":"…"}'`;
  return (
    <AbsoluteFill className="flex items-center justify-center px-4 md:px-12">
      <div
        className="w-full max-w-4xl rounded-2xl border p-6 md:p-10"
        style={{
          ...fadeUp(frame, 0, 24),
          borderColor: "#334155",
          background: "rgba(15,23,42,0.92)",
          boxShadow: `0 0 80px ${ACCENT}18`,
        }}
      >
        <p
          className="mb-3 text-xs uppercase tracking-widest"
          style={{ color: ACCENT, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          OpenClaw runs the skill
        </p>
        <pre
          className="overflow-hidden text-left text-xs leading-relaxed text-emerald-200/95 md:text-sm"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            opacity: reveal,
            maxHeight: `${interpolate(frame, [10, 55], [80, 400], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px`,
          }}
        >
          {code}
          <span style={{ color: ACCENT }}>{blink}</span>
        </pre>
      </div>
    </AbsoluteFill>
  );
}

function Outro() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(frame, [0, 20], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const b = fadeUp(frame, 14, 36);
  const scale = interpolate(frame, [0, 30], [0.94, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      className="flex flex-col items-center justify-center px-8 text-center"
      style={{ fontFamily: "'Archivo Black', sans-serif" }}
    >
      <h2
        className="text-4xl tracking-tight text-white md:text-6xl"
        style={{
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
        }}
      >
        SHIP MAIL.
        <br />
        <span style={{ color: ACCENT }}>PAY ONCHAIN.</span>
      </h2>
      <p
        className="mt-8 text-lg md:text-xl"
        style={{
          ...b,
          fontFamily: "'Space Grotesk', sans-serif",
          color: MUTED,
        }}
      >
        github.com/CuseTheJuice/openwallet-hackathon-app
      </p>
      <p
        className="mt-3 text-base font-bold md:text-lg"
        style={{ ...fadeUp(frame, 22, 42), color: ACCENT2 }}
      >
        hackathon.openwallet.sh
      </p>
    </AbsoluteFill>
  );
}

export const MyComposition = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Grid />
      <Sequence durationInFrames={120}>
        <Hero />
      </Sequence>
      <Sequence from={120} durationInFrames={150}>
        <PayScene />
      </Sequence>
      <Sequence from={270} durationInFrames={180}>
        <MailApiScene />
      </Sequence>
      <Sequence from={450} durationInFrames={180}>
        <TracksScene />
      </Sequence>
      <Sequence from={630} durationInFrames={180}>
        <CodeScene />
      </Sequence>
      <Sequence from={810} durationInFrames={90}>
        <Outro />
      </Sequence>
      <Vignette />
    </AbsoluteFill>
  );
};
