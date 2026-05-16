"use client";

export default function Verified() {
  return (
    <>
      <div style={s.backdrop}></div>
      <div style={s.grain}></div>

      <div style={s.wrap}>
        <div style={s.card}>
          {/* Logo */}
          <div style={s.logo}>
            <span style={s.logoDot}></span>
            <span>vera</span>
          </div>

          {/* Icon */}
          <div style={s.iconWrap}>
            <div style={s.icon}>✓</div>
          </div>

          <h2 style={s.title}>You&apos;re all set.</h2>
          <p style={s.sub}>
            Your email is verified. Head back to Vera and sign in to continue.
          </p>

          <a href="/" style={s.btn}>
            Go to Vera &nbsp;→
          </a>
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #050507;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }
        @keyframes drift1 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(20vw,10vh) scale(1.2); }
        }
        @keyframes drift2 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(-15vw,-10vh) scale(1.15); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

const s = {
  backdrop: {
    position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
    pointerEvents: "none",
    // pseudo elements handled via inline-equivalent using box shadows on children
  },
  grain: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    opacity: 0.04,
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='4'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
    mixBlendMode: "overlay",
  },
  wrap: {
    position: "relative", zIndex: 1,
    minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px 20px",
    // gradient orbs via background on wrap (simpler than backdrop pseudos)
    background: `
      radial-gradient(ellipse 55vw 55vw at 10% 10%, rgba(167,139,250,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 50vw 50vw at 90% 90%, rgba(77,159,255,0.18) 0%, transparent 70%)
    `,
  },
  card: {
    width: "100%", maxWidth: 420,
    padding: "48px 44px",
    borderRadius: 28,
    background: "rgba(10,10,16,0.82)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(30px)",
    boxShadow: "0 40px 100px -30px rgba(0,0,0,0.5)",
    textAlign: "center",
  },
  logo: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    fontWeight: 600, fontSize: 17, letterSpacing: "-0.02em",
    color: "#f5f5f7",
    marginBottom: 40,
  },
  logoDot: {
    display: "inline-block",
    width: 10, height: 10, borderRadius: "50%",
    background: "linear-gradient(135deg, #4d9fff, #a78bfa)",
    boxShadow: "0 0 14px #a78bfa",
  },
  iconWrap: {
    marginBottom: 28,
  },
  icon: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 72, height: 72, borderRadius: "50%",
    background: "linear-gradient(135deg, #4d9fff, #a78bfa)",
    fontSize: 32, color: "#fff",
    boxShadow: "0 0 60px -10px rgba(167,139,250,0.7)",
    animation: "checkPop 0.5s cubic-bezier(.2,.8,.3,1) both",
  },
  title: {
    fontSize: "clamp(28px, 4vw, 36px)",
    fontWeight: 300, letterSpacing: "-0.035em",
    color: "#f5f5f7",
    marginBottom: 14,
  },
  sub: {
    fontSize: 15, color: "rgba(245,245,247,0.62)",
    lineHeight: 1.65,
    marginBottom: 36,
    maxWidth: 300, margin: "0 auto 36px",
  },
  btn: {
    display: "inline-block",
    padding: "15px 40px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #4d9fff, #a78bfa)",
    color: "#fff", fontSize: 15, fontWeight: 500,
    textDecoration: "none", letterSpacing: "-0.01em",
    boxShadow: "0 8px 32px -8px rgba(77,159,255,0.5)",
    transition: "all 0.3s cubic-bezier(.2,.7,.3,1)",
  },
};
