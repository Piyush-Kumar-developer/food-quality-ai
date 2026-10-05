import {
  LayoutDashboard,
  ScanLine,
  History,
  ChefHat,
  BookOpen,
  Settings,
  X,
  Leaf,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Scan Food",
    path: "/scan",
    icon: ScanLine,
  },
  {
    name: "History",
    path: "/history",
    icon: History,
  },
  {
    name: "Recipes",
    path: "/recipes",
    icon: ChefHat,
  },
  {
    name: "Food Guide",
    path: "/food-guide",
    icon: BookOpen,
  },
];

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64
          flex-col border-r border-slate-200 bg-white
          shadow-[4px_0_24px_rgba(15,23,42,0.03)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <NavLink
            to="/"
            end
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <Leaf size={21} strokeWidth={2.2} />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-950">
                FoodAI
              </h1>

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Food Intelligence
              </p>
            </div>
          </NavLink>

          {/* MOBILE CLOSE */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    group relative flex w-full items-center gap-3
                    rounded-xl px-3.5 py-3
                    text-sm font-semibold
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.4 : 2}
                        className="shrink-0"
                      />

                      <span className="flex-1">{item.name}</span>

                      {isActive && (
                        <ChevronRight
                          size={15}
                          className="text-slate-400"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* AI STATUS */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Sparkles size={15} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">
                  AI System
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-medium text-emerald-600">
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[88%] rounded-full bg-emerald-500" />
            </div>

            <p className="mt-2 text-[10px] leading-4 text-slate-400">
              Food recognition and quality analysis ready.
            </p>
          </div>
        </nav>

        {/* BOTTOM */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex w-full items-center gap-3 rounded-xl px-3.5 py-3
              text-sm font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }
            `}
          >
            <Settings size={18} />

            <span className="flex-1">Settings</span>

            <ChevronRight size={15} />
          </NavLink>

          {/* SECURITY */}
          <div className="mt-3 flex items-center gap-2 px-3 py-2">
            <ShieldCheck size={14} className="text-emerald-500" />

            <span className="text-[10px] font-medium text-slate-400">
              Secure AI workspace
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;