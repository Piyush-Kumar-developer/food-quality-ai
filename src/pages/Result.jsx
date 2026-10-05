import {
  CheckCircle2,
  AlertTriangle,
  Brain,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Activity,
  Target,
  Eye,
  ScanLine,
  Leaf,
  Gauge,
  Clock3,
  ChevronRight,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const image = location.state?.image;
  const fileName = location.state?.fileName;
  const result = location.state?.result;

  // ============================================================
  // NO RESULT
  // ============================================================

  if (!image || !result) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] px-6 py-10 text-slate-900">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-xl">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              No analysis found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please scan a food image first to view the AI analysis result.
            </p>

            <button
              onClick={() => navigate("/scan")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              <ScanLine size={17} />
              Go to Scanner
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // BACKEND DATA
  // ============================================================

  const food = result.food || "Unknown";

  const foodConfidence =
    result.food_confidence !== undefined &&
    result.food_confidence !== null
      ? Number(result.food_confidence)
      : null;

  const quality = result.quality || "Unknown";

  const qualityConfidence =
    result.quality_confidence !== undefined &&
    result.quality_confidence !== null
      ? Number(result.quality_confidence)
      : null;

  const qualityStatus =
    result.quality_status || "Unable to Analyze";

  const qualityReason =
    result.quality_reason ||
    "No additional AI observation is available.";

  const foodStatus =
    result.food_status ||
    (food !== "Unknown" ? "Recognized" : "Unknown");

  const scanId = result.scan_id;

  // ============================================================
  // STATUS
  // ============================================================

  const normalizedFood = String(food).toLowerCase();
  const normalizedQuality = String(quality).toLowerCase();

  const isRecognized =
    normalizedFood !== "unknown" &&
    normalizedFood !== "unavailable";

  const isQualityAvailable =
    normalizedQuality !== "unknown" &&
    normalizedQuality !== "unavailable" &&
    qualityConfidence !== null;

  const isFresh = normalizedQuality === "fresh";
  const isRotten = normalizedQuality === "rotten";

  const safeFoodConfidence =
    foodConfidence !== null
      ? Math.max(0, Math.min(100, foodConfidence))
      : 0;

  const safeQualityConfidence =
    qualityConfidence !== null
      ? Math.max(0, Math.min(100, qualityConfidence))
      : 0;

  // ============================================================
  // QUALITY THEME
  // ============================================================

  let qualityTheme;

  if (isFresh) {
    qualityTheme = {
      card: "border-emerald-200 bg-emerald-50/70",
      icon: "bg-emerald-100 text-emerald-600",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-500",
      glow: "shadow-emerald-500/10",
      label: "Fresh",
      iconComponent: CheckCircle2,
    };
  } else if (isRotten) {
    qualityTheme = {
      card: "border-red-200 bg-red-50/70",
      icon: "bg-red-100 text-red-600",
      text: "text-red-700",
      badge: "bg-red-100 text-red-700 border-red-200",
      bar: "bg-red-500",
      glow: "shadow-red-500/10",
      label: "Needs Attention",
      iconComponent: AlertTriangle,
    };
  } else {
    qualityTheme = {
      card: "border-amber-200 bg-amber-50/70",
      icon: "bg-amber-100 text-amber-600",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      bar: "bg-amber-500",
      glow: "shadow-amber-500/10",
      label: "Review",
      iconComponent: AlertTriangle,
    };
  }

  const QualityIcon = qualityTheme.iconComponent;

  // ============================================================
  // SUMMARY
  // ============================================================

  let summary = "";

  if (!isRecognized) {
    summary =
      "The AI could not confidently recognize this food item. Please try another clear image.";
  } else if (!isQualityAvailable) {
    summary = `${food} was recognized successfully, but the current quality model cannot provide a reliable freshness assessment for this item.`;
  } else if (isFresh) {
    summary = `${food} was recognized successfully and the AI quality model classified it as fresh.`;
  } else if (isRotten) {
    summary = `${food} was recognized successfully, but the AI quality model detected characteristics associated with poor quality or spoilage.`;
  } else {
    summary = `${food} was recognized, but the quality prediction should be reviewed before making a final decision.`;
  }

  const formattedFood =
    String(food).charAt(0).toUpperCase() +
    String(food).slice(1);

  // ============================================================
  // OVERALL SCORE
  // ============================================================

  const overallScore = isQualityAvailable
    ? Math.round(
        (safeFoodConfidence + safeQualityConfidence) / 2
      )
    : Math.round(safeFoodConfidence);

  return (
    <div className="min-h-screen bg-[#f3f6f5] text-slate-900">

      {/* ========================================================
          TOP NAV
      ======================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-7 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/scan")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
              aria-label="Back to scanner"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div>

              <div className="flex items-center gap-2">

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                  FoodAI
                </span>

                <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-600 sm:inline">
                  AI Engine
                </span>

              </div>

              <h1 className="text-sm font-bold text-slate-900 sm:text-base">
                Analysis Complete
              </h1>

            </div>

          </div>

          <button
            onClick={() => navigate("/scan")}
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600 sm:px-5 sm:text-sm"
          >
            <RotateCcw size={15} />
            <span>New Scan</span>
          </button>

        </div>
      </header>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-7 sm:py-9 lg:px-8">

        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[30px] bg-slate-950 p-6 text-white shadow-xl sm:p-8 lg:p-9">

          <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">

                <CheckCircle2
                  size={13}
                  className="text-emerald-400"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                  Analysis Successfully Completed
                </span>

              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Your food intelligence
                <span className="block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  report is ready.
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                FoodAI analyzed your image using computer vision models
                to identify the food and evaluate visible quality
                characteristics.
              </p>

            </div>

            {/* Overall score */}

            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <Gauge size={27} />
              </div>

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Overall AI Score
                </p>

                <div className="mt-0.5 flex items-end gap-1">

                  <span className="text-3xl font-bold text-white">
                    {overallScore}
                  </span>

                  <span className="mb-1 text-xs text-slate-500">
                    / 100
                  </span>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="mt-7 grid gap-7 lg:grid-cols-12">

          {/* ====================================================
              IMAGE
          ==================================================== */}

          <section className="lg:col-span-5">

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Scanned Image
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                    {fileName || "Food image"}
                  </p>

                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Eye size={17} />
                </div>

              </div>

              <div className="p-4">

                <div className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-950">

                  <img
                    src={image}
                    alt="Scanned food"
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(15,23,42,0.25))]" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-[10px] font-bold text-white backdrop-blur-md">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />

                    AI Scanned

                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-[9px] font-semibold text-slate-300 backdrop-blur-md">

                    <ScanLine size={12} className="text-emerald-400" />

                    Computer Vision

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ====================================================
              ANALYSIS CARDS
          ==================================================== */}

          <section className="space-y-6 lg:col-span-7">

            {/* FOOD RECOGNITION */}

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Brain size={24} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Food Recognition
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-slate-950">
                      {formattedFood}
                    </h3>

                  </div>

                </div>

                <div
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                    isRecognized
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {foodStatus}
                </div>

              </div>

              <div className="mt-7">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs font-medium text-slate-500">
                    Recognition confidence
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    {foodConfidence !== null
                      ? `${safeFoodConfidence.toFixed(2)}%`
                      : "N/A"}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
                    style={{
                      width: `${safeFoodConfidence}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">

                <Target
                  size={14}
                  className="text-blue-500"
                />

                <span>
                  AI model: MobileNetV3 Food Recognition
                </span>

              </div>

            </div>

            {/* QUALITY */}

            <div
              className={`rounded-[28px] border p-6 shadow-sm ${qualityTheme.card} ${qualityTheme.glow}`}
            >

              <div className="flex items-start justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${qualityTheme.icon}`}
                  >
                    <QualityIcon size={24} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Visual Quality
                    </p>

                    <h3
                      className={`mt-1 text-2xl font-bold ${qualityTheme.text}`}
                    >
                      {isQualityAvailable
                        ? qualityTheme.label
                        : "Unable to Analyze"}
                    </h3>

                  </div>

                </div>

                <div
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${qualityTheme.badge}`}
                >
                  {qualityStatus}
                </div>

              </div>

              {isQualityAvailable ? (
                <div className="mt-7">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-600">
                      Model confidence
                    </span>

                    <span
                      className={`text-sm font-bold ${qualityTheme.text}`}
                    >
                      {safeQualityConfidence.toFixed(2)}%
                    </span>

                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white/80">

                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${qualityTheme.bar}`}
                      style={{
                        width: `${safeQualityConfidence}%`,
                      }}
                    />

                  </div>

                  <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-600">

                    <ShieldCheck
                      size={15}
                      className={`mt-0.5 shrink-0 ${qualityTheme.text}`}
                    />

                    <span>{qualityReason}</span>

                  </div>

                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">

                  <div className="flex gap-3">

                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>

                      <p className="text-xs font-bold text-amber-800">
                        Quality analysis unavailable
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        {qualityReason}
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </section>

        </div>

        {/* ======================================================
            AI INSIGHTS
        ====================================================== */}

        <section className="mt-7 grid gap-7 lg:grid-cols-2">

          {/* OBSERVATION */}

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Activity size={20} />
              </div>

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  AI Observation
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Model Assessment
                </h3>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">

              <p className="text-sm leading-7 text-slate-600">
                {qualityReason}
              </p>

            </div>

            <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-slate-400">

              <Eye size={13} />

              Based on visible image characteristics

            </div>

          </div>

          {/* SUMMARY */}

          <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-xl">

            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
                  <Brain size={20} />
                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    AI Summary
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    Final Assessment
                  </h3>

                </div>

              </div>

              <p className="mt-6 text-sm leading-7 text-slate-300">
                {summary}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">

                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Food
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {formattedFood}
                  </p>

                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">

                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Quality
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      isFresh
                        ? "text-emerald-300"
                        : isRotten
                        ? "text-red-300"
                        : "text-amber-300"
                    }`}
                  >
                    {isQualityAvailable
                      ? qualityTheme.label
                      : "N/A"}
                  </p>

                </div>

              </div>

              {scanId && (
                <div className="mt-5 border-t border-white/10 pt-5">

                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Scan ID
                  </p>

                  <p className="mt-1 break-all font-mono text-[10px] text-slate-400">
                    {scanId}
                  </p>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* ======================================================
            QUICK METRICS
        ====================================================== */}

        <section className="mt-7 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Leaf size={19} />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                Quality
              </span>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Quality status
            </p>

            <p
              className={`mt-1 text-lg font-bold ${
                isFresh
                  ? "text-emerald-600"
                  : isRotten
                  ? "text-red-600"
                  : "text-amber-600"
              }`}
            >
              {isQualityAvailable
                ? qualityTheme.label
                : "Unavailable"}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Target size={19} />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                Recognition
              </span>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Food confidence
            </p>

            <p className="mt-1 text-lg font-bold text-slate-800">
              {foodConfidence !== null
                ? `${safeFoodConfidence.toFixed(1)}%`
                : "N/A"}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Clock3 size={19} />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                Processing
              </span>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Analysis status
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Complete
            </p>

          </div>

        </section>

        {/* ======================================================
            ACTIONS
        ====================================================== */}

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-bold text-slate-900">
                What would you like to do next?
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Start another analysis or review your previous scans.
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() => navigate("/scan")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                <RotateCcw size={16} />
                Scan Another Food
                <ChevronRight
                  size={15}
                  className="transition group-hover:translate-x-0.5"
                />
              </button>

              <button
                onClick={() => navigate("/history")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Activity size={16} />
                View Scan History
              </button>

            </div>

          </div>

        </section>

        {/* ======================================================
            DISCLAIMER
        ====================================================== */}

        <section className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <AlertTriangle size={16} />
          </div>

          <div>

            <p className="text-xs font-bold text-slate-700">
              AI assessment disclaimer
            </p>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              FoodAI provides an AI-based visual assessment and should
              be treated as an assistive tool. Results may vary depending
              on image quality, lighting, food condition and model
              limitations. Always use human judgment for final food
              safety decisions.
            </p>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Result;