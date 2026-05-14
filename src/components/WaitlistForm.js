"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    // basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    // Insert the email into the Supabase waitlist table.
    // We normalize the email (trim whitespace, lowercase) for consistency.
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      // Postgres error code 23505 = unique constraint violation
      // (i.e. this email is already on the waitlist).
      if (error.code === "23505") {
        setStatus("success"); // treat as success — they're already in
      } else {
        console.error("Supabase insert error:", error);
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="form-success">
        <div className="form-success-icon">✓</div>
        <div className="form-success-text">You&apos;re on the list.</div>
        <div className="form-success-sub">We&apos;ll be in touch when Vera opens up.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="waitlist-form" noValidate>
      <div className="form-row">
        <input
          type="email"
          className="waitlist-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          aria-label="Email address"
          required
          suppressHydrationWarning
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "loading"}
          suppressHydrationWarning
        >
          {status === "loading" ? "Joining…" : (
            <>
              Join Early Access <span className="btn-arrow">→</span>
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <div className="form-error">{errorMsg}</div>
      )}

      <div className="form-fineprint">No spam. Just one email when Vera opens up.</div>
    </form>
  );
}
