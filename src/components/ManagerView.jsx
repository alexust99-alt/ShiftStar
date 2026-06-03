import React, { useState } from "react";
import { ALL_METRICS, formatDate, initials, avatarColors } from "../data";
import {
  Card, CardLabel, GoldButton, GhostButton, Tabs,
  RecognitionCard, TeamBox, HistoryEntry, Empty,
  Field, Input, Select, Textarea, Avatar,
} from "./UI";

// ── EMPLOYEE ROW ────────────────────────────────────────────────────────
function EmployeeRow({ employee, index, selectedMetrics, onToggleMetric, onRemove }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "11px 12px", background: "var(--bg)",
      border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginBottom: 8,
    }}>
      <Avatar name={employee.name} index={index} size={34} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{employee.name}</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{employee.role}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {ALL_METRICS.map((m) => (
            <button
              key={m}
              onClick={() => onToggleMetric(index, m)}
              style={{
                fontSize: 11, padding: "3px 9px", borderRadius: 20, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.12s",
                border: selectedMetrics.includes(m) ? "1px solid var(--green-border)" : "1px solid var(--border)",
                background: selectedMetrics.includes(m) ? "var(--green-bg)" : "white",
                color: selectedMetrics.includes(m) ? "var(--green)" : "var(--muted)",
                fontWeight: selectedMetrics.includes(m) ? 500 : 400,
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <GhostButton onClick={() => onRemove(index)} style={{ padding: "5px 9px", fontSize: 12, flexShrink: 0 }}>
        ✕
      </GhostButton>
    </div>
  );
}

// ── RECOGNITION OUTPUT ──────────────────────────────────────────────────
function RecognitionOutput({ result, date, venue, stype, employees, onCopy, onBack }) {
  if (!result) return null;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{venue}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{formatDate(date)} · {stype}</div>
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{result.recognitions.length} recognized</span>
      </div>

      {result.recognitions.map((r) => {
        const empIndex = employees.findIndex((e) => e.name === r.name);
        return <RecognitionCard key={r.name} rec={r} empIndex={empIndex} onCopy={onCopy} />;
      })}

      {result.team_highlight && (
        <TeamBox text={result.team_highlight} onCopy={onCopy} />
      )}

      <GhostButton onClick={onBack} style={{ marginTop: "1rem" }}>← Log another shift</GhostButton>
    </div>
  );
}

// ── MAIN MANAGER VIEW ───────────────────────────────────────────────────
export default function ManagerView({ employees, setEmployees, history, setHistory, empData, setEmpData, onCopy }) {
  const [activeTab, setActiveTab] = useState("log");
  const [venue, setVenue] = useState("The Grand Brasserie");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [covers, setCovers] = useState("140");
  const [stype, setStype] = useState("Dinner service");
  const [notes, setNotes] = useState("Exceptionally busy Saturday — team handled a full house and a VIP table flawlessly.");
  const [selMetrics, setSelMetrics] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [currentMeta, setCurrentMeta] = useState(null);

  function toggleMetric(empIdx, metric) {
    setSelMetrics((prev) => {
      const cur = prev[empIdx] || [];
      const exists = cur.includes(metric);
      return { ...prev, [empIdx]: exists ? cur.filter((m) => m !== metric) : [...cur, metric] };
    });
  }

  function addEmployee() {
    const name = prompt("Employee name:");
    if (!name) return;
    const role = prompt("Role (e.g. Waiter, Bartender):") || "Team member";
    setEmployees((prev) => [...prev, { name, role }]);
    setEmpData((prev) => ({ ...prev, [employees.length]: { recs: [], badges: [], points: 0 } }));
  }

  function removeEmployee(i) {
    setEmployees((prev) => prev.filter((_, x) => x !== i));
  }

  async function generate() {
    const lines = employees.map((e, i) => {
      const m = selMetrics[i] || [];
      return `${e.name} (${e.role}): ${m.length ? m.join(", ") : "general performance"}`;
    }).join("\n");

    const prompt = `You are ShiftStar, an AI recognition engine for F&B hospitality teams. Generate warm, specific, and motivating recognition for each staff member.

Shift:
- Venue: ${venue}
- Date: ${date}
- Type: ${stype}
- Covers: ${covers}
- Manager notes: ${notes || "none"}

Staff:
${lines}

Reply ONLY with raw JSON (no markdown, no backticks, no preamble):
{"recognitions":[{"name":"","badge":"2-3 word badge","message":"3-4 sentence warm personal message","reward_suggestion":"short reward idea","points":50}],"team_highlight":"one celebratory paragraph for noticeboard"}`;

    setLoading(true);
    setActiveTab("rec");
    setCurrentResult(null);

    try {
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const raw = data.content.map((b) => b.text || "").join("");
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

      setCurrentResult(parsed);
      setCurrentMeta({ date, venue, stype });

      // Update history
      const entry = { date, venue, stype, covers, parsed };
      setHistory((prev) => [entry, ...prev]);

      // Update emp data
      setEmpData((prev) => {
        const updated = { ...prev };
        parsed.recognitions.forEach((r) => {
          const i = employees.findIndex((e) => e.name === r.name);
          if (i < 0) return;
          if (!updated[i]) updated[i] = { recs: [], badges: [], points: 0 };
          updated[i] = {
            recs: [{ date, message: r.message, badge: r.badge, venue }, ...updated[i].recs],
            badges: [r.badge, ...updated[i].badges],
            points: updated[i].points + (r.points || 50),
          };
        });
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong — check your server is running and try again.");
      setActiveTab("log");
    }

    setLoading(false);
  }

  const tabs = [
    { id: "log", label: "✦ Log shift" },
    { id: "rec", label: "Recognition" },
    { id: "hist", label: "History", count: history.length },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26 }}>Manager Dashboard</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          Log shifts, recognize standout staff, and build team morale
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* ── LOG SHIFT ── */}
      {activeTab === "log" && (
        <div>
          <Card>
            <CardLabel>Shift details</CardLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <Field label="Venue / outlet">
                <Input value={venue} onChange={(e) => setVenue(e.target.value)} />
              </Field>
              <Field label="Date">
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
              <Field label="Covers served">
                <Input type="number" value={covers} onChange={(e) => setCovers(e.target.value)} />
              </Field>
              <Field label="Shift type">
                <Select
                  value={stype}
                  onChange={(e) => setStype(e.target.value)}
                  options={["Dinner service", "Lunch service", "Brunch", "Event"]}
                />
              </Field>
            </div>
            <Field label="Manager notes (optional)">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </Field>
          </Card>

          <Card>
            <CardLabel>Tag standout employees</CardLabel>
            {employees.map((emp, i) => (
              <EmployeeRow
                key={i}
                employee={emp}
                index={i}
                selectedMetrics={selMetrics[i] || []}
                onToggleMetric={toggleMetric}
                onRemove={removeEmployee}
              />
            ))}
            <GhostButton onClick={addEmployee} style={{ marginTop: 4 }}>+ Add employee</GhostButton>
          </Card>

          <GoldButton onClick={generate} disabled={loading} loading={loading}>
            {loading ? "Generating..." : "✦ Generate AI Recognition"}
          </GoldButton>
        </div>
      )}

      {/* ── RECOGNITION ── */}
      {activeTab === "rec" && (
        <div>
          {loading && (
            <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)", fontSize: 14 }}>
              <span className="spinner dark" /> Writing personalized recognition messages...
            </div>
          )}
          {!loading && currentResult && (
            <RecognitionOutput
              result={currentResult}
              date={currentMeta.date}
              venue={currentMeta.venue}
              stype={currentMeta.stype}
              employees={employees}
              onCopy={onCopy}
              onBack={() => setActiveTab("log")}
            />
          )}
          {!loading && !currentResult && (
            <Empty>Generate recognition from the Log shift tab to see results here.</Empty>
          )}
        </div>
      )}

      {/* ── HISTORY ── */}
      {activeTab === "hist" && (
        <div>
          {history.length === 0 && <Empty>No history yet. Generate your first recognition above.</Empty>}
          {history.map((h, i) => (
            <HistoryEntry
              key={i}
              entry={h}
              onClick={() => {
                setCurrentResult(h.parsed);
                setCurrentMeta({ date: h.date, venue: h.venue, stype: h.stype });
                setActiveTab("rec");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
