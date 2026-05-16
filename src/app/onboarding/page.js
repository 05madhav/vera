"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const INTERESTS = [
  "Coffee", "Walks", "Talks", "Badminton", "Gym", "Running",
  "Fitness", "Coworking", "Study Sessions", "Food Exploration",
  "Live Music", "Photography", "Wellness", "Conversation",
  "Commute", "Startup Networking",
];

const INTENTS = [
  "Just Friends",
  "Activity Partners",
  "Group Socials",
  "Exploring The City",
];

export default function Onboarding() {
  const router = useRouter();
  const [user, setUser]             = useState(null);
  const [selected, setSelected]     = useState(new Set());
  const [intent, setIntent]         = useState("Just Friends");
  const [saving, setSaving]         = useState(false);
  const [checking, setChecking]     = useState(true);
  const [done, setDone]             = useState(false);

  // Guard: must be logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/");
      } else {
        setUser(session.user);
        setChecking(false);
      }
    });
  }, [router]);

  function toggleInterest(tag) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  async function handleEnterVera() {
    if (selected.size === 0) return;
    setSaving(true);

    // Save interests + intent to user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        interests: Array.from(selected),
        intent,
        onboarding_complete: true,
      },
    });

    if (error) {
      console.error("Failed to save onboarding data:", error);
      setSaving(false);
      return;
    }

    setDone(true);
  }

  if (checking) return null;

  const firstName = user?.user_metadata?.first_name || "there";

  /* ── YOU'RE IN SCREEN ── */
  if (done) {
    return (
      <>
        <div className="ob-backdrop"></div>
        <div className="ob-grain"></div>
        <div style={{
            position: "relative", zIndex: 1,
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "40px 20px", textAlign: "center",
          }}>
          <div style={{ maxWidth: 440, margin: "0 auto" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg,#4d9fff,#a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, margin: "0 auto 28px",
              boxShadow: "0 0 70px -10px rgba(167,139,250,0.8)",
              animation: "orbPulse 2.5s ease-in-out infinite",
            }}>◎</div>
            <h2 style={{
              fontSize: "clamp(32px,4vw,44px)", fontWeight: 300,
              letterSpacing: "-0.035em", marginBottom: 14,
              color: "#f5f5f7",
            }}>
              You&apos;re in, {firstName}.
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(245,245,247,0.62)",
              lineHeight: 1.65, marginBottom: 40, maxWidth: 360, margin: "0 auto 40px",
            }}>
              Vera will alert you when something nearby matches your interests.
            </p>
            <button
              onClick={() => router.replace("/home")}
              style={{
                padding: "16px 40px", borderRadius: 999,
                background: "linear-gradient(135deg,#4d9fff,#a78bfa)",
                color: "#fff", fontSize: 15, fontWeight: 500,
                border: "none", cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "-0.01em",
                boxShadow: "0 8px 32px -8px rgba(77,159,255,0.5)",
              }}
            >
              Open the map →
            </button>
          </div>
        </div>
        <style>{`
          @keyframes orbPulse {
            0%,100% { box-shadow: 0 0 70px -10px rgba(167,139,250,0.7); }
            50%      { box-shadow: 0 0 110px -10px rgba(167,139,250,1); }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="ob-backdrop"></div>
      <div className="ob-grain"></div>

      <div className="ob-wrap">
        <div className="ob-card">

          {/* Header */}
          <div className="ob-logo">
            <span className="ob-logo-dot"></span>
            <span>vera</span>
          </div>

          <div className="ob-eyebrow">Step 2 of 2</div>
          <h2 className="ob-title">
            Hey {firstName}, what are<br />you into?
          </h2>
          <p className="ob-sub">
            Choose everything you genuinely enjoy — you'll only get notified about activities that match.
          </p>

          {/* Interest pills */}
          <div className="ob-pills">
            {INTERESTS.map((tag) => (
              <button
                key={tag}
                className={`ob-pill${selected.has(tag) ? " ob-pill-sel" : ""}`}
                onClick={() => toggleInterest(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Intent */}
          <div className="ob-intent-section">
            <div className="ob-intent-label">Looking for</div>
            <div className="ob-intent-row">
              {INTENTS.map((label) => (
                <button
                  key={label}
                  className={`ob-intent-pill${intent === label ? " ob-intent-sel" : ""}`}
                  onClick={() => setIntent(label)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="ob-submit"
            onClick={handleEnterVera}
            disabled={selected.size === 0 || saving}
          >
            {saving ? "Saving…" : "Enter Vera →"}
          </button>

          {selected.size === 0 && (
            <div className="ob-hint">Pick at least one interest to continue.</div>
          )}
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #050507;
          color: #f5f5f7;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .ob-backdrop {
          position: fixed; inset: 0; z-index: 0; overflow: hidden;
          pointer-events: none;
        }
        .ob-backdrop::before {
          content: "";
          position: absolute;
          width: 60vw; height: 60vw; top: -20vw; left: -10vw;
          border-radius: 50%;
          background: radial-gradient(circle, #a78bfa, transparent 70%);
          filter: blur(120px); opacity: 0.3;
          animation: drift1 28s ease-in-out infinite alternate;
        }
        .ob-backdrop::after {
          content: "";
          position: absolute;
          width: 55vw; height: 55vw; bottom: -20vw; right: -10vw;
          border-radius: 50%;
          background: radial-gradient(circle, #4d9fff, transparent 70%);
          filter: blur(120px); opacity: 0.3;
          animation: drift2 32s ease-in-out infinite alternate;
        }
        @keyframes drift1 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(20vw,10vh) scale(1.2)} }
        @keyframes drift2 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(-15vw,-10vh) scale(1.15)} }

        .ob-grain {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='4'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          mix-blend-mode: overlay;
        }

        .ob-wrap {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 20px;
        }

        .ob-card {
          width: 100%; max-width: 580px;
          padding: 48px 44px; border-radius: 28px;
          background: rgba(10,10,16,0.82);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(30px);
          box-shadow: 0 40px 100px -30px rgba(0,0,0,0.5);
        }

        .ob-logo {
          display: flex; align-items: center; gap: 10px;
          font-weight: 600; font-size: 17px; letter-spacing: -0.02em;
          margin-bottom: 32px;
        }
        .ob-logo-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: linear-gradient(135deg, #4d9fff, #a78bfa);
          box-shadow: 0 0 14px #a78bfa;
        }

        .ob-eyebrow {
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(245,245,247,0.4); margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .ob-eyebrow::before {
          content: ""; width: 22px; height: 1px;
          background: linear-gradient(90deg, #a78bfa, transparent);
        }

        .ob-title {
          font-size: clamp(26px, 3.5vw, 34px);
          font-weight: 300; letter-spacing: -0.03em;
          line-height: 1.1; margin-bottom: 12px;
        }
        .ob-sub {
          font-size: 14px; color: rgba(245,245,247,0.62);
          line-height: 1.65; margin-bottom: 28px;
        }

        .ob-pills {
          display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 28px;
        }
        .ob-pill {
          padding: 9px 17px; border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(245,245,247,0.62); font-size: 13px;
          cursor: pointer; transition: all .22s;
          font-family: inherit; font-weight: 300;
        }
        .ob-pill:hover {
          border-color: rgba(255,255,255,0.16); color: #f5f5f7;
        }
        .ob-pill-sel {
          background: rgba(167,139,250,0.14);
          border-color: rgba(167,139,250,0.5);
          color: #f5f5f7;
          box-shadow: 0 0 18px -6px rgba(167,139,250,0.4);
        }

        .ob-intent-section { margin-bottom: 28px; }
        .ob-intent-label {
          font-size: 11px; letter-spacing: 0.13em; text-transform: uppercase;
          color: rgba(245,245,247,0.4); margin-bottom: 12px;
        }
        .ob-intent-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .ob-intent-pill {
          padding: 9px 16px; border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(245,245,247,0.62); font-size: 13px;
          cursor: pointer; transition: all .22s;
          font-family: inherit; font-weight: 300;
        }
        .ob-intent-sel {
          background: rgba(77,159,255,0.14);
          border-color: rgba(77,159,255,0.5);
          color: #4d9fff;
        }

        .ob-submit {
          width: 100%; padding: 15px 24px; border-radius: 999px;
          background: linear-gradient(135deg, #4d9fff, #a78bfa);
          color: #fff; font-size: 15px; font-weight: 500;
          letter-spacing: -0.01em; border: none; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 8px 32px -8px rgba(77,159,255,0.5);
          transition: all .3s cubic-bezier(.2,.7,.3,1);
        }
        .ob-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px -8px rgba(167,139,250,0.6);
        }
        .ob-submit:disabled {
          opacity: 0.45; cursor: not-allowed;
        }

        .ob-hint {
          text-align: center; font-size: 12px;
          color: rgba(245,245,247,0.35); margin-top: 12px;
        }
      `}</style>
    </>
  );
}
