import React, { useState, useEffect } from "react";
import { SEED_EMPLOYEES, SEED_HISTORY, buildEmpDataFromHistory } from "./data";
import ManagerView from "./components/ManagerView";
import EmployeeView from "./components/EmployeeView";

export default function App() {
  const [role, setRole] = useState("manager");
  const [employees, setEmployees] = useState(SEED_EMPLOYEES);
  const [history, setHistory] = useState(SEED_HISTORY);
  const [empData, setEmpData] = useState(() => buildEmpDataFromHistory(SEED_EMPLOYEES, SEED_HISTORY));
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  function showToast(msg) {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => showToast("Copied to clipboard!"))
      .catch(() => showToast("Copy failed — please copy manually"));
  }

  return (
    <>
      {/* ── NAV ── */}
      <nav style={{
        background: "white", borderBottom: "1px solid var(--border)",
        height: 58, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 1.5rem",
        position: "sticky", top: 0, zIndex: 200,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: "var(--gold)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 18, fontFamily: "'DM Serif Display', serif",
          }}>
            ★
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>ShiftStar</span>
          <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 2 }}>F&amp;B Recognition</span>
        </div>

        <div style={{
          display: "flex", background: "var(--surface2)",
          borderRadius: 8, padding: 3, gap: 2,
        }}>
          {["manager", "employee"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: "6px 18px", border: "none", borderRadius: 6,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "all 0.15s",
                background: role === r ? "white" : "transparent",
                color: role === r ? "var(--ink)" : "var(--muted)",
                boxShadow: role === r ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {r === "manager" ? "👔 Manager" : "👤 Employee"}
            </button>
          ))}
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "1.75rem 1.25rem" }}>
        {role === "manager" ? (
          <ManagerView
            employees={employees}
            setEmployees={setEmployees}
            history={history}
            setHistory={setHistory}
            empData={empData}
            setEmpData={setEmpData}
            onCopy={copyToClipboard}
          />
        ) : (
          <EmployeeView employees={employees} empData={empData} />
        )}
      </div>

      {/* ── TOAST ── */}
      <div className={`toast${toastVisible ? " show" : ""}`}>{toastMsg}</div>
    </>
  );
}
