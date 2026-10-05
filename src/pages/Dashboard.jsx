import { useCallback, useEffect, useState } from "react";

import {
  ScanLine,
  Apple,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Activity,
  CheckCircle2,
  Clock3,
  ChevronRight,
  Database,
  Wifi,
  TrendingUp,
  Zap,
  CircleDot,
  BrainCircuit,
  BarChart3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate(); // --------------------------------------------------
  // Logged-in User
  // --------------------------------------------------

  const storedUser =
    localStorage.getItem("foodai_user") ||
    sessionStorage.getItem("foodai_user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const userName = user?.name || "User"; // --------------------------------------------------
  // Stats
  // --------------------------------------------------

  const [stats, setStats] = useState({
    total_scans: 0,

    fresh_food: 0,

    needs_attention: 0,

    average_confidence: 0,
  });

  const [recentScans, setRecentScans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(""); // --------------------------------------------------
  // Fetch dashboard data
  // --------------------------------------------------

  const fetchDashboardData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const statsResponse = await fetch(
          "http://127.0.0.1:8000/dashboard-stats",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!statsResponse.ok) {
          throw new Error(
            `Dashboard stats request failed (${statsResponse.status}).`,
          );
        }

        const statsData = await statsResponse.json();

        setStats({
          total_scans: Number(statsData.total_scans || 0),
          fresh_food: Number(statsData.fresh_food || 0),
          needs_attention: Number(statsData.needs_attention || 0),
          average_confidence: Number(statsData.average_confidence || 0),
        });

        // History is secondary. If it fails, the dashboard stats
        // still remain available.
        try {
          const historyResponse = await fetch("http://127.0.0.1:8000/history", {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });

          if (historyResponse.ok) {
            const historyData = await historyResponse.json();

            setRecentScans(
              Array.isArray(historyData.scans)
                ? historyData.scans.slice(0, 4)
                : [],
            );
          } else {
            console.warn(`History request failed (${historyResponse.status}).`);
            setRecentScans([]);
          }
        } catch (historyError) {
          console.warn("History request failed:", historyError);
          setRecentScans([]);
        }
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(err?.message || "Unable to connect with AI server.");
      } finally {
        setLoading(false);

        setRefreshing(false);
      }
    },

    [],
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); // --------------------------------------------------
  // Calculations
  // --------------------------------------------------

  const total = stats.total_scans || 0;

  const freshPercentage =
    total > 0 ? Math.round((stats.fresh_food / total) * 100) : 0;

  const attentionPercentage =
    total > 0 ? Math.round((stats.needs_attention / total) * 100) : 0;

  const confidence = Math.max(
    0,

    Math.min(
      100,

      Number(stats.average_confidence || 0),
    ),
  ); // --------------------------------------------------
  // Date
  // --------------------------------------------------

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unknown date";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",

      month: "short",

      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",

      minute: "2-digit",
    });
  }; // --------------------------------------------------
  // Quality style
  // --------------------------------------------------

  const getQualityStyle = (quality) => {
    const normalized = String(quality || "").toLowerCase();

    if (normalized === "fresh") {
      return {
        icon: CheckCircle2,

        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",

        dot: "bg-emerald-500",
      };
    }

    if (normalized === "rotten") {
      return {
        icon: AlertTriangle,

        badge: "bg-red-50 text-red-700 border-red-200",

        dot: "bg-red-500",
      };
    }

    if (normalized === "unknown" || normalized === "unavailable") {
      return {
        icon: AlertTriangle,

        badge: "bg-amber-50 text-amber-700 border-amber-200",

        dot: "bg-amber-500",
      };
    }

    return {
      icon: Activity,

      badge: "bg-slate-50 text-slate-600 border-slate-200",

      dot: "bg-slate-400",
    };
  }; // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="relative min-h-full overflow-hidden">
            {/* Ambient background */}     {" "}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
               {" "}
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
               {" "}
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-violet-100/30 blur-3xl" />
               {" "}
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" />
             {" "}
      </div>
           {" "}
      <div className="mx-auto max-w-[1600px] space-y-6">
               {" "}
        {/* =====================================================

            PREMIUM HERO

        ===================================================== */}
               {" "}
        <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-[0_25px_70px_-30px_rgba(15,23,42,0.65)] sm:px-8 lg:px-10 lg:py-10">
                    {/* Glow */}
                   {" "}
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
                   {" "}
          <div className="pointer-events-none absolute bottom-[-120px] left-[35%] h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
                   {" "}
          <div className="pointer-events-none absolute right-[28%] top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
                   {" "}
          <div className="relative">
                       {" "}
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                           {" "}
              <div className="max-w-3xl">
                                {/* System status */}               {" "}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-bold tracking-wide text-slate-200 backdrop-blur">
                                   {" "}
                  <span className="relative flex h-2.5 w-2.5">
                                       {" "}
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                                       {" "}
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                     {" "}
                  </span>
                                    FOODAI INTELLIGENCE ENGINE                  {" "}
                  <span className="text-emerald-400">
                                        • ONLINE                  {" "}
                  </span>
                                 {" "}
                </div>
                               {" "}
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                    Welcome back,                  {" "}
                  <span className="text-emerald-400">
                                        {userName}                 {" "}
                  </span>
                                    <span className="ml-2">👋</span>           
                     {" "}
                </h1>
                               {" "}
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                                    Your centralized AI workspace for food      
                              recognition, freshness intelligence and          
                          scan analytics.                {" "}
                </p>
                                {/* Mini system indicators */}               {" "}
                <div className="mt-6 flex flex-wrap gap-3">
                                   {" "}
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-300">
                                       {" "}
                    <BrainCircuit size={15} className="text-emerald-400" />     
                                  AI Recognition                  {" "}
                  </div>
                                   {" "}
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-300">
                                       {" "}
                    <ShieldCheck size={15} className="text-blue-400" />         
                              Quality Analysis                  {" "}
                  </div>
                                   {" "}
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-300">
                                       {" "}
                    <Database size={15} className="text-violet-400" />         
                              Live Database                  {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
                            {/* Hero action */}             {" "}
              <div className="shrink-0">
                               {" "}
                <button
                  onClick={() => navigate("/scan")}
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-950 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-auto"
                >
                                   {" "}
                  <span className="absolute inset-0 -translate-x-full bg-emerald-100 transition-transform duration-500 group-hover:translate-x-0" />
                                   {" "}
                  <span className="relative flex items-center gap-3">
                                       {" "}
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                                            <ScanLine size={18} />             
                           {" "}
                    </span>
                                        Start AI Scan                    {" "}
                    <ArrowUpRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                                     {" "}
                  </span>
                                 {" "}
                </button>
                               {" "}
                <p className="mt-3 text-center text-[11px] text-slate-500">
                                    Upload • Analyze • Understand              
                   {" "}
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </section>
               {" "}
        {/* =====================================================

            ERROR

        ===================================================== */}
               {" "}
        {error && (
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center">
                       {" "}
            <div>
                           {" "}
              <p className="font-semibold text-red-800">
                                Dashboard connection error              {" "}
              </p>
                           {" "}
              <p className="mt-1 text-sm text-red-600">
                                {error}             {" "}
              </p>
                         {" "}
            </div>
                       {" "}
            <button
              onClick={() => fetchDashboardData(false)}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
                            Retry            {" "}
            </button>
                     {" "}
          </div>
        )}
               {" "}
        {/* =====================================================

            STAT CARDS

        ===================================================== */}
               {" "}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                   {" "}
          <PremiumStatCard
            title="Total Scans"
            value={stats.total_scans}
            subtitle="All AI analyses"
            icon={ScanLine}
            loading={loading}
            accent="slate"
            onClick={() => navigate("/history")}
          />
                   {" "}
          <PremiumStatCard
            title="Fresh Food"
            value={stats.fresh_food}
            subtitle={`${freshPercentage}% of all scans`}
            icon={Apple}
            loading={loading}
            accent="emerald"
          />
                   {" "}
          <PremiumStatCard
            title="Needs Attention"
            value={stats.needs_attention}
            subtitle={`${attentionPercentage}% of all scans`}
            icon={AlertTriangle}
            loading={loading}
            accent="amber"
            onClick={() => navigate("/history")}
          />
                   {" "}
          <PremiumStatCard
            title="AI Confidence"
            value={`${confidence.toFixed(2)}%`}
            subtitle="Average recognition confidence"
            icon={Sparkles}
            loading={loading}
            accent="violet"
          />
                 {" "}
        </section>
               {" "}
        {/* =====================================================

            INTELLIGENCE + QUICK ACTIONS

        ===================================================== */}
               {" "}
        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
                    {/* AI Intelligence */}         {" "}
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)] sm:p-7">
                       {" "}
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-50 blur-3xl" />
                       {" "}
            <div className="relative">
                           {" "}
              <div className="flex items-start justify-between">
                               {" "}
                <div>
                                   {" "}
                  <div className="flex items-center gap-2">
                                       {" "}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                                            <BrainCircuit size={19} />         
                               {" "}
                    </div>
                                       {" "}
                    <div>
                                           {" "}
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                AI Analytics                    
                         {" "}
                      </p>
                                           {" "}
                      <h2 className="mt-0.5 text-xl font-bold text-slate-950">
                                                System Intelligence            
                                 {" "}
                      </h2>
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                               {" "}
                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                   {" "}
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 
                                  Operational                {" "}
                </div>
                             {" "}
              </div>
                            {/* Analytics area */}             {" "}
              <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
                                {/* Confidence circle */}               {" "}
                <div className="flex justify-center">
                                   {" "}
                  <div className="relative flex h-52 w-52 items-center justify-center">
                                       {" "}
                    <div className="absolute inset-0 rounded-full border-[14px] border-slate-100" />
                                       {" "}
                    {!loading && (
                      <div
                        className="absolute inset-0 rounded-full border-[14px] border-transparent border-t-emerald-500 border-r-emerald-400 transition-all duration-1000"
                        style={{
                          transform: `rotate(${confidence * 1.8 - 90}deg)`,
                        }}
                      />
                    )}
                                       {" "}
                    <div className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full bg-slate-50 shadow-inner">
                                           {" "}
                      <p className="text-4xl font-black tracking-tight text-slate-950">
                                               {" "}
                        {loading ? "—" : `${confidence.toFixed(1)}%`}           
                                 {" "}
                      </p>
                                           {" "}
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Avg Confidence                  
                           {" "}
                      </p>
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                                {/* Intelligence details */}               {" "}
                <div className="space-y-4">
                                   {" "}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                       {" "}
                    <div className="flex items-center justify-between">
                                           {" "}
                      <div className="flex items-center gap-3">
                                               {" "}
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                                    <TrendingUp size={18} />   
                                             {" "}
                        </div>
                                               {" "}
                        <div>
                                                   {" "}
                          <p className="text-sm font-bold text-slate-900">
                                                        Recognition Performance
                                                     {" "}
                          </p>
                                                   {" "}
                          <p className="text-xs text-slate-500">
                                                        Average model confidence
                                                     {" "}
                          </p>
                                                 {" "}
                        </div>
                                             {" "}
                      </div>
                                           {" "}
                      <span className="text-lg font-black text-slate-950">
                                               {" "}
                        {loading ? "—" : `${confidence.toFixed(1)}%`}           
                                 {" "}
                      </span>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                                           {" "}
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                        style={{
                          width: `${confidence}%`,
                        }}
                      />
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                                   {" "}
                  <div className="grid gap-3 sm:grid-cols-2">
                                       {" "}
                    <MiniMetric
                      icon={Database}
                      title="Database"
                      value="MongoDB"
                      iconClass="bg-blue-50 text-blue-600"
                    />
                                       {" "}
                    <MiniMetric
                      icon={Wifi}
                      title="API Status"
                      value="Connected"
                      iconClass="bg-emerald-50 text-emerald-600"
                    />
                                     {" "}
                  </div>
                                   {" "}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                                       {" "}
                    <CircleDot size={13} className="text-emerald-500" />       
                                AI inference engine is ready for analysis      
                               {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                    {/* Quick actions */}         {" "}
          <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_25px_70px_-35px_rgba(15,23,42,0.7)] sm:p-7">
                       {" "}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
                       {" "}
            <div className="relative">
                           {" "}
              <div className="flex items-center justify-between">
                               {" "}
                <div>
                                   {" "}
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                        Workspace                  {" "}
                  </p>
                                   {" "}
                  <h2 className="mt-1 text-xl font-bold">
                                        Quick Actions                  {" "}
                  </h2>
                                 {" "}
                </div>
                               {" "}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-emerald-400">
                                    <Zap size={19} />               {" "}
                </div>
                             {" "}
              </div>
                           {" "}
              <div className="mt-6 space-y-3">
                               {" "}
                <DarkQuickAction
                  icon={ScanLine}
                  title="Scan New Food"
                  description="Start a fresh AI analysis"
                  primary
                  onClick={() => navigate("/scan")}
                />
                               {" "}
                <DarkQuickAction
                  icon={Clock3}
                  title="Scan History"
                  description="Review previous analyses"
                  onClick={() => navigate("/history")}
                />
                               {" "}
                <DarkQuickAction
                  icon={Sparkles}
                  title="AI Food Guide"
                  description="Explore food intelligence"
                  onClick={() => navigate("/food-guide")}
                />
                               {" "}
                <DarkQuickAction
                  icon={BarChart3}
                  title="Recipes"
                  description="Get smart food ideas"
                  onClick={() => navigate("/recipes")}
                />
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </section>
               {" "}
        {/* =====================================================

            RECENT SCANS

        ===================================================== */}
               {" "}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)]">
                   {" "}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:p-7">
                       {" "}
            <div>
                           {" "}
              <div className="flex items-center gap-2">
                               {" "}
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                               {" "}
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                                    Live Database                {" "}
                </p>
                             {" "}
              </div>
                           {" "}
              <h2 className="mt-1 text-xl font-bold text-slate-950">
                                Recent AI Analyses              {" "}
              </h2>
                           {" "}
              <p className="mt-1 text-sm text-slate-500">
                                Latest food recognition and quality results    
                         {" "}
              </p>
                         {" "}
            </div>
                       {" "}
            <button
              onClick={() => navigate("/history")}
              className="group inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 sm:self-auto"
            >
                            View all              {" "}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
                         {" "}
            </button>
                     {" "}
          </div>
                   {" "}
          <div className="divide-y divide-slate-100">
                       {" "}
            {loading ? (
              <div className="p-12 text-center">
                               {" "}
                <RefreshCw
                  size={24}
                  className="mx-auto animate-spin text-emerald-500"
                />
                               {" "}
                <p className="mt-3 text-sm font-medium text-slate-500">
                                    Loading recent scans...                {" "}
                </p>
                             {" "}
              </div>
            ) : recentScans.length === 0 ? (
              <div className="p-12 text-center">
                               {" "}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                    <ScanLine size={28} />               {" "}
                </div>
                               {" "}
                <p className="mt-4 font-bold text-slate-800">
                                    No scans yet                {" "}
                </p>
                               {" "}
                <p className="mt-1 text-sm text-slate-500">
                                    Start your first AI food analysis.          
                       {" "}
                </p>
                               {" "}
                <button
                  onClick={() => navigate("/scan")}
                  className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                                    Scan Food                {" "}
                </button>
                             {" "}
              </div>
            ) : (
              recentScans.map((scan) => {
                const qualityStyle = getQualityStyle(scan.quality);

                const QualityIcon = qualityStyle.icon;

                const scanConfidence =
                  scan.food_confidence !== null &&
                  scan.food_confidence !== undefined
                    ? Number(scan.food_confidence)
                    : null;

                return (
                  <div
                    key={
                      scan.id || scan._id || `${scan.food}-${scan.created_at}`
                    }
                    className="group flex flex-col gap-4 p-5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                                       {" "}
                    <div className="flex min-w-0 items-center gap-4">
                                           {" "}
                      <div className="relative flex h-13 w-13 h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 ring-1 ring-slate-200">
                                                <Apple size={22} />
                                               {" "}
                        <span
                          className={`absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${qualityStyle.dot}`}
                        />
                                             {" "}
                      </div>
                                           {" "}
                      <div className="min-w-0">
                                               {" "}
                        <div className="flex items-center gap-2">
                                                   {" "}
                          <p className="truncate font-bold capitalize text-slate-900">
                                                       {" "}
                            {scan.food || "Unknown Food"}                       
                             {" "}
                          </p>
                                                   {" "}
                          <span className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:inline">
                                                        AI Scan                
                                     {" "}
                          </span>
                                                 {" "}
                        </div>
                                               {" "}
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                                   {" "}
                          <span>
                                                       {" "}
                            {formatDate(scan.created_at)}                       
                             {" "}
                          </span>
                                                    <span>•</span>             
                                     {" "}
                          <span>
                                                       {" "}
                            {formatTime(scan.created_at)}                       
                             {" "}
                          </span>
                                                    <span>•</span>             
                                     {" "}
                          <span>
                                                       {" "}
                            {scanConfidence !== null
                              ? `${scanConfidence.toFixed(2)}% confidence`
                              : "No confidence"}
                                                     {" "}
                          </span>
                                                 {" "}
                        </div>
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="flex items-center gap-3 sm:pl-4">
                                           {" "}
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${qualityStyle.badge}`}
                      >
                                                <QualityIcon size={14} />       
                                        {scan.quality || "Unknown"}             
                               {" "}
                      </div>
                                           {" "}
                      <ChevronRight
                        size={18}
                        className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-500"
                      />
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                );
              })
            )}
                     {" "}
          </div>
                 {" "}
        </section>
               {" "}
        {/* =====================================================

            INSIGHT BANNER

        ===================================================== */}
               {" "}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-950 p-6 text-white shadow-[0_25px_70px_-30px_rgba(5,150,105,0.55)] sm:p-8">
                   {" "}
          <div className="absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                   {" "}
          <div className="absolute bottom-[-100px] left-[35%] h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
                   {" "}
          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
                       {" "}
            <div>
                           {" "}
              <div className="mb-3 flex items-center gap-2 text-emerald-100">
                                <Sparkles size={18} />               {" "}
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                                    FoodAI Intelligence                {" "}
                </span>
                             {" "}
              </div>
                           {" "}
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                                Ready to analyze your next food?            
                 {" "}
              </h2>
                           {" "}
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/70">
                                Upload a clear food image and let the          
                      AI system recognize the food and                 evaluate
                its visual freshness.              {" "}
              </p>
                         {" "}
            </div>
                       {" "}
            <button
              onClick={() => navigate("/scan")}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-slate-950 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
                            <ScanLine size={18} />
                            Start AI Scan              {" "}
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
                         {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </section>
               {" "}
        {/* =====================================================

            DISCLAIMER

        ===================================================== */}
               {" "}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                   {" "}
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-slate-400" /> 
                 {" "}
          <p className="text-xs leading-5 text-slate-500">
                        FoodAI provides AI-assisted visual analysis.            
            Results are estimates based on trained models             and image
            quality and should not replace             professional food safety
            inspection.          {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}

// =====================================================

// PREMIUM STAT CARD

// =====================================================

function PremiumStatCard({
  title,

  value,

  subtitle,

  icon: Icon,

  loading,

  accent = "slate",

  onClick,
}) {
  const accents = {
    slate: {
      icon: "bg-slate-950 text-white",

      glow: "bg-slate-200/40",

      number: "text-slate-950",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",

      glow: "bg-emerald-100/50",

      number: "text-emerald-700",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",

      glow: "bg-amber-100/50",

      number: "text-amber-700",
    },

    violet: {
      icon: "bg-violet-50 text-violet-600",

      glow: "bg-violet-100/50",

      number: "text-violet-700",
    },
  };

  const current = accents[accent];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-[0_15px_40px_-30px_rgba(15,23,42,0.4)] transition duration-300 ${
        onClick
          ? "cursor-pointer hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_25px_50px_-30px_rgba(15,23,42,0.45)]"
          : "cursor-default"
      }`}
    >
           {" "}
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl transition group-hover:scale-125 ${current.glow}`}
      />
           {" "}
      <div className="relative">
               {" "}
        <div className="flex items-start justify-between">
                   {" "}
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${current.icon}`}
          >
                        <Icon size={20} />         {" "}
          </div>
                   {" "}
          {onClick && (
            <ArrowUpRight
              size={17}
              className="text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-600"
            />
          )}
                 {" "}
        </div>
               {" "}
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {title}       {" "}
        </p>
               {" "}
        <p
          className={`mt-1 text-3xl font-black tracking-tight ${current.number}`}
        >
                    {loading ? "—" : value}       {" "}
        </p>
               {" "}
        <p className="mt-1 text-xs font-medium text-slate-500">
                    {subtitle}       {" "}
        </p>
             {" "}
      </div>
         {" "}
    </button>
  );
}

// =====================================================

// MINI METRIC

// =====================================================

function MiniMetric({
  icon: Icon,

  title,

  value,

  iconClass,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5">
           {" "}
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
      >
                <Icon size={16} />     {" "}
      </div>
           {" "}
      <div>
               {" "}
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {title}       {" "}
        </p>
               {" "}
        <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {value}       {" "}
        </p>
             {" "}
      </div>
         {" "}
    </div>
  );
}

// =====================================================

// DARK QUICK ACTION

// =====================================================

function DarkQuickAction({
  icon: Icon,

  title,

  description,

  onClick,

  primary = false,
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition duration-300 ${
        primary
          ? "border-emerald-400/20 bg-emerald-400/10 hover:bg-emerald-400/15"
          : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
           {" "}
      <div className="flex items-center gap-3">
               {" "}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            primary
              ? "bg-emerald-400 text-slate-950"
              : "bg-white/10 text-slate-300"
          }`}
        >
                    <Icon size={18} />       {" "}
        </div>
               {" "}
        <div>
                   {" "}
          <p className="font-bold text-white">            {title}          </p> 
                 {" "}
          <p className="mt-0.5 text-[11px] text-slate-500">
                        {description}         {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <ChevronRight
        size={18}
        className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-slate-300"
      />
         {" "}
    </button>
  );
}

export default Dashboard;
