"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupForm() {
  const router = useRouter();
  const [mode, setMode]           = useState("signup"); // signup | signin
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [status, setStatus]       = useState("idle"); // idle | loading | sent | error
  const [errorMsg, setErrorMsg]   = useState("");

  function switchMode(m) {
    setMode(m);
    setStatus("idle");
    setErrorMsg("");
    setName("");
    setEmail("");
    setPassword("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === "signup") {
      if (!name.trim()) {
        setStatus("error");
        setErrorMsg("Please enter your first name.");
        return;
      }
      if (!emailRegex.test(email)) {
        setStatus("error");
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      if (password.length < 8) {
        setStatus("error");
        setErrorMsg("Password must be at least 8 characters.");
        return;
      }

      setStatus("loading");

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { first_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        setStatus("error");
        setErrorMsg(
          error.message === "User already registered"
            ? "This email is already signed up. Check your inbox for the verification link."
            : error.message || "Something went wrong. Please try again."
        );
        return;
      }

      setStatus("sent");

    } else {
      // Sign in
      if (!emailRegex.test(email)) {
        setStatus("error");
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      if (!password) {
        setStatus("error");
        setErrorMsg("Please enter your password.");
        return;
      }

      setStatus("loading");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        setStatus("error");
        setErrorMsg(
          error.message.toLowerCase().includes("invalid") ||
          error.message.toLowerCase().includes("credentials")
            ? "Incorrect email or password."
            : error.message || "Something went wrong. Please try again."
        );
        return;
      }

      // Route based on onboarding status
      const onboardingComplete = data.user?.user_metadata?.onboarding_complete;
      router.replace(onboardingComplete ? "/home" : "/onboarding");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-success">
        <div className="form-success-icon">✉</div>
        <div className="form-success-text">Check your Gmail.</div>
        <div className="form-success-sub">
          We sent a verification link to <strong style={{ color: "var(--ink)" }}>{email}</strong>.
          Click it to verify, then come back to sign in.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mode toggle */}
      <div className="auth-toggle">
        <button
          type="button"
          className={`auth-toggle-btn${mode === "signup" ? " active" : ""}`}
          onClick={() => switchMode("signup")}
        >
          Sign Up
        </button>
        <button
          type="button"
          className={`auth-toggle-btn${mode === "signin" ? " active" : ""}`}
          onClick={() => switchMode("signin")}
        >
          Sign In
        </button>
      </div>

      <form onSubmit={handleSubmit} className="signup-form" noValidate>
        <div className="signup-fields">
          {mode === "signup" && (
            <input
              type="text"
              className="waitlist-input"
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading"}
              autoComplete="given-name"
              suppressHydrationWarning
            />
          )}
          <input
            type="email"
            className="waitlist-input"
            placeholder="Gmail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            autoComplete="email"
            suppressHydrationWarning
          />
          <div className="pw-wrap">
            <input
              type={showPw ? "text" : "password"}
              className="waitlist-input"
              placeholder={mode === "signup" ? "Create a password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === "loading"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              suppressHydrationWarning
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              tabIndex={-1}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary signup-submit"
          disabled={status === "loading"}
          suppressHydrationWarning
        >
          {status === "loading"
            ? (mode === "signup" ? "Creating account…" : "Signing in…")
            : mode === "signup"
              ? <><span>Join Early Access</span> <span className="btn-arrow">→</span></>
              : <><span>Sign In</span> <span className="btn-arrow">→</span></>
          }
        </button>

        {status === "error" && (
          <div className="form-error">{errorMsg}</div>
        )}

        {mode === "signup" && status !== "error" && (
          <div className="form-fineprint">
            We&apos;ll send a verification link to your Gmail. No spam, ever.
          </div>
        )}
      </form>
    </div>
  );
}
