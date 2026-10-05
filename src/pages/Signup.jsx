import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ScanLine,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to create account."
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login", {
          state: {
            signupSuccess: true,
            email: email.trim(),
          },
        });
      }, 1200);

    } catch (error) {
      console.error("Signup error:", error);

      if (
        error.message.includes("Failed to fetch")
      ) {
        setError(
          "Unable to connect to FoodAI server. Please make sure the backend is running."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                <ScanLine size={21} />
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  FoodAI
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Food Intelligence
                </p>
              </div>
            </div>

            {/* HERO */}
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Sparkles
                  size={14}
                  className="text-violet-300"
                />

                <span className="text-[11px] font-semibold text-slate-300">
                  AI-Powered Food Analysis
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Smarter food decisions,
                <span className="block text-slate-400">
                  powered by AI.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
                Create your FoodAI account and start analyzing food with
                intelligent recognition and visible quality insights.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "AI-powered food recognition",
                  "Visible quality analysis",
                  "Personal scan history",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2
                        size={15}
                        className="text-emerald-400"
                      />
                    </div>

                    <span className="text-sm text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <p className="text-xs text-slate-500">
              © 2026 FoodAI • AI-powered food quality intelligence
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                <ScanLine size={19} />
              </div>

              <div>
                <p className="font-bold text-slate-950">
                  FoodAI
                </p>

                <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                  Food Intelligence
                </p>
              </div>
            </div>

            {/* HEADER */}
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                <User size={21} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join FoodAI and start using AI-powered food intelligence.
              </p>
            </div>

            {/* CARD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              {/* ERROR */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs font-semibold leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <CheckCircle2
                    size={17}
                    className="text-emerald-600"
                  />

                  <p className="text-xs font-semibold text-emerald-700">
                    Account created. Redirecting to login...
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* NAME */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter your name"
                      disabled={loading || success}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      disabled={loading || success}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                      disabled={loading || success}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      disabled={loading || success}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Re-enter your password"
                      disabled={loading || success}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      disabled={loading || success}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* TERMS */}
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <p className="text-[11px] leading-5 text-slate-500">
                    By creating an account, you agree to use FoodAI
                    responsibly and understand that AI results are
                    informational.
                  </p>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Creating Account...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 size={17} />
                      Account Created
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* LOGIN */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-xs text-slate-500">
                  Already have an account?
                </p>

                <Link
                  to="/login"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-slate-950 hover:underline"
                >
                  Sign in to FoodAI
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* SECURITY */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck size={13} />
              Secure FoodAI workspace
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;