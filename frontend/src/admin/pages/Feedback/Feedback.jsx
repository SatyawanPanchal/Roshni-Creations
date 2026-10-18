/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import { getAllFeedback, deleteFeedback } from "../../../services/feedbackApi.js";
import ErrorState from "../../components/common/ErrorState.jsx";

// top 3 most common values in an array field, e.g. liked / reasons
const topThree = (rows, key) => {
  const map = {};
  rows.forEach((r) => (r[key] || []).forEach((v) => (map[v] = (map[v] || 0) + 1)));
  return (
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${k} (${v})`)
      .join(", ") || "-"
  );
};

export default function Feedback() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [event, setEvent] = useState(null);
  const [purchased, setPurchased] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await getAllFeedback());      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const events = useMemo(() => [...new Set(rows.map((r) => r.event))], [rows]);
  console.log("data of feedback",rows)

  const filtered = useMemo(
    () => rows.filter((r) => (!event || r.event === event) && (!purchased || r.purchased === purchased)),
    [rows, event, purchased],
  );

  const stats = useMemo(() => {
    const total = filtered.length;
    const avg = total ? (filtered.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : "-";
    const bought = filtered.filter((r) => r.purchased === "yes").length;
    return {
      total,
      avg,
      buyRate: total ? Math.round((bought / total) * 100) : 0,
      likes: topThree(filtered, "liked"),
      reasons: topThree(filtered, "reasons"),
    };
  }, [filtered]);

  const remove = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await deleteFeedback(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const exportCsv = () => {
    const head = ["Date", "Event", "Rating", "Liked", "Purchased", "Reasons", "Suggestion", "Name", "Contact", "Updates OK"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = filtered.map((r) =>
      [
        new Date(r.createdAt).toLocaleString("en-IN"),
        r.event,
        r.rating,
        r.liked.join("; "),
        r.purchased,
        r.reasons.join("; "),
        r.suggestion,
        r.name,
        r.contact,
        r.optIn ? "Yes" : "No",
      ]
        .map(esc)
        .join(","),
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "feedback.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rc-card">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div className="tw:grid tw:grid-cols-2 tw:lg:grid-cols-5 tw:gap-3.5 tw:mb-5">
        <Stat label="Responses" value={stats.total} />
        <Stat label="Average rating (of 5)" value={stats.avg} />
        <Stat label="Purchase rate" value={`${stats.buyRate}%`} />
        <Stat label="Top likes" value={stats.likes} small />
        <Stat label="Top reasons not bought" value={stats.reasons} small />
      </div>

      {/* Filters */}
      <div className="rc-card tw:p-4 tw:mb-4 tw:flex tw:flex-wrap tw:gap-2.5 tw:items-center">
        <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
        <Dropdown value={event} options={events} onChange={(e) => setEvent(e.value)} placeholder="All events" showClear />
        <Dropdown
          value={purchased}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "Thinking", value: "thinking" },
          ]}
          onChange={(e) => setPurchased(e.value)}
          placeholder="Purchased?"
          showClear
        />
        <Button label="Export CSV" icon="pi pi-download" onClick={exportCsv} className="tw:ml-auto" />
      </div>

      {/* Table */}
      <div className="rc-card">
        <DataTable
          value={filtered}
          globalFilter={search}
          paginator
          rows={10}
          stripedRows
          scrollable
          emptyMessage="No feedback yet"
        >
          <Column header="Date" body={(r) => new Date(r.createdAt).toLocaleDateString("en-IN")} sortable sortField="createdAt" />
          <Column field="event" header="Event" sortable />
          <Column field="rating" header="Rating" sortable />
          <Column header="Liked" body={(r) => r.liked.join(", ")} />
          <Column field="purchased" header="Purchased" sortable />
          <Column header="Reasons" body={(r) => r.reasons.join(", ")} />
          <Column field="suggestion" header="Suggestion" style={{ minWidth: "14rem" }} />
          <Column field="name" header="Name" />
          <Column field="contact" header="Contact" />
          <Column header="Updates OK" body={(r) => (r.optIn ? "Yes" : "No")} />
          <Column body={(r) => <Button icon="pi pi-trash" severity="danger" text onClick={() => remove(r._id)} />} />
        </DataTable>
      </div>
    </div>
  );
}

function Stat({ label, value, small }) {
  return (
    <div className="rc-card tw:p-4">
      <div className={"font-display " + (small ? "tw:text-sm" : "tw:text-lg")}>{value}</div>
      <div className="tw:text-[12px] tw:text-[#5E6D67]">{label}</div>
    </div>
  );
}