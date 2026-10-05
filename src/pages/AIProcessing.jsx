import { useEffect, useState } from "react";

import {
  Brain,
  ScanSearch,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  RefreshCw,
  AlertTriangle,
  Activity,
  Cpu,
  Eye,
  Microscope,
  ArrowRight,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function AIProcessing() {
  const navigate = useNavigate();
  const location = useLocation();

  const image = location.state?.image;
  const fileName = location.state?.fileName;
  const file = location.state?.file;

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (!image) {
      navigate("/scan");
      return;
    }

    let cancelled = false;
    let controller = new AbortController();

    const analyzeFood = async () => {
      try {
        setError("");
        setStep(1);
        setProgress(8);

        // --------------------------------------------------
        // STEP 1 — Prepare image
        // --------------------------------------------------

        let uploadFile = file;

        if (!uploadFile) {
          const response = await fetch(image);

          if (!response.ok) {
            throw new Error(
              "Unable to prepare the selected image."
            );
          }

          const blob = await response.blob();

          uploadFile = new File(
            [blob],
            fileName || "food-image.jpg",
            {
              type: blob.type || "image/jpeg",
            }
          );
        }

        if (cancelled) return;

        setProgress(25);

        await new Promise((resolve) =>
          setTimeout(resolve, 450)
        );

        if (cancelled) return;

        // --------------------------------------------------
        // STEP 2 — AI API
        // --------------------------------------------------

        setStep(2);
        setProgress(42);

        const formData = new FormData();

        formData.append("file", uploadFile);

        const apiResponse = await fetch(
          "http://127.0.0.1:8000/predict",
          {
            method: "POST",
            body: formData,
            signal: controller.signal,
          }
        );

        if (!apiResponse.ok) {
          const errorData = await apiResponse
            .json()
            .catch(() => ({}));

          throw new Error(
            errorData.detail ||
              "AI server could not analyze the image."
          );
        }

        if (cancelled) return;

        setProgress(68);

        const result = await apiResponse.json();

        if (!result || result.success === false) {
          throw new Error(
            result?.detail ||
              "AI analysis returned an invalid response."
          );
        }

        if (cancelled) return;

        // --------------------------------------------------
        // STEP 3 — Prepare result
        // --------------------------------------------------

        setStep(3);
        setProgress(88);

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );

        if (cancelled) return;

        setProgress(100);

        await new Promise((resolve) =>
          setTimeout(resolve, 350)
        );

        if (cancelled) return;

        // --------------------------------------------------
        // REAL AI RESULT
        // --------------------------------------------------

        navigate("/result", {
          replace: true,
          state: {
            image,
            fileName: fileName || uploadFile.name,
            result,
          },
        });

      } catch (err) {
        if (err?.name === "AbortError") {
          return;
        }

        console.error("AI analysis error:", err);

        if (!cancelled) {
          setError(
            err?.message ||
              "Unable to connect to AI server."
          );
        }
      }
    };

    analyzeFood();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [image, file, fileName, navigate]);

  // --------------------------------------------------
  // NO IMAGE
  // --------------------------------------------------

  if (!image) {
    return null;
  }

  const steps = [
    {
      number: "01",
      title: "Image recognition",
      description: "Detecting food category and visual features",
      icon: ScanSearch,
    },
    {
      number: "02",
      title: "Quality analysis",
      description: "Evaluating visible freshness indicators",
      icon: Microscope,
    },
    {
      number: "03",
      title: "AI report",
      description: "Preparing your food quality insights",
      icon: Brain,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6f5] text-slate-900">

      <div className="mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl items-center py-5 sm:py-8">

        <div className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">

          {/* =================================================
              TOP BAR
          ================================================= */}

          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-emerald-400">
                <Sparkles size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  FoodAI Intelligence Engine
                </p>

                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Real-time computer vision analysis
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                {error ? "System Alert" : "AI Engine Active"}
              </span>

            </div>

          </div>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

            {/* =================================================
                IMAGE / VISION PANEL
            ================================================= */}

            <div className="relative min-h-[520px] overflow-hidden bg-slate-950 p-5 sm:p-8 lg:min-h-[650px]">

              {/* Ambient background */}

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.13),transparent_48%)]" />

              <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

              {/* Header */}

              <div className="relative z-20 flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                    Vision Workspace
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Live image processing
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">

                  <Activity
                    size={13}
                    className="text-emerald-400"
                  />

                  <span className="text-[10px] font-semibold text-slate-300">
                    {error ? "Interrupted" : "Processing"}
                  </span>

                </div>

              </div>

              {/* Image */}

              <div className="relative z-10 flex h-[430px] items-center justify-center sm:h-[500px]">

                <div className="relative w-full max-w-xl">

                  {/* Scanner frame */}

                  <div className="absolute -inset-4 rounded-[28px] border border-emerald-400/10" />

                  <div className="absolute -inset-2 rounded-[24px] border border-white/5" />

                  {/* Corner brackets */}

                  <div className="pointer-events-none absolute -left-3 -top-3 h-8 w-8 border-l-2 border-t-2 border-emerald-400" />

                  <div className="pointer-events-none absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-emerald-400" />

                  <div className="pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-emerald-400" />

                  <div className="pointer-events-none absolute -bottom-3 -right-3 h-8 w-8 border-b-2 border-r-2 border-emerald-400" />

                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-2xl">

                    <img
                      src={image}
                      alt="Food being analyzed"
                      className="max-h-[500px] w-full object-contain"
                    />

                    {/* Scan overlay */}

                    {!error && (
                      <>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-emerald-500/5" />

                        <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_25px_rgba(52,211,153,0.95)] animate-[scan_2.5s_ease-in-out_infinite]" />

                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:100%_28px]" />
                      </>
                    )}

                  </div>

                  {/* Image label */}

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-xl">

                    <div className="flex items-center gap-2">

                      <span
                        className={`h-2 w-2 rounded-full ${
                          error
                            ? "bg-red-400"
                            : "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                        }`}
                      />

                      <span className="text-xs font-semibold text-white">
                        {error
                          ? "Analysis interrupted"
                          : "AI vision active"}
                      </span>

                    </div>

                    <span className="max-w-[180px] truncate text-[10px] text-slate-400">
                      {fileName || "food-image"}
                    </span>

                  </div>

                </div>

              </div>

              {/* Progress */}

              {!error && (
                <div className="relative z-20">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      AI processing
                    </span>

                    <span className="text-xs font-bold text-emerald-400">
                      {progress}%
                    </span>

                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                AI CONTROL PANEL
            ================================================= */}

            <div className="flex flex-col p-6 sm:p-8 lg:p-9">

              <div>

                {/* Badge */}

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

                  <Sparkles
                    size={13}
                    className="text-emerald-600"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    AI Food Intelligence
                  </span>

                </div>

                {/* Heading */}

                <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">

                  {error
                    ? "Analysis couldn't be completed"
                    : "AI is analyzing your food"}

                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">

                  {error
                    ? "Something went wrong while communicating with the AI processing service."
                    : "Our computer vision system is examining the image and preparing your food quality report."}

                </p>

                {/* AI MODEL */}

                <div className="mt-7 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      error
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-950 text-emerald-400"
                    }`}
                  >

                    {!error && (
                      <span className="absolute inset-0 rounded-xl bg-emerald-400/10 animate-ping" />
                    )}

                    {error ? (
                      <AlertTriangle size={21} />
                    ) : (
                      <Cpu size={22} />
                    )}

                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-bold text-slate-800">
                      {error
                        ? "AI service unavailable"
                        : "FoodAI Vision Model"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {error
                        ? "Check your AI server"
                        : "MobileNetV3 computer vision pipeline"}
                    </p>

                  </div>

                  {!error && (
                    <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Eye size={15} />
                    </div>
                  )}

                </div>

                {/* STEPS */}

                <div className="mt-7 space-y-3">

                  {steps.map((item, index) => {

                    const Icon = item.icon;
                    const itemStep = index + 1;

                    const completed =
                      step > itemStep && !error;

                    const active =
                      step === itemStep && !error;

                    return (
                      <div
                        key={item.number}
                        className={`relative flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-300 ${
                          completed
                            ? "border-emerald-100 bg-emerald-50/70"
                            : active
                            ? "border-emerald-200 bg-white shadow-sm shadow-emerald-900/5"
                            : "border-slate-100 bg-slate-50"
                        }`}
                      >

                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            completed || active
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >

                          {completed ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <Icon size={18} />
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center gap-2">

                            <p
                              className={`text-sm font-bold ${
                                completed || active
                                  ? "text-slate-800"
                                  : "text-slate-500"
                              }`}
                            >
                              {item.title}
                            </p>

                            {active && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-700">
                                Live
                              </span>
                            )}

                          </div>

                          <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                            {item.description}
                          </p>

                        </div>

                        <div className="shrink-0">

                          {active && (
                            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                          )}

                          {completed && (
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500"
                            />
                          )}

                          {!active && !completed && (
                            <span className="text-[9px] font-bold text-slate-300">
                              {item.number}
                            </span>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>

                {/* ERROR */}

                {error && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <AlertTriangle size={18} />
                      </div>

                      <div>

                        <p className="text-sm font-bold text-red-700">
                          AI Analysis Failed
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-600">
                          {error}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() => navigate("/scan")}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                      <RefreshCw size={16} />
                      Try Another Image
                      <ArrowRight size={14} />
                    </button>

                  </div>
                )}

              </div>

              {/* FOOTER */}

              {!error && (
                <div className="mt-8">

                  <div className="flex items-center gap-2 text-xs text-slate-400">

                    <Zap
                      size={14}
                      className="text-amber-500"
                    />

                    <span>
                      AI models are processing your image...
                    </span>

                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">

                    <ShieldCheck
                      size={14}
                      className="text-emerald-500"
                    />

                    <span className="text-[10px] leading-4 text-slate-400">
                      Your image is processed securely. Results are
                      intended for informational purposes.
                    </span>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Scan animation */}

      <style>
        {`
          @keyframes scan {
            0% {
              top: 0%;
              opacity: 0;
            }

            10% {
              opacity: 1;
            }

            50% {
              opacity: 1;
            }

            90% {
              opacity: 1;
            }

            100% {
              top: 100%;
              opacity: 0;
            }
          }
        `}
      </style>

    </div>
  );
}

export default AIProcessing;