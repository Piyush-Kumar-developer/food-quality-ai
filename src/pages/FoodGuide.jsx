import {
  Search,
  Apple,
  Milk,
  Wheat,
  Beef,
  Package,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ShieldCheck,
  ChevronRight,
  Info,
  Leaf,
  ArrowLeft,
  ScanLine,
  Clock3,
  CircleCheck,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function FoodGuide() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    {
      name: "All",
      icon: <Sparkles size={17} />,
    },
    {
      name: "Fruits",
      icon: <Apple size={17} />,
    },
    {
      name: "Dairy",
      icon: <Milk size={17} />,
    },
    {
      name: "Bakery",
      icon: <Wheat size={17} />,
    },
    {
      name: "Protein",
      icon: <Beef size={17} />,
    },
    {
      name: "Packaged",
      icon: <Package size={17} />,
    },
  ];

  const foods = [
    {
      id: 1,
      name: "Apple",
      category: "Fruits",
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85",
      freshness: "High",
      freshnessText:
        "Firm, bright skin and no major bruising are generally positive visual indicators.",
      signs: [
        "Firm texture",
        "Natural color",
        "No soft dark spots",
      ],
      avoid:
        "Deep bruises, leaking juice, mold or strong fermented smell.",
    },

    {
      id: 2,
      name: "Banana",
      category: "Fruits",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85",
      freshness: "High",
      freshnessText:
        "Yellow skin with a firm, healthy texture is generally a positive visual indicator.",
      signs: [
        "Firm body",
        "Normal yellow color",
        "No visible mold",
      ],
      avoid:
        "Excessive softness, leaking liquid or visible mold.",
    },

    {
      id: 3,
      name: "Orange",
      category: "Fruits",
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=85",
      freshness: "High",
      freshnessText:
        "A firm orange that feels heavy for its size is generally a positive indicator.",
      signs: [
        "Firm skin",
        "Good weight",
        "Fresh citrus smell",
      ],
      avoid:
        "Very soft areas, mold, leaking juice or unusual odor.",
    },

    {
      id: 4,
      name: "Milk",
      category: "Dairy",
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=85",
      freshness: "Check",
      freshnessText:
        "For milk, expiry date, refrigeration and package condition are especially important.",
      signs: [
        "Valid expiry date",
        "Proper refrigeration",
        "Normal appearance",
      ],
      avoid:
        "Sour smell, curdling, swollen package or expired product.",
    },

    {
      id: 5,
      name: "Bread",
      category: "Bakery",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
      freshness: "Check",
      freshnessText:
        "Fresh bread should have a normal texture and smell with no visible mold.",
      signs: [
        "Normal texture",
        "Fresh smell",
        "No visible mold",
      ],
      avoid:
        "Green/black spots, unusual smell or excessive moisture.",
    },

    {
      id: 6,
      name: "Chicken",
      category: "Protein",
      image:
        "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85",
      freshness: "Check",
      freshnessText:
        "Visual inspection alone cannot confirm meat safety. Storage and handling are important.",
      signs: [
        "Proper storage",
        "Valid date",
        "Normal packaging",
      ],
      avoid:
        "Strong unpleasant odor, damaged packaging or improper storage.",
    },

    {
      id: 7,
      name: "Yogurt",
      category: "Dairy",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
      freshness: "Check",
      freshnessText:
        "Check the date, refrigeration conditions and package integrity before consumption.",
      signs: [
        "Sealed container",
        "Valid date",
        "Proper refrigeration",
      ],
      avoid:
        "Bulging package, unusual smell or visible mold.",
    },

    {
      id: 8,
      name: "Packaged Food",
      category: "Packaged",
      image:
        "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=900&q=85",
      freshness: "Check",
      freshnessText:
        "Packaging condition, expiry information and product storage should all be checked.",
      signs: [
        "Sealed package",
        "Valid expiry date",
        "No visible damage",
      ],
      avoid:
        "Swollen packet, broken seal, leakage or expired product.",
    },
  ];

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesCategory =
        activeCategory === "All" ||
        food.category === activeCategory;

      const matchesSearch =
        !query ||
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const highIndicatorCount = foods.filter(
    (food) => food.freshness === "High"
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <button
                onClick={() => navigate(-1)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <ArrowLeft size={19} />
              </button>

              <div>

                <div className="mb-1 flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Leaf size={15} />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    FoodAI Knowledge Center
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Food Quality Guide
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Visual indicators and practical food-quality guidance.
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/scan")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <ScanLine size={17} />
              Scan Food
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8 lg:p-10">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.04] blur-2xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur">
                <Sparkles size={14} />
                AI-powered visual intelligence
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Understand food quality
                <span className="text-slate-400">
                  {" "}before you consume it.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Explore common freshness indicators, visible
                spoilage signs and practical checks. Use this
                knowledge together with proper food handling and
                storage practices.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  onClick={() => navigate("/scan")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  <ScanLine size={16} />
                  Analyze with AI
                </button>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-300">
                  <ShieldCheck
                    size={15}
                    className="text-emerald-400"
                  />
                  Visual guidance
                </div>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                <Eye
                  size={19}
                  className="text-slate-300"
                />

                <p className="mt-4 text-2xl font-bold">
                  Visual
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Appearance-based indicators
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                <ShieldCheck
                  size={19}
                  className="text-emerald-400"
                />

                <p className="mt-4 text-2xl font-bold">
                  {foods.length}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Food references
                </p>

              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <CircleCheck
                      size={16}
                      className="text-emerald-400"
                    />

                    <span className="text-xs font-semibold text-slate-300">
                      Positive visual indicators
                    </span>
                  </div>

                  <span className="text-sm font-bold text-white">
                    {highIndicatorCount}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food or category..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />

          </div>

        </section>

        {/* ===================================================
            CATEGORY FILTER
        =================================================== */}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">

          {categories.map((category) => {

            const active =
              activeCategory === category.name;

            return (
              <button
                key={category.name}
                onClick={() =>
                  setActiveCategory(category.name)
                }
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            );
          })}

        </div>

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Food Intelligence
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {filteredFoods.length}
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Practical visual checks for common food categories.
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

            <Clock3 size={14} />

            Updated knowledge reference

          </div>

        </div>

        {/* ===================================================
            FOOD CARDS
        =================================================== */}

        {filteredFoods.length > 0 ? (

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredFoods.map((food) => {

              const high =
                food.freshness === "High";

              return (
                <article
                  key={food.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}

                  <div className="relative h-56 overflow-hidden bg-slate-100">

                    <img
                      src={food.image}
                      alt={food.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                      {food.category}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">

                      <span className="text-lg font-bold text-white drop-shadow">
                        {food.name}
                      </span>

                      <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                        VISUAL GUIDE
                      </span>

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="text-lg font-bold text-slate-950">
                          {food.name}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                          Visual freshness indicators
                        </p>

                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          high
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {high
                          ? "GOOD INDICATORS"
                          : "CHECK CAREFULLY"}
                      </span>

                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {food.freshnessText}
                    </p>

                    {/* LOOK FOR */}

                    <div className="mt-5">

                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Positive indicators
                      </p>

                      <div className="space-y-2.5">

                        {food.signs.map((sign) => (
                          <div
                            key={sign}
                            className="flex items-center gap-2.5 text-sm text-slate-600"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                              <CheckCircle2
                                size={13}
                                className="text-emerald-600"
                              />
                            </span>

                            {sign}
                          </div>
                        ))}

                      </div>

                    </div>

                    {/* WARNING */}

                    <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/60 p-3.5">

                      <div className="flex items-start gap-2.5">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                          <AlertTriangle
                            size={15}
                            className="text-amber-600"
                          />
                        </div>

                        <div>

                          <p className="text-xs font-bold text-amber-800">
                            Warning signs
                          </p>

                          <p className="mt-1 text-xs leading-5 text-amber-700">
                            {food.avoid}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ACTION */}

                    <button
                      onClick={() => navigate("/scan")}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-950 hover:text-white"
                    >
                      <Sparkles size={15} />
                      Analyze {food.name}
                      <ChevronRight size={16} />
                    </button>

                  </div>

                </article>
              );
            })}

          </div>

        ) : (

          /* EMPTY STATE */

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={26} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No food found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try searching for another food or select a
              different category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear Search
            </button>

          </div>
        )}

        {/* ===================================================
            IMPORTANT INFORMATION
        =================================================== */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Info size={18} />
            </div>

            <div>

              <h3 className="text-sm font-bold text-slate-900">
                Important information
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Visual appearance cannot detect every form of
                contamination, bacteria or internal spoilage.
                FoodAI is designed as a visual assistance tool
                and should not replace expiry checks, proper
                storage, hygiene practices or professional
                food-safety inspection.
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            CTA
        =================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Sparkles size={15} />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Ready to analyze?
                </span>

              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-950 sm:text-2xl">
                Let FoodAI inspect your food.
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload a clear photo and get an AI-powered
                visual assessment.
              </p>

            </div>

            <button
              onClick={() => navigate("/scan")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <ScanLine size={17} />
              Start AI Scan
              <ChevronRight size={16} />
            </button>

          </div>

        </section>

        {/* ===================================================
            DISCLAIMER
        =================================================== */}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">

          <AlertTriangle
            size={17}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <p className="text-xs leading-5 text-amber-800">
            FoodAI provides visual AI-based estimates only.
            Results should not be treated as a guarantee of
            food safety or a replacement for professional
            inspection.
          </p>

        </div>

      </main>
    </div>
  );
}

export default FoodGuide;