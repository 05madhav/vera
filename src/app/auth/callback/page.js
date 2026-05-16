"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("verifying"); // verifying | error

  useEffect(() => {
    async function handleCallback() {
      // PKCE flow: Supabase appends ?code= to the redirect URL
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          return;
        }
        router.replace("/verified");
        return;
      }

      // Legacy implicit flow: session is in the URL hash (#access_token=...)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/verified");
        return;
      }

      // Listen for auth state change (hash-based flow)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session) {
            subscription.unsubscribe();
            router.replace("/verified");
          }
        }
      );

      // If nothing happens after 8s, show error
      setTimeout(() => setStatus("error"), 8000);
    }

    handleCallback();
  }, [router]);

  if (status === "error") {
    return (
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.icon}>✕</div>
          <div style={styles.title}>Link expired or invalid.</div>
          <div style={styles.sub}>
            Try signing up again on the{" "}
            <a href="/" style={styles.link}>Vera homepage</a>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.spinner}></div>
        <div style={styles.title}>Verifying your email…</div>
        <div style={styles.sub}>Just a second, setting things up.</div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050507",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    padding: "20px",
  },
  card: {
    textAlign: "center",
    maxWidth: "380px",
    padding: "48px 40px",
    borderRadius: "24px",
    background: "rgba(10,10,16,0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(24px)",
  },
  spinner: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid rgba(167,139,250,0.2)",
    borderTopColor: "#a78bfa",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 24px",
  },
  icon: {
    fontSize: "28px",
    color: "#ff9090",
    marginBottom: "20px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "300",
    letterSpacing: "-0.02em",
    color: "#f5f5f7",
    marginBottom: "10px",
  },
  sub: {
    fontSize: "14px",
    color: "rgba(245,245,247,0.6)",
    lineHeight: "1.6",
  },
  link: {
    color: "#a78bfa",
    textDecoration: "none",
  },
};
