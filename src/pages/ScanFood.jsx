import { useEffect, useRef, useState } from "react";

import {
  Camera,
  ImagePlus,
  Upload,
  X,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  FileImage,
  ScanLine,
  CheckCircle2,
  ArrowRight,
  Lock,
  Info,
  Zap,
  BrainCircuit,
  CircleCheck,
  WandSparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function ScanFood() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (file) => {
    setError("");

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid food image.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload JPG, JPEG, PNG or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreview(imageUrl);
    setError("");
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    handleFile(file);

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  const analyzeFood = () => {
    if (!selectedFile || !preview) {
      setError("Please upload a food image first.");
      return;
    }

    setError("");

    navigate("/ai-processing", {
      state: {
        image: preview,
        file: selectedFile,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
      },
    });
  };

  const fileSizeMB = selectedFile
    ? (selectedFile.size / 1024 / 1024).toFixed(2)
    : "0.00";

  const fileExtension =
    selectedFile?.name?.split(".").pop()?.toUpperCase() || "IMAGE";

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-900">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* =====================================================
            HERO HEADER
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[30px] bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">

          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  FoodAI Vision Engine
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Turn a food photo into
                <span className="block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  intelligent insights.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-[15px]">
                Upload a food image and let FoodAI identify the food,
                evaluate visible quality characteristics and generate
                confidence-based AI insights.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <BrainCircuit size={15} className="text-emerald-300" />
                  <span className="text-xs font-medium text-slate-300">
                    Computer Vision
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Zap size={15} className="text-cyan-300" />
                  <span className="text-xs font-medium text-slate-300">
                    Fast Analysis
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <ShieldCheck size={15} className="text-emerald-300" />
                  <span className="text-xs font-medium text-slate-300">
                    Secure Processing
                  </span>
                </div>

              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur">

                <div className="absolute inset-5 rounded-2xl border border-emerald-400/20" />

                <ScanLine
                  size={58}
                  strokeWidth={1.3}
                  className="text-emerald-300"
                />

                <div className="absolute bottom-3 rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                  Ready
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =====================================================
            MAIN SCANNER
        ===================================================== */}

        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

          {!preview ? (
            <>
              {/* UPLOAD STATE */}

              <div className="p-5 sm:p-8">

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    group relative cursor-pointer overflow-hidden
                    rounded-[28px] border-2 border-dashed
                    border-slate-200 bg-gradient-to-br
                    from-slate-50 via-white to-emerald-50/40
                    px-5 py-16 text-center
                    transition-all duration-300
                    hover:border-emerald-400
                    hover:shadow-[0_20px_60px_rgba(16,185,129,0.10)]
                    sm:px-10
                  "
                >

                  <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl" />

                  <div className="pointer-events-none absolute -bottom-24 -right-10 h-52 w-52 rounded-full bg-cyan-100/40 blur-3xl" />

                  <div className="relative">

                    {/* ICON */}

                    <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-slate-100 bg-white text-emerald-600 shadow-xl shadow-emerald-900/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105">

                      <div className="absolute inset-2 rounded-[22px] border border-emerald-100" />

                      <ScanLine
                        size={40}
                        strokeWidth={1.5}
                      />

                    </div>

                    <h2 className="mt-7 text-2xl font-bold tracking-tight text-slate-900">
                      Upload your food image
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                      Drag and drop your image here, or choose one from
                      your device. FoodAI will automatically process the
                      image using its computer vision pipeline.
                    </p>

                    {/* PRIMARY BUTTON */}

                    <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all group-hover:bg-emerald-600">
                      <Upload size={17} />
                      Choose Image
                      <ArrowRight size={15} />
                    </div>

                    {/* FORMATS */}

                    <div className="mt-6 flex flex-wrap justify-center gap-2">

                      {["JPG", "JPEG", "PNG", "WEBP"].map((format) => (
                        <span
                          key={format}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-slate-400"
                        >
                          {format}
                        </span>
                      ))}

                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-slate-400">
                        MAX 10 MB
                      </span>

                    </div>

                  </div>
                </div>

                {/* HIDDEN INPUTS */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleInputChange}
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleInputChange}
                />

                {/* ACTIONS */}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="
                      group flex items-center justify-center gap-2.5
                      rounded-xl border border-slate-200 bg-white
                      px-4 py-3.5 text-sm font-semibold text-slate-700
                      transition hover:border-emerald-300
                      hover:bg-emerald-50/50 hover:text-emerald-700
                    "
                  >
                    <ImagePlus
                      size={18}
                      className="text-slate-400 transition group-hover:text-emerald-600"
                    />
                    Browse Gallery
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="
                      group flex items-center justify-center gap-2.5
                      rounded-xl border border-slate-200 bg-white
                      px-4 py-3.5 text-sm font-semibold text-slate-700
                      transition hover:border-emerald-300
                      hover:bg-emerald-50/50 hover:text-emerald-700
                    "
                  >
                    <Camera
                      size={18}
                      className="text-slate-400 transition group-hover:text-emerald-600"
                    />
                    Take Photo
                  </button>

                </div>
              </div>
            </>
          ) : (
            <>
              {/* =================================================
                  IMAGE SELECTED
              ================================================= */}

              <div className="grid gap-0 lg:grid-cols-[1fr_390px]">

                {/* IMAGE */}

                <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden bg-slate-950 p-5 sm:min-h-[570px]">

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.10),transparent_55%)]" />

                  <div className="pointer-events-none absolute left-10 top-10 h-32 w-32 rounded-full border border-emerald-400/10" />

                  <div className="pointer-events-none absolute bottom-10 right-10 h-44 w-44 rounded-full border border-cyan-400/10" />

                  <img
                    src={preview}
                    alt="Selected food"
                    className="
                      relative max-h-[540px] w-full
                      rounded-2xl object-contain
                      shadow-2xl
                    "
                  />

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={removeImage}
                    className="
                      absolute right-5 top-5 flex h-10 w-10
                      items-center justify-center rounded-full
                      border border-white/10 bg-black/50
                      text-white backdrop-blur-md
                      transition hover:bg-red-500
                    "
                    aria-label="Remove image"
                  >
                    <X size={18} />
                  </button>

                  {/* READY */}

                  <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">

                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                    Image ready for AI analysis

                  </div>

                </div>

                {/* INFORMATION */}

                <div className="flex flex-col justify-between border-t border-slate-200 bg-white p-6 lg:border-l lg:border-t-0 lg:p-7">

                  <div>

                    {/* TITLE */}

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2 text-emerald-600">

                        <FileImage size={18} />

                        <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                          Selected Image
                        </span>

                      </div>

                      <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                        <CircleCheck size={15} />
                      </div>

                    </div>

                    <h2 className="mt-5 break-all text-sm font-bold leading-5 text-slate-800">
                      {selectedFile?.name}
                    </h2>

                    {/* FILE INFO */}

                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">

                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                        <span className="text-xs text-slate-400">
                          File type
                        </span>

                        <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-700">
                          {fileExtension}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                        <span className="text-xs text-slate-400">
                          File size
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                          {fileSizeMB} MB
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-3.5">
                        <span className="text-xs text-slate-400">
                          AI readiness
                        </span>

                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Ready
                        </span>
                      </div>

                    </div>

                    {/* AI FEATURES */}

                    <div className="mt-7">

                      <div className="flex items-center gap-2">

                        <WandSparkles
                          size={15}
                          className="text-emerald-500"
                        />

                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          AI analysis pipeline
                        </p>

                      </div>

                      <div className="mt-4 space-y-3">

                        {[
                          {
                            title: "Food recognition",
                            text: "Identify the visible food",
                          },
                          {
                            title: "Quality assessment",
                            text: "Analyze visible characteristics",
                          },
                          {
                            title: "Confidence scoring",
                            text: "Generate AI confidence",
                          },
                        ].map((item) => (
                          <div
                            key={item.title}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                              <CheckCircle2 size={14} />
                            </div>

                            <div>
                              <p className="text-xs font-bold text-slate-700">
                                {item.title}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {item.text}
                              </p>
                            </div>
                          </div>
                        ))}

                      </div>
                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-8 space-y-3">

                    <button
                      type="button"
                      onClick={analyzeFood}
                      className="
                        group flex w-full items-center justify-center
                        gap-2 rounded-xl bg-emerald-500
                        px-5 py-4 text-sm font-bold text-white
                        shadow-lg shadow-emerald-500/20
                        transition-all hover:-translate-y-0.5
                        hover:bg-emerald-600 hover:shadow-xl
                      "
                    >
                      <Sparkles size={18} />

                      Analyze with FoodAI

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="
                        flex w-full items-center justify-center
                        gap-2 rounded-xl border border-slate-200
                        px-5 py-3.5 text-sm font-semibold
                        text-slate-600 transition
                        hover:bg-slate-50
                      "
                    >
                      <RefreshCw size={16} />
                      Choose Another
                    </button>

                  </div>

                </div>
              </div>
            </>
          )}

          {/* ERROR */}

          {error && (
            <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:mx-8">

              <Info
                size={17}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>

            </div>
          )}

        </section>

        {/* =====================================================
            HOW FOODAI WORKS
        ===================================================== */}

        <section>

          <div className="mb-5 flex items-end justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                AI workflow
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                How FoodAI works
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Three simple steps from image to insight
              </p>
            </div>

            <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-400 sm:block">
              Powered by Computer Vision
            </div>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {[
              {
                number: "01",
                icon: ImagePlus,
                title: "Upload image",
                text: "Choose a clear food photo from your gallery or camera.",
              },
              {
                number: "02",
                icon: Sparkles,
                title: "AI analyzes",
                text: "FoodAI processes the image using its recognition pipeline.",
              },
              {
                number: "03",
                icon: ShieldCheck,
                title: "Get insights",
                text: "Receive recognition, quality and confidence results.",
              },
            ].map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="
                    group relative overflow-hidden rounded-2xl
                    border border-slate-200 bg-white p-5
                    shadow-sm transition
                    hover:-translate-y-1 hover:border-emerald-200
                    hover:shadow-lg hover:shadow-emerald-900/5
                  "
                >

                  <div className="absolute right-4 top-3 text-4xl font-black text-slate-100 transition group-hover:text-emerald-50">
                    {item.number}
                  </div>

                  <div className="relative">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 text-sm font-bold text-slate-800">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {item.text}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>
        </section>

        {/* =====================================================
            SECURITY / DISCLAIMER
        ===================================================== */}

        <section className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Lock size={16} />
          </div>

          <div>

            <p className="text-xs font-bold text-slate-700">
              AI-powered visual assessment
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              FoodAI evaluates visible characteristics from an uploaded
              image. Results are intended for informational purposes and
              are not a laboratory test or definitive food-safety
              certification.
            </p>

          </div>

        </section>

      </div>
    </div>
  );
}

export default ScanFood;