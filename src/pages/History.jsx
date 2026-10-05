import {
  Search,
  Filter,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Eye,
  Trash2,
  ArrowLeft,
  ScanLine,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  X,
  RefreshCw,
  Database,
  Activity,
  Brain,
  BarChart3,
  Leaf,
  Target,
  Zap,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH REAL HISTORY
  // ============================================================

  const fetchHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/history"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch scan history.");
      }

      const data = await response.json();

      if (data.success) {
        setScans(data.scans || []);
      } else {
        throw new Error("Unable to load scan history.");
      }
    } catch (err) {
      console.error("History fetch error:", err);

      setError(
        "Unable to connect to FoodAI server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // TIME
  // ============================================================

  const formatTime = (dateString) => {
    if (!dateString) return "--";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================
  // NORMALIZE DATA
  // ============================================================

  const normalizedScans = useMemo(() => {
    return scans.map((scan, index) => ({
      ...scan,

      id:
        scan.id ||
        scan._id ||
        `scan-${index}`,

      food: scan.food || "Unknown",

      quality: scan.quality || "Unknown",

      confidence:
        typeof scan.food_confidence === "number"
          ? scan.food_confidence
          : 0,

      qualityConfidence:
        typeof scan.quality_confidence === "number"
          ? scan.quality_confidence
          : 0,

      date: formatDate(scan.created_at),

      time: formatTime(scan.created_at),

      filename: scan.filename || "Food image",
    }));
  }, [scans]);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredScans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedScans.filter((scan) => {
      const matchesSearch =
        !query ||
        scan.food.toLowerCase().includes(query) ||
        scan.filename.toLowerCase().includes(query) ||
        scan.quality.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "Fresh" &&
          scan.quality === "Fresh") ||
        (filter === "Attention" &&
          ["Rotten", "Unknown", "Unavailable"].includes(
            scan.quality
          ));

      return matchesSearch && matchesFilter;
    });
  }, [normalizedScans, search, filter]);

  // ============================================================
  // STATS
  // ============================================================

  const totalScans = scans.length;

  const freshScans = scans.filter(
    (scan) => scan.quality === "Fresh"
  ).length;

  const attentionScans = scans.filter((scan) =>
    ["Rotten", "Unknown", "Unavailable"].includes(
      scan.quality
    )
  ).length;

  const averageConfidence =
    scans.length > 0
      ? Math.round(
          scans.reduce(
            (total, scan) =>
              total +
              (typeof scan.food_confidence === "number"
                ? scan.food_confidence
                : 0),
            0
          ) / scans.length
        )
      : 0;

  const freshRate =
    totalScans > 0
      ? Math.round((freshScans / totalScans) * 100)
      : 0;

  // ============================================================
  // DELETE
  // ============================================================

  const deleteScan = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this scan?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/history/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.detail || "Unable to delete scan."
        );
      }

      setScans((current) =>
        current.filter(
          (scan) =>
            scan.id !== id &&
            scan._id !== id
        )
      );
    } catch (err) {
      console.error("Delete error:", err);

      alert(
        "Unable to delete this scan. Please check the backend."
      );
    }
  };

  // ============================================================
  // STATUS
  // ============================================================

  const getStatusStyle = (quality) => {
    if (quality === "Fresh") {
      return {
        badge:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: <CheckCircle2 size={13} />,
        dot: "bg-emerald-500",
        iconBox:
          "bg-emerald-50 text-emerald-600",
        label: "Fresh",
      };
    }

    if (quality === "Rotten") {
      return {
        badge:
          "border-red-200 bg-red-50 text-red-700",
        icon: <AlertTriangle size={13} />,
        dot: "bg-red-500",
        iconBox:
          "bg-red-50 text-red-600",
        label: "Needs Attention",
      };
    }

    if (quality === "Unavailable") {
      return {
        badge:
          "border-slate-200 bg-slate-100 text-slate-600",
        icon: <AlertTriangle size={13} />,
        dot: "bg-slate-400",
        iconBox:
          "bg-slate-100 text-slate-500",
        label: "Unavailable",
      };
    }

    return {
      badge:
        "border-amber-200 bg-amber-50 text-amber-700",
      icon: <AlertTriangle size={13} />,
      dot: "bg-amber-500",
      iconBox:
        "bg-amber-50 text-amber-600",
      label: "Review",
    };
  };

  // ============================================================
  // CONFIDENCE
  // ============================================================

  const getConfidenceText = (confidence) => {
    if (confidence >= 90) return "High confidence";
    if (confidence >= 70) return "Good confidence";
    if (confidence >= 50) return "Moderate confidence";

    return "Low confidence";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f6f5] text-slate-900">

        <div className="flex min-h-screen items-center justify-center px-5">

          <div className="relative w-full max-w-sm overflow-hidden rounded-[30px] border border-slate-200 bg-white p-10 text-center shadow-xl">

            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-100 blur-3xl" />

            <div className="relative">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl">

                <RefreshCw
                  size={25}
                  className="animate-spin"
                />

              </div>

              <h2 className="mt-6 text-xl font-bold text-slate-950">
                Loading scan history
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fetching your FoodAI analysis records...
              </p>

              <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">

                <div className="h-full w-2/3 animate-pulse rounded-full bg-emerald-500" />

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f2f6f5] text-slate-900">

      {/* ========================================================
          PREMIUM HERO
      ======================================================== */}

      <section className="relative overflow-hidden bg-slate-950">

        <div className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-7 sm:px-8 lg:px-8">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <button
                onClick={() => navigate(-1)}
                className="mb-7 flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Back
              </button>

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  <ScanLine size={15} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  FoodAI Intelligence
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  AI Records
                </span>

              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Scan History
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Review your previous food recognition and quality
                analyses in one intelligent workspace.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => fetchHistory(true)}
                disabled={refreshing}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                title="Refresh history"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />
              </button>

              <button
                onClick={() => navigate("/scan")}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                <ScanLine size={17} />
                New Scan
                <ChevronRight
                  size={15}
                  className="transition group-hover:translate-x-0.5"
                />
              </button>

            </div>

          </div>

          {/* HERO MINI METRICS */}

          <div className="mt-9 grid gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300">
                    <Database size={16} />
                  </div>

                  <div>

                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      Total analyses
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-white">
                      {totalScans}
                    </p>

                  </div>

                </div>

                <TrendingUp
                  size={16}
                  className="text-emerald-400"
                />

              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Leaf size={16} />
                </div>

                <div>

                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Fresh rate
                  </p>

                  <p className="mt-0.5 text-xl font-bold text-white">
                    {freshRate}%
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                  <Brain size={16} />
                </div>

                <div>

                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    AI confidence
                  </p>

                  <p className="mt-0.5 text-xl font-bold text-white">
                    {averageConfidence}%
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={18} />
              </div>

              <div>

                <p className="text-sm font-bold text-red-800">
                  Unable to load history
                </p>

                <p className="mt-1 text-xs text-red-700">
                  {error}
                </p>

              </div>

            </div>

            <button
              onClick={() => fetchHistory()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={14} />
              Retry
            </button>

          </div>
        )}

        {/* ======================================================
            ANALYTICS
        ====================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-slate-100 blur-2xl transition group-hover:bg-emerald-50" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Total Scans
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {totalScans}
                  </p>

                  <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <TrendingUp size={12} />
                    AI analyses completed
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg">
                  <ScanLine size={19} />
                </div>

              </div>

            </div>

          </div>

          {/* FRESH */}

          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100 blur-2xl" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Fresh Food
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {freshScans}
                  </p>

                  <p className="mt-2 text-[10px] font-bold text-emerald-600">
                    Positive quality results
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>

              </div>

            </div>

          </div>

          {/* ATTENTION */}

          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-amber-100 blur-2xl" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Needs Attention
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {attentionScans}
                  </p>

                  <p className="mt-2 text-[10px] font-bold text-amber-600">
                    Requires visual inspection
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <AlertTriangle size={20} />
                </div>

              </div>

            </div>

          </div>

          {/* CONFIDENCE */}

          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-100 blur-2xl" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    AI Confidence
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {averageConfidence}%
                  </p>

                  <p className="mt-2 text-[10px] font-bold text-violet-600">
                    Average recognition score
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Sparkles size={20} />
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            SEARCH
        ====================================================== */}

        <section className="mt-7 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search food, quality or filename..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}

            </div>

            <div className="relative">

              <button
                onClick={() =>
                  setShowFilter(!showFilter)
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 lg:w-auto"
              >
                <Filter size={17} />

                {filter === "All"
                  ? "Filter"
                  : filter}

                {filter !== "All" && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 text-[10px] text-white">
                    1
                  </span>
                )}
              </button>

              {showFilter && (
                <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl">

                  <div className="px-3 pb-2 pt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Filter results
                  </div>

                  {[
                    "All",
                    "Fresh",
                    "Attention",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setFilter(item);
                        setShowFilter(false);
                      }}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                        filter === item
                          ? "bg-slate-950 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center justify-between">

                        <span>
                          {item === "Attention"
                            ? "Needs Attention"
                            : item === "All"
                            ? "All Scans"
                            : `${item} Scans`}
                        </span>

                        {filter === item && (
                          <CheckCircle2 size={14} />
                        )}

                      </span>
                    </button>
                  ))}

                </div>
              )}

            </div>

          </div>

          {(search || filter !== "All") && (
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

              <p className="text-[10px] font-medium text-slate-400">
                Showing{" "}
                <span className="font-bold text-slate-700">
                  {filteredScans.length}
                </span>{" "}
                matching records
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
              >
                Clear filters
              </button>

            </div>
          )}

        </section>

        {/* ======================================================
            HISTORY
        ====================================================== */}

        <section className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/70 px-5 py-5 sm:px-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <BarChart3 size={15} />
                  </div>

                  <h2 className="text-lg font-bold text-slate-950">
                    Recent Analyses
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {filteredScans.length}
                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-500">
                  AI-powered food recognition and quality records
                </p>

              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">

                <ShieldCheck
                  size={14}
                  className="text-emerald-600"
                />

                Secure records

              </div>

            </div>

          </div>

          {/* LIST */}

          {filteredScans.length > 0 ? (

            <div className="divide-y divide-slate-100">

              {filteredScans.map((scan) => {

                const status = getStatusStyle(
                  scan.quality
                );

                const confidence = Math.min(
                  Math.max(
                    Number(scan.confidence) || 0,
                    0
                  ),
                  100
                );

                const qualityConfidence = Math.min(
                  Math.max(
                    Number(scan.qualityConfidence) || 0,
                    0
                  ),
                  100
                );

                return (
                  <div
                    key={scan.id}
                    className="group p-5 transition hover:bg-slate-50/70 sm:p-6"
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                      {/* FOOD ICON */}

                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${status.iconBox}`}
                        >
                          <Leaf size={20} />
                        </div>

                        <div
                          className={`absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${status.dot}`}
                        />

                      </div>

                      {/* FOOD INFO */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-base font-bold capitalize text-slate-950">
                            {scan.food}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.badge}`}
                          >
                            {status.icon}
                            {scan.quality}
                          </span>

                        </div>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {scan.filename}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium text-slate-500">

                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={12} />
                            {scan.date}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock3 size={12} />
                            {scan.time}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Database size={12} />
                            Database record
                          </span>

                        </div>

                      </div>

                      {/* RECOGNITION */}

                      <div className="w-full xl:w-48">

                        <div className="mb-2 flex items-center justify-between">

                          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <Target size={12} />
                            Recognition
                          </span>

                          <span className="text-xs font-bold text-slate-800">
                            {confidence.toFixed(0)}%
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-slate-950 to-emerald-500 transition-all duration-700"
                            style={{
                              width: `${confidence}%`,
                            }}
                          />

                        </div>

                        <p className="mt-1.5 text-[9px] font-semibold text-slate-400">
                          {getConfidenceText(
                            confidence
                          )}
                        </p>

                      </div>

                      {/* QUALITY */}

                      <div className="w-full xl:w-40">

                        <div className="mb-2 flex items-center justify-between">

                          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <Activity size={12} />
                            Quality
                          </span>

                          <span className="text-xs font-bold text-slate-700">
                            {scan.qualityConfidence
                              ? `${qualityConfidence.toFixed(0)}%`
                              : "N/A"}
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              scan.quality === "Fresh"
                                ? "bg-emerald-500"
                                : scan.quality ===
                                  "Rotten"
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                            style={{
                              width: `${qualityConfidence}%`,
                            }}
                          />

                        </div>

                        <p className="mt-1.5 text-[9px] font-semibold text-slate-400">
                          Quality model score
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex items-center gap-2 xl:ml-2">

                        <button
                          onClick={() =>
                            alert(
                              `Food: ${scan.food}\nQuality: ${scan.quality}\nFood Confidence: ${confidence.toFixed(
                                2
                              )}%\nQuality Confidence: ${
                                scan.qualityConfidence
                                  ? `${Number(
                                      scan.qualityConfidence
                                    ).toFixed(2)}%`
                                  : "N/A"
                              }`
                            )
                          }
                          className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Eye size={16} />

                          <span className="hidden sm:inline">
                            View
                          </span>

                        </button>

                        <button
                          onClick={() =>
                            deleteScan(scan.id)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          title="Delete scan"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          ) : (

            /* ==================================================
               EMPTY STATE
            ================================================== */

            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-slate-100 text-slate-400">

                {search || filter !== "All" ? (
                  <Search size={28} />
                ) : (
                  <ScanLine size={28} />
                )}

              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">

                {search || filter !== "All"
                  ? "No matching scans"
                  : "No scans yet"}

              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">

                {search || filter !== "All"
                  ? "Try another search term or change your filter to find previous food analyses."
                  : "Start your first FoodAI analysis to see your scan history here."}

              </p>

              {search || filter !== "All" ? (

                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                  className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                >
                  Clear Filters
                </button>

              ) : (

                <button
                  onClick={() => navigate("/scan")}
                  className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                >
                  <ScanLine size={15} />
                  Start First Scan
                  <ChevronRight
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>

              )}

            </div>

          )}

        </section>

        {/* ======================================================
            SYSTEM STATUS
        ====================================================== */}

        <section className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Activity size={19} />
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h3 className="text-sm font-bold text-slate-900">
                    AI Analysis System
                  </h3>

                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    Online

                  </span>

                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Food recognition and quality analysis records
                  are being retrieved from the FoodAI backend.
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Zap size={19} />
              </div>

              <div>

                <h3 className="text-sm font-bold text-slate-900">
                  Intelligent Food Monitoring
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your previous AI analyses are organized here
                  so you can review recognition confidence and
                  quality predictions over time.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            DISCLAIMER
        ====================================================== */}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">

          <AlertTriangle
            size={17}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <p className="text-[10px] leading-5 text-amber-800">
            FoodAI provides visual AI-based estimates only.
            Results should not be treated as a guarantee of food
            safety or a replacement for professional inspection.
          </p>

        </div>

      </main>
    </div>
  );
}

export default History;