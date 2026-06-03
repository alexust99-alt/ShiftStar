import React, { useState } from "react";
import { avatarColors, initials, formatDate } from "../data";
import { Avatar, BadgePill, Card, CardLabel, GhostButton, Tabs, Empty } from "./UI";

// ── EMPLOYEE SELECT SCREEN ───────────────────────────────────────────────
function LoginScreen({ employees, empData, onSelect }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem 0 1rem" }}>
      <div style={{ fontSize: 52, marginBottom: "1rem" }}>⭐</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26 }}>Your recognition hub</div>
      <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 8 }}>
        Select your name to see your badges, streak &amp; leaderboard
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360, margin: "1.5rem auto 0" }}>
        {employees.map((emp, i) => {
          const [bg, fg] = avatarColors(i);
          const d = empData[i] || { points: 0, badges: [] };
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", background: "var(--surface)",
                border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                width: "100%", transition: "all 0.14s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold-border)"; e.currentTarget.style.background = "var(--gold-bg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: bg, color: fg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, flexShrink: 0,
              }}>
                {initials(emp.name)}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{emp.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{emp.role}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20,
                  background: "var(--gold-bg)", color: "var(--gold-dark)", border: "1px solid var(--gold-border)",
                }}>
                  {d.points} pts
                </span>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  {d.badges.length} badge{d.badges.length !== 1 ? "s" : ""}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── STREAK DOTS ──────────────────────────────────────────────────────────
function StreakDots({ count }) {
  return (
    <div style={{ display: "flex", gap: 5, margin: "0.75rem 0 0.4rem" }}>
      {Array.from({ length: 7 }, (_, x) => {
        const lit = x < count;
        return (
          <div key={x} style={{
            width: 32, height: 32, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 13,
            background: lit ? "var(--gold)" : "var(--surface2)",
            border: lit ? "1px solid var(--gold-dark)" : "1px solid var(--border)",
            color: lit ? "white" : "transparent",
            transition: "all 0.2s",
          }}>
            {lit ? "★" : ""}
          </div>
        );
      })}
    </div>
  );
}

// ── LEADERBOARD ──────────────────────────────────────────────────────────
function Leaderboard({ employees, empData, currentIdx }) {
  const sorted = employees
    .map((e, i) => ({ name: e.name, points: (empData[i] || { points: 0 }).points, idx: i }))
    .sort((a, b) => b.points - a.points);
  const maxPts = sorted[0]?.points || 1;

  return (
    <Card>
      <CardLabel>Team leaderboard — all time</CardLabel>
      {sorted.map((e, pos) => {
        const [bg, fg] = avatarColors(e.idx);
        const isMe = e.idx === currentIdx;
        return (
          <div
            key={e.name}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: isMe ? "10px" : "10px 0",
              borderBottom: pos < sorted.length - 1 ? "1px solid var(--surface2)" : "none",
              background: isMe ? "var(--gold-bg)" : "transparent",
              borderRadius: isMe ? "var(--radius-sm)" : 0,
              margin: isMe ? "0 -10px" : 0,
            }}
          >
            <div style={{
              fontSize: pos === 0 ? 18 : 13, fontWeight: 600, width: 26, textAlign: "center",
              color: pos === 0 ? "var(--gold-dark)" : "var(--muted)",
            }}>
              {pos === 0 ? "🏆" : pos + 1}
            </div>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: bg, color: fg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>
              {initials(e.name)}
            </div>
            <span style={{ flex: 1, fontSize: 13, fontWeight: isMe ? 600 : 400 }}>
              {e.name}{isMe ? " (you)" : ""}
            </span>
            <div style={{ width: 80, height: 6, background: "var(--surface2)", borderRadius: 3 }}>
              <div style={{
                width: `${Math.round(e.points / maxPts * 100)}%`,
                height: 6, background: "var(--gold)", borderRadius: 3,
              }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--muted)", minWidth: 42, textAlign: "right" }}>
              {e.points} pts
            </span>
          </div>
        );
      })}
    </Card>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({ empIdx, employees, empData, onLogout }) {
  const [activeTab, setActiveTab] = useState("rec");
  const emp = employees[empIdx];
  const d = empData[empIdx] || { recs: [], badges: [], points: 0 };
  const [bg, fg] = avatarColors(empIdx);

  const allPts = employees.map((_, x) => (empData[x] || { points: 0 }).points);
  const rank = [...allPts].sort((a, b) => b - a).indexOf(d.points) + 1;

  const tabs = [
    { id: "rec", label: "My recognition" },
    { id: "badges", label: "My badges" },
    { id: "lb", label: "Leaderboard" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: bg, color: fg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 600,
        }}>
          {initials(emp.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 21 }}>{emp.name}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{emp.role}</div>
          <span style={{
            display: "inline-block", marginTop: 3, fontSize: 11, fontWeight: 600,
            padding: "2px 9px", borderRadius: 20,
            background: "var(--gold-bg)", color: "var(--gold-dark)", border: "1px solid var(--gold-border)",
          }}>
            {d.points} pts
          </span>
        </div>
        <GhostButton onClick={onLogout}>Switch ↩</GhostButton>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: "1.25rem" }}>
        {[
          { n: d.badges.length, l: "badges earned" },
          { n: d.recs.length, l: "shift streak" },
          { n: `#${rank}`, l: "team rank" },
        ].map(({ n, l }) => (
          <div key={l} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "1rem", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Streak */}
      <Card>
        <CardLabel>Recognition streak — recent shifts</CardLabel>
        <StreakDots count={d.recs.length} />
        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          Gold = shifts you were recognized · Grey = upcoming
        </p>
      </Card>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Recognition history */}
      {activeTab === "rec" && (
        <div>
          {d.recs.length === 0 && (
            <Empty>No recognitions yet.<br />Your manager will generate them after each shift.</Empty>
          )}
          {d.recs.map((r, i) => (
            <div key={i} className="fade-in" style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "0.875rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <BadgePill text={r.badge} />
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {formatDate(r.date)}{r.venue ? ` · ${r.venue}` : ""}
                </span>
              </div>
              <div style={{
                fontSize: 14, lineHeight: 1.75, background: "var(--bg)",
                borderRadius: "var(--radius-sm)", padding: "12px 14px",
                borderLeft: "3px solid var(--gold)",
              }}>
                {r.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badge wall */}
      {activeTab === "badges" && (
        <div>
          {d.badges.length === 0 && <Empty>No badges yet.</Empty>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0.5rem 0" }}>
            {d.badges.map((b, i) => (
              <div key={i} style={{
                fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: 24,
                background: "var(--gold-bg)", color: "var(--gold-dark)", border: "1px solid var(--gold-border)",
              }}>
                ★ {b}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === "lb" && (
        <Leaderboard employees={employees} empData={empData} currentIdx={empIdx} />
      )}
    </div>
  );
}

// ── MAIN EMPLOYEE VIEW ──────────────────────────────────────────────────
export default function EmployeeView({ employees, empData }) {
  const [selectedEmp, setSelectedEmp] = useState(null);

  if (selectedEmp === null) {
    return <LoginScreen employees={employees} empData={empData} onSelect={setSelectedEmp} />;
  }

  return (
    <Dashboard
      empIdx={selectedEmp}
      employees={employees}
      empData={empData}
      onLogout={() => setSelectedEmp(null)}
    />
  );
}
