import { useState } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ScanLine,
  Loader2,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);


  const signupSuccess =
    location.state?.signupSuccess === true;


  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }


    try {
      setLoading(true);


      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Invalid email or password."
        );
      }


      const user = {
        id: data.user?.id,
        name: data.user?.name,
        email: data.user?.email,
        loggedIn: true,
      };


      if (rememberMe) {
        localStorage.setItem(
          "foodai_user",
          JSON.stringify(user)
        );

        sessionStorage.removeItem(
          "foodai_user"
        );
      } else {
        sessionStorage.setItem(
          "foodai_user",
          JSON.stringify(user)
        );

        localStorage.removeItem(
          "foodai_user"
        );
      }


      setSuccess(
        "Login successful. Redirecting..."
      );


      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 900);


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      if (
        error.message ===
        "Failed to fetch"
      ) {
        setError(
          "Unable to connect to FoodAI server. Please make sure the backend is running."
        );
      } else {
        setError(
          error.message ||
            "Unable to login."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-[0_25px_80px_rgba(15,23,42,0.12)]">


        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-12 text-white">

          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/10" />


          <div className="relative z-10 flex flex-col justify-between w-full">

            <div>

              {/* LOGO */}

              <div className="flex items-center gap-3 mb-12">

                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">

                  <ScanLine size={23} />

                </div>


                <div>

                  <p className="font-bold text-xl tracking-tight">
                    FoodAI
                  </p>

                  <p className="text-xs text-emerald-100">
                    Intelligent Food Analysis
                  </p>

                </div>

              </div>


              {/* HERO */}

              <div className="max-w-md">

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold mb-6">

                  <Sparkles size={14} />

                  AI-Powered Food Intelligence

                </div>


                <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">

                  Welcome back to

                  <span className="block text-emerald-100">
                    smarter food analysis.
                  </span>

                </h1>


                <p className="mt-6 text-emerald-50/90 leading-7">

                  Sign in to continue analyzing food
                  quality, reviewing your scan history
                  and exploring intelligent food insights.

                </p>

              </div>


              {/* FEATURES */}

              <div className="mt-10 space-y-4">

                {[
                  "AI-powered food recognition",
                  "Freshness and quality analysis",
                  "Personal scan history",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium"
                  >

                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">

                      <CheckCircle2 size={15} />

                    </div>

                    {item}

                  </div>

                ))}

              </div>

            </div>


            {/* SECURITY */}

            <div className="flex items-center gap-2 text-xs text-emerald-100 mt-12">

              <ShieldCheck size={16} />

              Your food analysis data is handled securely.

            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="p-7 sm:p-10 lg:p-12">

          <div className="max-w-md mx-auto">


            {/* MOBILE BRAND */}

            <div className="lg:hidden flex items-center gap-3 mb-10">

              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">

                <ScanLine size={22} />

              </div>


              <div>

                <p className="font-bold text-xl">
                  FoodAI
                </p>

                <p className="text-xs text-slate-500">
                  Intelligent Food Analysis
                </p>

              </div>

            </div>


            {/* HEADER */}

            <div className="mb-8">

              <p className="text-sm font-semibold text-emerald-600 mb-2">
                ACCOUNT ACCESS
              </p>


              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>


              <p className="mt-2 text-sm text-slate-500">
                Sign in to your FoodAI workspace.
              </p>

            </div>


            {/* SIGNUP SUCCESS */}

            {signupSuccess && (

              <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

                <CheckCircle2 size={17} />

                <span>
                  Account created successfully.
                  Please sign in.
                </span>

              </div>

            )}


            {/* FORM */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >


              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address
                </label>


                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />


                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@example.com"
                    disabled={loading || !!success}
                    className="w-full h-13 pl-11 pr-4 rounded-2xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>


                  <button
                    type="button"
                    disabled={loading || !!success}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                    onClick={() =>
                      alert(
                        "Password reset will be available soon."
                      )
                    }
                  >
                    Forgot password?
                  </button>

                </div>


                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />


                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter your password"
                    disabled={loading || !!success}
                    className="w-full h-13 pl-11 pr-12 rounded-2xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />


                  <button
                    type="button"
                    disabled={loading || !!success}
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 disabled:opacity-50"
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* REMEMBER */}

              <label className="flex items-center gap-3 cursor-pointer select-none">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  disabled={loading || !!success}
                  className="w-4 h-4 accent-emerald-600"
                />


                <span className="text-sm text-slate-600">
                  Keep me signed in
                </span>

              </label>


              {/* ERROR */}

              {error && (

                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                  {error}

                </div>

              )}


              {/* SUCCESS */}

              {success && (

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">

                  <CheckCircle2 size={17} />

                  {success}

                </div>

              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-70"
              >

                {loading ? (

                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Signing in...
                  </>

                ) : success ? (

                  <>
                    <CheckCircle2 size={18} />

                    Signed in
                  </>

                ) : (

                  <>
                    Sign in

                    <ArrowRight size={18} />

                  </>

                )}

              </button>

            </form>


            {/* SIGNUP */}

            <div className="mt-8 text-center text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Create account
              </Link>

            </div>


            {/* SECURITY */}

            <div className="mt-8 pt-6 border-t border-slate-100">

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">

                <ShieldCheck size={15} />

                Secure FoodAI account access

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Login;