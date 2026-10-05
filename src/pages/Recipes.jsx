import {
  Search,
  ChefHat,
  Clock3,
  Flame,
  Leaf,
  Utensils,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  X,
  Heart,
  ArrowLeft,
  ScanLine,
  ShieldCheck,
  Star,
  CircleCheck,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Recipes() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const categories = [
    {
      name: "All",
      icon: <Sparkles size={16} />,
    },
    {
      name: "Healthy",
      icon: <Leaf size={16} />,
    },
    {
      name: "Vegetarian",
      icon: <Leaf size={16} />,
    },
    {
      name: "Protein",
      icon: <Flame size={16} />,
    },
    {
      name: "Quick",
      icon: <Clock3 size={16} />,
    },
  ];

  const recipes = [
    {
      id: 1,
      name: "Fresh Vegetable Bowl",
      category: ["Healthy", "Vegetarian", "Quick"],
      time: "15 min",
      calories: "320 kcal",
      difficulty: "Easy",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
      description:
        "A colorful bowl packed with fresh vegetables, healthy fats and a light dressing.",
      ingredients: [
        "1 cup lettuce",
        "1/2 cucumber",
        "1 tomato",
        "1/2 carrot",
        "1/2 avocado",
        "1 tbsp olive oil",
        "Salt and pepper",
      ],
      steps: [
        "Wash all vegetables thoroughly.",
        "Chop the vegetables into bite-sized pieces.",
        "Add lettuce, cucumber, tomato and carrot to a bowl.",
        "Add avocado and drizzle with olive oil.",
        "Season with salt and pepper and serve fresh.",
      ],
    },

    {
      id: 2,
      name: "Grilled Chicken Bowl",
      category: ["Protein", "Healthy"],
      time: "25 min",
      calories: "480 kcal",
      difficulty: "Medium",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
      description:
        "A balanced high-protein meal with grilled chicken, vegetables and rice.",
      ingredients: [
        "150g chicken breast",
        "1 cup cooked rice",
        "1/2 bell pepper",
        "1/2 cucumber",
        "1 tbsp olive oil",
        "Lemon juice",
        "Salt and pepper",
      ],
      steps: [
        "Clean and season the chicken breast.",
        "Heat a pan and lightly oil it.",
        "Grill the chicken until fully cooked.",
        "Prepare cooked rice and chop the vegetables.",
        "Combine everything in a bowl.",
        "Add lemon juice and serve.",
      ],
    },

    {
      id: 3,
      name: "Oatmeal Banana Bowl",
      category: ["Healthy", "Vegetarian", "Quick"],
      time: "10 min",
      calories: "350 kcal",
      difficulty: "Easy",
      image:
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=85",
      description:
        "A simple breakfast combining oats, banana and nutritious toppings.",
      ingredients: [
        "1/2 cup oats",
        "1 banana",
        "1 cup milk",
        "1 tsp honey",
        "1 tbsp nuts",
        "Cinnamon",
      ],
      steps: [
        "Add oats and milk to a pan.",
        "Cook on low heat for 4–5 minutes.",
        "Slice the banana.",
        "Transfer oats to a bowl.",
        "Add banana, nuts, honey and cinnamon.",
        "Serve warm.",
      ],
    },

    {
      id: 4,
      name: "Paneer Power Bowl",
      category: ["Protein", "Vegetarian"],
      time: "20 min",
      calories: "440 kcal",
      difficulty: "Medium",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",
      description:
        "A protein-rich vegetarian bowl with paneer and colorful vegetables.",
      ingredients: [
        "150g paneer",
        "1/2 bell pepper",
        "1/2 onion",
        "1 tomato",
        "1 tsp olive oil",
        "Turmeric",
        "Black pepper",
        "Salt",
      ],
      steps: [
        "Cut paneer and vegetables into small pieces.",
        "Heat oil in a pan.",
        "Add onion and bell pepper.",
        "Add paneer and spices.",
        "Cook until the paneer is lightly golden.",
        "Add tomato and cook for another 2 minutes.",
        "Serve hot.",
      ],
    },

    {
      id: 5,
      name: "Fruit Yogurt Bowl",
      category: ["Healthy", "Vegetarian", "Quick"],
      time: "8 min",
      calories: "280 kcal",
      difficulty: "Easy",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
      description:
        "A refreshing yogurt bowl with fresh fruits and crunchy toppings.",
      ingredients: [
        "1 cup yogurt",
        "1/2 banana",
        "1/2 cup berries",
        "1 apple",
        "1 tbsp nuts",
        "1 tsp honey",
      ],
      steps: [
        "Add fresh yogurt to a bowl.",
        "Wash and cut the fruits.",
        "Add banana, berries and apple.",
        "Top with nuts.",
        "Add a small amount of honey.",
        "Serve immediately.",
      ],
    },

    {
      id: 6,
      name: "Egg Protein Toast",
      category: ["Protein", "Quick"],
      time: "12 min",
      calories: "390 kcal",
      difficulty: "Easy",
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85",
      description:
        "A quick protein-focused breakfast with eggs and whole-grain toast.",
      ingredients: [
        "2 eggs",
        "2 slices whole-grain bread",
        "1 tomato",
        "1/2 avocado",
        "Black pepper",
        "Salt",
      ],
      steps: [
        "Toast the bread.",
        "Cook the eggs according to preference.",
        "Slice tomato and avocado.",
        "Place eggs on the toast.",
        "Add tomato and avocado.",
        "Season with salt and pepper.",
      ],
    },
  ];

  const filteredRecipes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const matchesCategory =
        activeCategory === "All" ||
        recipe.category.includes(activeCategory);

      const matchesSearch =
        !query ||
        recipe.name.toLowerCase().includes(query) ||
        recipe.category.some((item) =>
          item.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const quickRecipes = recipes.filter((recipe) =>
    recipe.category.includes("Quick")
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
                    <ChefHat size={15} />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    FoodAI Kitchen
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Healthy Recipes
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Simple meals built around fresh ingredients.
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/scan")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <ScanLine size={17} />
              Analyze Food
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

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur">
                <Sparkles size={14} />
                Smart food recommendations
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Turn fresh ingredients
                <span className="text-slate-400">
                  {" "}into better meals.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Explore quick recipes, healthy meals and
                protein-focused dishes. Pick a recipe based
                on your available time and food preference.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  onClick={() => setActiveCategory("Quick")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  <Clock3 size={16} />
                  Quick Recipes
                </button>

                <button
                  onClick={() => navigate("/scan")}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <Sparkles size={16} />
                  Scan Ingredients
                </button>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                <ChefHat
                  size={19}
                  className="text-slate-300"
                />

                <p className="mt-4 text-2xl font-bold">
                  {recipes.length}+
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Curated recipes
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                <Clock3
                  size={19}
                  className="text-emerald-400"
                />

                <p className="mt-4 text-2xl font-bold">
                  {quickRecipes}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Quick options
                </p>

              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <ShieldCheck
                      size={16}
                      className="text-emerald-400"
                    />

                    <span className="text-xs font-semibold text-slate-300">
                      FoodAI recipe collection
                    </span>

                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {favorites.length} saved
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
              placeholder="Search recipes or categories..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              >
                <X size={17} />
              </button>
            )}

          </div>

        </section>

        {/* ===================================================
            CATEGORIES
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
            COLLECTION HEADER
        =================================================== */}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Recipe Collection
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {filteredRecipes.length}
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              {filteredRecipes.length} recipe
              {filteredRecipes.length !== 1 ? "s" : ""} available
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

            <CircleCheck size={14} className="text-emerald-600" />

            Fresh ingredient focused

          </div>

        </div>

        {/* ===================================================
            RECIPE GRID
        =================================================== */}

        {filteredRecipes.length > 0 ? (

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredRecipes.map((recipe) => {

              const isFavorite =
                favorites.includes(recipe.id);

              return (
                <article
                  key={recipe.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}

                  <div className="relative h-56 overflow-hidden bg-slate-100">

                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">

                      {recipe.category.slice(0, 2).map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md"
                          >
                            {item}
                          </span>
                        )
                      )}

                    </div>

                    <button
                      onClick={() =>
                        toggleFavorite(recipe.id)
                      }
                      className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition ${
                        isFavorite
                          ? "bg-white text-slate-950"
                          : "bg-black/50 text-white hover:bg-black/70"
                      }`}
                      title={
                        isFavorite
                          ? "Remove favorite"
                          : "Save recipe"
                      }
                    >
                      <Heart
                        size={17}
                        fill={
                          isFavorite
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <div className="absolute bottom-4 left-4 right-4">

                      <h3 className="text-xl font-bold text-white drop-shadow">
                        {recipe.name}
                      </h3>

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    <p className="text-sm leading-6 text-slate-500">
                      {recipe.description}
                    </p>

                    {/* META */}

                    <div className="mt-5 grid grid-cols-3 gap-2">

                      <div className="rounded-xl bg-slate-50 p-3 text-center">

                        <Clock3
                          size={16}
                          className="mx-auto text-slate-500"
                        />

                        <p className="mt-1.5 text-xs font-bold text-slate-800">
                          {recipe.time}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Time
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 text-center">

                        <Flame
                          size={16}
                          className="mx-auto text-slate-500"
                        />

                        <p className="mt-1.5 text-xs font-bold text-slate-800">
                          {recipe.calories}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Calories
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 text-center">

                        <Utensils
                          size={16}
                          className="mx-auto text-slate-500"
                        />

                        <p className="mt-1.5 text-xs font-bold text-slate-800">
                          {recipe.difficulty}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Level
                        </p>

                      </div>

                    </div>

                    {/* ACTION */}

                    <button
                      onClick={() =>
                        setSelectedRecipe(recipe)
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      View Recipe
                      <ChevronRight size={16} />
                    </button>

                  </div>

                </article>
              );
            })}

          </div>

        ) : (

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={26} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No recipes found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try another recipe name or select a different
              category.
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
            AI RECOMMENDATION
        =================================================== */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Sparkles size={20} />
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h3 className="text-base font-bold text-slate-950">
                    AI Recipe Assistant
                  </h3>

                  <span className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-violet-600">
                    Coming soon
                  </span>

                </div>

                <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
                  In the next version, FoodAI can recommend
                  recipes based on ingredients detected in
                  your food scans.
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/scan")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
            >
              Scan Ingredients
              <ChevronRight size={16} />
            </button>

          </div>

        </section>

        {/* ===================================================
            INFORMATION
        =================================================== */}

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4">

          <div className="flex items-start gap-3">

            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-xs leading-5 text-slate-500">
              Nutritional values shown are approximate and can
              vary based on ingredients, serving sizes and
              preparation methods. Always consider your
              individual dietary requirements.
            </p>

          </div>

        </section>

      </main>

      {/* =====================================================
          RECIPE MODAL
      ===================================================== */}

      {selectedRecipe && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedRecipe(null)}
        >

          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL IMAGE */}

            <div className="relative h-56 overflow-hidden sm:h-72">

              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
              >
                <X size={19} />
              </button>

              <button
                onClick={() =>
                  toggleFavorite(selectedRecipe.id)
                }
                className="absolute right-16 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
              >
                <Heart
                  size={18}
                  fill={
                    favorites.includes(
                      selectedRecipe.id
                    )
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7">

                <div className="flex flex-wrap gap-2">

                  {selectedRecipe.category.map(
                    (category) => (
                      <span
                        key={category}
                        className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-200 backdrop-blur"
                      >
                        {category}
                      </span>
                    )
                  )}

                </div>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  {selectedRecipe.name}
                </h2>

              </div>

            </div>

            {/* MODAL BODY */}

            <div className="max-h-[55vh] overflow-y-auto p-5 sm:p-7">

              {/* META */}

              <div className="grid grid-cols-3 gap-3">

                <div className="rounded-xl bg-slate-50 p-3 text-center">

                  <Clock3
                    size={17}
                    className="mx-auto text-slate-500"
                  />

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedRecipe.time}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Preparation
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-center">

                  <Flame
                    size={17}
                    className="mx-auto text-slate-500"
                  />

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedRecipe.calories}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Calories
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-center">

                  <Utensils
                    size={17}
                    className="mx-auto text-slate-500"
                  />

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedRecipe.difficulty}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Difficulty
                  </p>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-7">

                <p className="text-sm leading-6 text-slate-600">
                  {selectedRecipe.description}
                </p>

              </div>

              {/* INGREDIENTS */}

              <div className="mt-7">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Leaf size={16} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-950">
                    Ingredients
                  </h3>

                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">

                  {selectedRecipe.ingredients.map(
                    (ingredient) => (
                      <div
                        key={ingredient}
                        className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
                      >
                        <CheckCircle2
                          size={15}
                          className="shrink-0 text-emerald-500"
                        />

                        {ingredient}
                      </div>
                    )
                  )}

                </div>

              </div>

              {/* STEPS */}

              <div className="mt-8">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Utensils size={15} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-950">
                    Preparation
                  </h3>

                </div>

                <div className="mt-5 space-y-5">

                  {selectedRecipe.steps.map(
                    (step, index) => (
                      <div
                        key={step}
                        className="flex gap-3"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                          {index + 1}
                        </div>

                        <p className="pt-1 text-sm leading-6 text-slate-600">
                          {step}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">

              <button
                onClick={() => setSelectedRecipe(null)}
                className="w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close Recipe
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Recipes;