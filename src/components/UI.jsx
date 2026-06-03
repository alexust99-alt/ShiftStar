import React from "react";
import { initials, avatarColors, formatDate } from "../data";

// ── AVATAR ──────────────────────────────────────────────────────────────
export function Avatar({ name, index, size = 36 }) {
  const [bg, fg] = avatarColors(index);
  const fontSize = size < 32 ? 11 : size < 42 ? 13 : 15;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 600, flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}

// ── BADGE PILL ──────────────────────────────────────────────────────────
export function BadgePill({ text, large = false }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: large ? 13 : 11, fontWeight: 600,
      padding: large ? "6px 14px" : "3px 11px",
      borderRadius: 20,
      background: "var(--gold-bg)", color: "var(--gold-dark)",
      border: "1px solid var(--gold-border)",
    }}>
      ★ {text}
    </span>
  );
}

// ── CARD ────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "1.25rem",
      marginBottom: "1rem", ...style,
    }}>
      {children}
    </div>
  );
}

// ── CARD LABEL ──────────────────────────────────────────────────────────
export function CardLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.07em",
      textTransform: "uppercase", color: "var(--faint)", marginBottom: "0.875rem",
    }}>
      {children}
    </div>
  );
}

// ── GOLD BUTTON ─────────────────────────────────────────────────────────
export function GoldButton({ onClick, disabled, loading, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "12px",
        background: disabled ? "var(--faint)" : "var(--gold)",
        border: "none", borderRadius: "var(--radius-sm)",
        fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
        color: "white", cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        marginBottom: "1rem", transition: "background 0.15s",
      }}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}

// ── GHOST BUTTON ────────────────────────────────────────────────────────
export function GhostButton({ onClick, children, style = {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "7px 14px",
        background: hover ? "var(--surface2)" : "transparent",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: hover ? "var(--ink)" : "var(--muted)",
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
        transition: "all 0.14s", ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── TABS ────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
      {tabs.map((t) => (
        <div
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer",
            color: active === t.id ? "var(--gold-dark)" : "var(--muted)",
            borderBottom: active === t.id ? "2px solid var(--gold)" : "2px solid transparent",
            marginBottom: -1, transition: "all 0.15s", whiteSpace: "nowrap",
          }}
        >
          {t.label}
          {t.count != null && (
            <span style={{
              display: "inline-flex", width: 18, height: 18,
              background: "var(--gold)", color: "white",
              borderRadius: "50%", fontSize: 10, fontWeight: 600,
              alignItems: "center", justifyContent: "center",
              marginLeft: 5, verticalAlign: "middle",
            }}>
              {t.count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── RECOGNITION CARD ────────────────────────────────────────────────────
export function RecognitionCard({ rec, empIndex, onCopy }) {
  return (
    <div className="fade-in" style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "0.875rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 11 }}>
        <Avatar name={rec.name} index={empIndex >= 0 ? empIndex : 0} size={38} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{rec.name}</div>
          <BadgePill text={rec.badge} />
        </div>
        {rec.points && (
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gold-dark)" }}>
            +{rec.points} pts
          </span>
        )}
      </div>

      <div style={{
        fontSize: 14, lineHeight: 1.75, color: "var(--ink)",
        background: "var(--bg)", borderRadius: "var(--radius-sm)",
        padding: "12px 14px", marginBottom: 10,
        borderLeft: "3px solid var(--gold)",
      }}>
        {rec.message}
      </div>

      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
        🎁 Suggested reward: <strong style={{ color: "var(--ink)" }}>{rec.reward_suggestion}</strong>
      </div>

      <div style={{ display: "flex", gap: 7 }}>
        <GhostButton onClick={() => onCopy(rec.message)}>Copy message</GhostButton>
        <GhostButton onClick={() => onCopy(`${rec.name} — ${rec.badge}\n\n${rec.message}`)}>
          Copy full card
        </GhostButton>
      </div>
    </div>
  );
}

// ── TEAM HIGHLIGHT BOX ──────────────────────────────────────────────────
export function TeamBox({ text, onCopy }) {
  return (
    <div style={{
      background: "var(--gold-bg)", border: "1px solid var(--gold-border)",
      borderRadius: "var(--radius)", padding: "1.25rem", marginTop: "0.75rem",
    }}>
      <div style={{
        fontSize: 12, fontWeight: 600, color: "var(--gold-dark)",
        letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7,
      }}>
        ⭐ Team highlight — ready to share
      </div>
      <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.7 }}>{text}</p>
      <GhostButton onClick={() => onCopy(text)} style={{ marginTop: 11 }}>
        Copy for noticeboard / group chat
      </GhostButton>
    </div>
  );
}

// ── HISTORY ENTRY ───────────────────────────────────────────────────────
export function HistoryEntry({ entry, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 14px",
        background: hover ? "var(--gold-bg)" : "var(--surface)",
        border: `1px solid ${hover ? "var(--gold-border)" : "var(--border)"}`,
        borderRadius: "var(--radius-sm)", marginBottom: 8, cursor: "pointer",
        transition: "all 0.14s",
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{entry.venue}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          {formatDate(entry.date)} · {entry.stype} · {entry.parsed.recognitions.length} staff recognized
        </div>
      </div>
      <span style={{ color: "var(--faint)", fontSize: 20 }}>›</span>
    </div>
  );
}

// ── EMPTY STATE ─────────────────────────────────────────────────────────
export function Empty({ children }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--muted)", fontSize: 14 }}>
      {children}
    </div>
  );
}

// ── FORM FIELD ──────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>{label}</label>
      {children}
    </div>
  );
}

export function Input({ value, onChange, type = "text", placeholder }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--ink)",
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)", padding: "9px 12px", width: "100%", outline: "none",
      }}
    />
  );
}

export function Select({ value, onChange, options }) {
  return (
    <select
      value={value} onChange={onChange}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--ink)",
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)", padding: "9px 12px", width: "100%", outline: "none",
      }}
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

export function Textarea({ value, onChange, rows = 2, placeholder }) {
  return (
    <textarea
      value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--ink)",
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)", padding: "9px 12px", width: "100%",
        outline: "none", resize: "vertical",
      }}
    />
  );
}
