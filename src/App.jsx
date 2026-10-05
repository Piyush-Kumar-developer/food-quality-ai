import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import ScanFood from "./pages/ScanFood";
import AIProcessing from "./pages/AIProcessing";
import Result from "./pages/Result";
import History from "./pages/History";
import FoodGuide from "./pages/FoodGuide";
import Recipes from "./pages/Recipes";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


// ============================================================
// SCROLL TO TOP
// ============================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}


// ============================================================
// APP CONTENT
// ============================================================

function AppContent() {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";


  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================================
          GLOBAL SCROLL RESET
      ====================================================== */}

      <ScrollToTop />


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      {!isAuthPage && (
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}


      {/* ======================================================
          MAIN APP AREA
      ====================================================== */}

      <div
        className={
          !isAuthPage
            ? "lg:pl-64"
            : ""
        }
      >

        {/* ====================================================
            NAVBAR
        ==================================================== */}

        {!isAuthPage && (
          <Navbar
            setIsOpen={setIsOpen}
          />
        )}


        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <main
          className={
            !isAuthPage
              ? "p-4 sm:p-6 lg:p-8"
              : ""
          }
        >

          <Routes>

            {/* ==================================================
                AUTH ROUTES
            ================================================== */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />


            {/* ==================================================
                PROTECTED ROUTES
            ================================================== */}

            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <ScanFood />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ai-processing"
              element={
                <ProtectedRoute>
                  <AIProcessing />
                </ProtectedRoute>
              }
            />

            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            <Route
              path="/food-guide"
              element={
                <ProtectedRoute>
                  <FoodGuide />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recipes"
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />


            {/* ==================================================
                DASHBOARD
            ================================================== */}

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />


            {/* ==================================================
                FALLBACK
            ================================================== */}

            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}


// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
}

export default App;