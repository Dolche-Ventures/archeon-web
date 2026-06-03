"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { PagebuilderType } from "@/types";

const SUPABASE_URL = "https://isyygjaviypkemhgquhj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzeXlnamF2aXlwa2VtaGdxdWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjU3NzQsImV4cCI6MjA4NjUwMTc3NH0.OJs-ppULDuUWABE6mY143o6jYpacw1SCGsIw0K4SpkE";
const WEBHOOK_URL = "https://api.dolche.ventures/webhook/archeon-quiz";

const STATUS_COLORS: Record<string, string> = {
  green: "#22C55E",
  yellow: "#EAB308",
  red: "#EF4444",
  neutral: "#6B7280",
};

const QUESTIONS_META = [
  { key: "q1", selectType: "single" as const },
  { key: "q2", selectType: "single" as const },
  { key: "q3", selectType: "multi" as const },
  { key: "q4", selectType: "single" as const },
  { key: "q5", selectType: "single" as const },
  { key: "q6", selectType: "single" as const },
];

type QuizOption = {
  label?: string;
  value?: string;
  statusColor?: string;
};

type QuizBlockProps = PagebuilderType<"quizBlock">;

export function QuizBlock(props: QuizBlockProps) {
  const {
    brandMark,
    introHeading,
    introSubheading,
    introButtonText,
    q1_title,
    q1_provocative,
    q1_options,
    q2_title,
    q2_provocative,
    q2_options,
    q3_title,
    q3_provocative,
    q3_options,
    q4_title,
    q4_provocative,
    q4_options,
    q5_title,
    q5_provocative,
    q5_options,
    q6_title,
    q6_provocative,
    q6_options,
    captureHeading,
    captureSubheading,
    captureButtonText,
    captureFinePrint,
    thankYouHeading,
    thankYouSubheading,
    bookCallLinkText,
    bookCallUrl,
  } = props;

  const questions = [
    { title: q1_title, provocativeText: q1_provocative, options: q1_options, selectType: "single" },
    { title: q2_title, provocativeText: q2_provocative, options: q2_options, selectType: "single" },
    { title: q3_title, provocativeText: q3_provocative, options: q3_options, selectType: "multi" },
    { title: q4_title, provocativeText: q4_provocative, options: q4_options, selectType: "single" },
    { title: q5_title, provocativeText: q5_provocative, options: q5_options, selectType: "single" },
    { title: q6_title, provocativeText: q6_provocative, options: q6_options, selectType: "single" },
  ];

  const [currentScreen, setCurrentScreen] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    q1: null, q2: null, q3: [], q4: null, q5: null, q6: null,
  });
  const [form, setForm] = useState({ name: "", business: "", email: "" });
  const [errors, setErrors] = useState({ name: false, business: false, email: false });
  const [submitting, setSubmitting] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((target: number) => setCurrentScreen(target), []);

  const isActive = (index: number) => currentScreen === index;

  const progressPercent =
    currentScreen >= 1 && currentScreen <= 6
      ? (currentScreen / 6) * 100
      : 0;

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    setTimeout(handleHash, 500);
  }, []);

  return (
    <>
      <style>{`
        .quiz-root *,
        .quiz-root *::before,
        .quiz-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .quiz-root { width: 100%; max-width: 800px; margin: 0 auto; padding: 24px 16px; min-height: 100vh; position: relative; }
        .quiz-stage { position: relative; width: 100%; min-height: 100vh; overflow-y: auto; }
        .quiz-screen { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 48px 24px 64px; opacity: 0; pointer-events: none; transform: translateX(40px); transition: opacity 280ms ease-out, transform 280ms ease-out; overflow-y: auto; }
        .quiz-screen.active { opacity: 1; pointer-events: all; transform: translateX(0); }
        .quiz-card { width: 100%; max-width: 640px; }
        .quiz-brand-mark { font-size: 0.875rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-muted-foreground); margin-bottom: 40px; }
        .quiz-label-step { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-muted-foreground); margin-bottom: 20px; }
        .quiz-divider { width: 40px; height: 2px; background: var(--color-primary); margin: 28px 0; }
        .quiz-options-list { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
        .quiz-option-tile { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border: 1.5px solid var(--color-border, #404040); border-radius: 10px; background: var(--color-card); color: var(--color-foreground); font-family: inherit; font-size: 0.9375rem; cursor: pointer; transition: border-color 280ms ease-out, background 280ms ease-out, box-shadow 280ms ease-out; text-align: left; width: 100%; outline: none; -webkit-tap-highlight-color: transparent; }
        .quiz-option-tile:hover { border-color: var(--color-ring); background: var(--color-muted); }
        .quiz-option-tile.selected { border-color: var(--color-ring); background: var(--color-muted); box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-ring) 20%, transparent); }
        .quiz-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .quiz-checkbox { width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid var(--color-border, #404040); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 280ms ease-out, background 280ms ease-out; }
        .quiz-option-tile.selected .quiz-checkbox { border-color: var(--color-primary); background: var(--color-primary); }
        .quiz-option-tile.selected .quiz-checkbox svg { opacity: 1; }
        .quiz-checkbox svg { opacity: 0; transition: opacity 150ms ease; }
        .quiz-form-group { display: flex; flex-direction: column; gap: 10px; margin-top: 28px; }
        .quiz-form-input { padding: 14px 18px; background: var(--color-card); border: 1.5px solid var(--color-border, #404040); border-radius: 10px; color: var(--color-foreground); font-family: inherit; font-size: 1rem; outline: none; transition: border-color 280ms ease-out, box-shadow 280ms ease-out; }
        .quiz-form-input::placeholder { color: var(--color-muted-foreground); }
        .quiz-form-input:focus { border-color: var(--color-ring); box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-ring) 20%, transparent); }
        .quiz-form-input.error { border-color: #EF4444; }
        .quiz-error-msg { font-size: 0.82rem; color: #EF4444; margin-top: -4px; display: none; }
        .quiz-error-msg.visible { display: block; }
        .quiz-btn-primary { display: inline-flex; align-items: center; gap: 8px; margin-top: 32px; padding: 15px 28px; background: var(--color-primary); color: var(--color-primary-foreground); border: none; border-radius: 10px; font-family: inherit; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 280ms ease-out, transform 120ms ease, box-shadow 280ms ease-out; outline: none; }
        .quiz-btn-primary:hover { background: var(--color-primary); box-shadow: 0 0 0 8px color-mix(in srgb, var(--color-ring) 20%, transparent); }
        .quiz-btn-primary:active { transform: scale(0.98); }
        .quiz-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
        .quiz-btn-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: var(--color-muted-foreground); font-family: inherit; font-size: 0.875rem; cursor: pointer; padding: 8px 0; margin-bottom: 28px; transition: color 280ms ease-out; outline: none; }
        .quiz-btn-back:hover { color: var(--color-muted-foreground); }
        .quiz-btn-back svg { width: 14px; height: 14px; flex-shrink: 0; }
        .quiz-fine-print { font-size: 0.78rem; color: var(--color-muted-foreground); line-height: 1.5; margin-top: 14px; }
        .quiz-geo-accent { width: 64px; height: 64px; margin-bottom: 28px; flex-shrink: 0; }
        @media (max-width: 480px) { .quiz-screen { padding: 24px 18px; } .quiz-btn-primary { width: 100%; justify-content: center; } }
        @media (max-height: 600px) { .quiz-screen { justify-content: flex-start; padding-top: 48px; } }
      `}</style>

      <div className="quiz-root">
        {currentScreen >= 1 && currentScreen <= 6 && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 2, background: "var(--color-border, #404040)", zIndex: 100 }}>
            <div style={{ height: "100%", background: "var(--color-primary)", width: `${progressPercent}%`, transition: "width 320ms ease-out" }} />
          </div>
        )}

        <div className="quiz-stage" ref={stageRef}>
          {/* INTRO SCREEN */}
          <div className={`quiz-screen ${isActive(0) ? "active" : ""}`} style={{ position: "absolute", inset: 0 }}>
            <div className="quiz-card">
              <div className="quiz-brand-mark">{brandMark || "Archeon"}</div>
              <h1 style={{ fontFamily: "var(--font-heading, Geist, sans-serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, lineHeight: 1.15, color: "var(--color-foreground)", letterSpacing: "-0.02em" }}>{introHeading}</h1>
              <div className="quiz-divider" />
              <p style={{ fontSize: "1rem", color: "var(--color-muted-foreground)", lineHeight: 1.6, marginTop: 14 }}>{introSubheading}</p>
              <button className="quiz-btn-primary" onClick={() => goTo(1)}>
                {introButtonText || "Find out where I stand"}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>

          {/* QUESTIONS 1-6 */}
          {questions.map((q, i) => {
            const screenNum = i + 1;
            const questionKey = `q${screenNum}`;
            const isMulti = QUESTIONS_META[i]?.selectType === "multi";
            const options = (q.options as QuizOption[] | undefined) ?? [];

            const handleSingleSelect = (value: string) => {
              setAnswers((prev) => ({ ...prev, [questionKey]: value }));
              setTimeout(() => goTo(screenNum + 1), 220);
            };

            const handleMultiToggle = (value: string) => {
              const current: string[] = answers[questionKey] || [];
              if (value === "None of the above") {
                setAnswers((prev) => ({ ...prev, [questionKey]: ["None of the above"] }));
              } else {
                const withoutNone = current.filter((v) => v !== "None of the above");
                const idx = withoutNone.indexOf(value);
                const next = idx >= 0 ? withoutNone.filter((v) => v !== value) : [...withoutNone, value];
                setAnswers((prev) => ({ ...prev, [questionKey]: next }));
              }
            };

            const isSelected = (value: string) =>
              isMulti ? (answers[questionKey] || []).includes(value) : answers[questionKey] === value;

            const canContinue = isMulti ? (answers[questionKey] || []).length > 0 : true;

            return (
              <div key={screenNum} className={`quiz-screen ${isActive(screenNum) ? "active" : ""}`} style={{ position: "absolute", inset: 0 }}>
                <div className="quiz-card">
                  <button className="quiz-btn-back" onClick={() => goTo(screenNum - 1)}>
                    <svg viewBox="0 0 14 14" fill="none"><path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Back
                  </button>
                  <div className="quiz-label-step">Question {screenNum} of 6</div>
                  <h2 style={{ fontFamily: "var(--font-heading, Geist, sans-serif)", fontSize: "clamp(1.35rem, 3vw, 1.875rem)", fontWeight: 700, lineHeight: 1.2, color: "var(--color-foreground)", letterSpacing: "-0.015em" }}>{q.title}</h2>
                  {q.provocativeText && (
                    <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)", fontStyle: "italic", marginTop: 8, marginBottom: 28 }}>{q.provocativeText}</p>
                  )}
                  <div className="quiz-options-list">
                    {options.map((opt, oi) => {
                      const selected = isSelected(opt.value ?? "");
                      return (
                        <button key={oi} className={`quiz-option-tile ${selected ? "selected" : ""}`} onClick={() => { if (isMulti) { handleMultiToggle(opt.value ?? ""); } else { handleSingleSelect(opt.value ?? ""); } }}>
                          {screenNum === 1 && opt.statusColor && <span className="quiz-dot" style={{ background: STATUS_COLORS[opt.statusColor] || "#6B7280" }} />}
                          {isMulti && (
                            <span className="quiz-checkbox">
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </span>
                          )}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {isMulti && (
                    <button className="quiz-btn-primary" disabled={!canContinue} onClick={() => goTo(screenNum + 1)}>
                      Continue
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* CAPTURE SCREEN */}
          <div className={`quiz-screen ${isActive(7) ? "active" : ""}`} style={{ position: "absolute", inset: 0 }}>
            <div className="quiz-card">
              <button className="quiz-btn-back" onClick={() => goTo(6)}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
              <h2 style={{ fontFamily: "var(--font-heading, Geist, sans-serif)", fontSize: "clamp(1.35rem, 3vw, 1.875rem)", fontWeight: 700, lineHeight: 1.2, color: "var(--color-foreground)", letterSpacing: "-0.015em" }}>{captureHeading}</h2>
              <p style={{ fontSize: "1rem", color: "var(--color-muted-foreground)", lineHeight: 1.6, marginTop: 14 }}>{captureSubheading}</p>
              <div className="quiz-form-group">
                <input className={`quiz-form-input ${errors.name ? "error" : ""}`} type="text" placeholder="Full name" autoComplete="name" value={form.name} onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: false })); }} />
                <span className={`quiz-error-msg ${errors.name ? "visible" : ""}`}>Please enter your full name.</span>
                <input className={`quiz-form-input ${errors.business ? "error" : ""}`} type="text" placeholder="Business name" autoComplete="organization" value={form.business} onChange={(e) => { setForm((p) => ({ ...p, business: e.target.value })); setErrors((p) => ({ ...p, business: false })); }} />
                <span className={`quiz-error-msg ${errors.business ? "visible" : ""}`}>Please enter your business name.</span>
                <input className={`quiz-form-input ${errors.email ? "error" : ""}`} type="email" placeholder="Work email" autoComplete="email" value={form.email} onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: false })); }} />
                <span className={`quiz-error-msg ${errors.email ? "visible" : ""}`}>Please enter a valid work email.</span>
              </div>
              <button className="quiz-btn-primary" disabled={submitting} onClick={async () => {
                const name = form.name.trim();
                const business = form.business.trim();
                const email = form.email.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                let hasError = false;
                if (!name) { setErrors((p) => ({ ...p, name: true })); hasError = true; }
                if (!business) { setErrors((p) => ({ ...p, business: true })); hasError = true; }
                if (!emailRegex.test(email)) { setErrors((p) => ({ ...p, email: true })); hasError = true; }
                if (hasError) return;
                setSubmitting(true);
                const payload = { name, business_name: business, email, q1_data_structure: answers.q1, q2_consultant_history: answers.q2, q3_tech_stack: answers.q3, q4_data_usage: answers.q4, q5_ai_automation: answers.q5, q6_priority: answers.q6 };
                try { await fetch(`${SUPABASE_URL}/rest/v1/src_lead_magnet`, { method: "POST", headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(payload) }); } catch { console.error("Supabase insert failed"); }
                try { await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); } catch { console.warn("Webhook failed (non-critical)"); }
                goTo(8);
              }}>
                {submitting ? "Sending\u2026" : captureButtonText || "Send me my assessment"}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <p className="quiz-fine-print">{captureFinePrint}</p>
            </div>
          </div>

          {/* THANK YOU SCREEN */}
          <div className={`quiz-screen ${isActive(8) ? "active" : ""}`} style={{ position: "absolute", inset: 0, textAlign: "center" }}>
            <div className="quiz-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg className="quiz-geo-accent" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="8" width="48" height="48" rx="4" stroke="var(--color-primary)" strokeWidth="1.5" transform="rotate(45 32 32)" strokeDasharray="135" strokeDashoffset="0" />
                <circle cx="32" cy="32" r="4" fill="var(--color-primary)" />
              </svg>
              <h1 style={{ fontFamily: "var(--font-heading, Geist, sans-serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, lineHeight: 1.15, color: "var(--color-foreground)", letterSpacing: "-0.02em" }}>{thankYouHeading}</h1>
              <p style={{ fontSize: "1rem", color: "var(--color-muted-foreground)", lineHeight: 1.6, marginTop: 14, maxWidth: 460 }}>
                {thankYouSubheading?.split(bookCallLinkText || "book a call with us").map((part: string, i: number, arr: string[]) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && bookCallUrl?.href && (
                      <a href={bookCallUrl.href} target={bookCallUrl?.openInNewTab ? "_blank" : undefined} rel={bookCallUrl?.openInNewTab ? "noopener noreferrer" : undefined} style={{ color: "var(--color-foreground)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                        {bookCallLinkText || "book a call with us"}
                      </a>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
