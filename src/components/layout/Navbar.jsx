import {
  Menu,
  Bell,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Settings,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  ScanLine,
  Check,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

function Navbar({ setIsOpen }) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [user, setUser] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "FoodAI is ready",
      message: "Your AI food analysis system is ready to use.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      type: "info",
      title: "AI analysis available",
      message: "Upload a food image to start a new quality scan.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 3,
      type: "success",
      title: "Secure session active",
      message: "Your FoodAI account session is protected.",
      time: "10 min ago",
      unread: false,
    },
  ]);

  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  // =====================================================
  // LOAD USER
  // =====================================================

  const loadUser = () => {
    const storedUser =
      localStorage.getItem("foodai_user") ||
      sessionStorage.getItem("foodai_user");

    if (!storedUser) {
      setUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // =====================================================
  // LISTEN FOR PROFILE UPDATES
  // =====================================================

  useEffect(() => {
    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener(
      "foodai-user-updated",
      handleUserUpdate
    );

    window.addEventListener(
      "storage",
      handleUserUpdate
    );

    return () => {
      window.removeEventListener(
        "foodai-user-updated",
        handleUserUpdate
      );

      window.removeEventListener(
        "storage",
        handleUserUpdate
      );
    };
  }, []);

  // =====================================================
  // CLOSE DROPDOWNS OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowMenu(false);
        setShowNotifications(false);
        setShowLogoutModal(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // USER DATA
  // =====================================================

  const userName = user?.name || "User";

  const userEmail =
    user?.email || "Food Analyst";

  const userPhoto = user?.profilePhoto || "";

  const userInitial =
    userName
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    if (type === "success") {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={17} />
        </div>
      );
    }

    if (type === "warning") {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertTriangle size={17} />
        </div>
      );
    }

    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Info size={17} />
      </div>
    );
  };

  // =====================================================
  // AVATAR
  // =====================================================

  const Avatar = ({
    size = "normal",
  }) => {
    const sizeClasses =
      size === "large"
        ? "h-11 w-11 text-sm"
        : size === "modal"
        ? "h-10 w-10 text-xs"
        : "h-9 w-9 text-xs";

    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-950 font-bold text-white shadow-sm ${sizeClasses}`}
      >
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={`${userName} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          userInitial
        )}
      </div>
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("foodai_user");
    sessionStorage.removeItem("foodai_user");

    setUser(null);
    setShowMenu(false);
    setShowNotifications(false);
    setShowLogoutModal(false);

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // OPEN LOGOUT
  // =====================================================

  const openLogoutConfirmation = () => {
    setShowMenu(false);
    setShowNotifications(false);
    setShowLogoutModal(true);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex items-center gap-3">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* DESKTOP TITLE */}

          <div className="hidden lg:block">
            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Sparkles size={15} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  AI Food Intelligence
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-semibold text-emerald-600">
                    System Online
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* MOBILE BRAND */}

          <div className="flex items-center gap-2 lg:hidden">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Sparkles size={15} />
            </div>

            <span className="text-base font-bold tracking-tight text-slate-950">
              FoodAI
            </span>

          </div>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="ml-auto flex items-center gap-2 sm:gap-3">

          {/* SECURITY STATUS */}

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">

            <ShieldCheck
              size={15}
              className="text-emerald-500"
            />

            <span className="text-[11px] font-semibold text-slate-600">
              Secure Session
            </span>

          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setShowNotifications(
                  (prev) => !prev
                );
                setShowMenu(false);
              }}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                showNotifications
                  ? "border-slate-200 bg-slate-100 text-slate-900"
                  : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <>
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />

                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[8px] font-bold text-white">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                </>
              )}
            </button>

            {/* NOTIFICATION PANEL */}

            {showNotifications && (
              <div className="absolute right-0 top-14 z-50 w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/30">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-4 py-4">

                  <div>
                    <div className="flex items-center gap-2">

                      <h3 className="text-sm font-bold text-slate-900">
                        Notifications
                      </h3>

                      {unreadCount > 0 && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">
                          {unreadCount} new
                        </span>
                      )}

                    </div>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      FoodAI system updates
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Check size={12} />
                      Mark all read
                    </button>
                  )}

                </div>

                {/* NOTIFICATION LIST */}

                {notifications.length > 0 ? (
                  <div className="max-h-[350px] overflow-y-auto">

                    {notifications.map(
                      (notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                          className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                            notification.unread
                              ? "bg-blue-50/30"
                              : "bg-white"
                          }`}
                        >

                          {getNotificationIcon(
                            notification.type
                          )}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <p className="text-xs font-bold text-slate-800">
                                {notification.title}
                              </p>

                              {notification.unread && (
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                              )}

                            </div>

                            <p className="mt-1 text-[11px] leading-4 text-slate-500">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-[9px] font-medium text-slate-400">
                              {notification.time}
                            </p>

                          </div>

                        </button>
                      )
                    )}

                  </div>
                ) : (
                  <div className="px-5 py-10 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Bell size={20} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      No notifications
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      You're all caught up.
                    </p>

                  </div>
                )}

                {/* FOOTER */}

                {notifications.length > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3">

                    <span className="text-[10px] text-slate-400">
                      {notifications.length} notifications
                    </span>

                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={12} />
                      Clear all
                    </button>

                  </div>
                )}

              </div>
            )}
          </div>

          {/* DIVIDER */}

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* =================================================
              USER AREA
          ================================================= */}

          <div
            ref={menuRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setShowMenu((prev) => !prev)
              }
              className="group flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-slate-50"
              aria-label="Open profile menu"
              aria-expanded={showMenu}
            >

              <Avatar />

              <div className="hidden text-left sm:block">

                <p className="max-w-[130px] truncate text-sm font-bold leading-4 text-slate-800">
                  {userName}
                </p>

                <p className="mt-1 max-w-[170px] truncate text-[10px] font-medium text-slate-400">
                  {userEmail}
                </p>

              </div>

              <ChevronDown
                size={15}
                className={`hidden text-slate-400 transition sm:block ${
                  showMenu ? "rotate-180" : ""
                }`}
              />

            </button>

            {/* USER DROPDOWN */}

            {showMenu && (
              <div className="absolute right-0 top-14 z-50 w-[290px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/30">

                <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-4 py-4">

                  <div className="flex items-center gap-3">

                    <Avatar size="large" />

                    <div className="min-w-0">

                      <p className="truncate text-sm font-bold text-slate-900">
                        {userName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {userEmail}
                      </p>

                    </div>

                  </div>

                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">

                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    <span className="text-[11px] font-semibold text-emerald-700">
                      Account Active
                    </span>

                    <span className="ml-auto text-[10px] font-medium text-emerald-600">
                      Food Analyst
                    </span>

                  </div>

                </div>

                <div className="p-2">

                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/settings");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Settings size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Profile & Settings
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Manage your FoodAI account
                      </p>
                    </div>

                  </button>

                </div>

                <div className="border-t border-slate-100 p-2">

                  <button
                    type="button"
                    onClick={openLogoutConfirmation}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                      <LogOut size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Sign Out
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-red-400">
                        End your current session
                      </p>
                    </div>

                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* =====================================================
          LOGOUT CONFIRMATION MODAL
      ===================================================== */}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Sign out of FoodAI?
                  </h3>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Your current session will end.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowLogoutModal(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={17} />
              </button>

            </div>

            <div className="px-5 py-5">

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <Avatar size="modal" />

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-slate-800">
                      {userName}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {userEmail}
                    </p>

                  </div>

                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                You can sign in again anytime using your FoodAI account.
              </p>

            </div>

            <div className="flex gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setShowLogoutModal(false)
                }
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
              >
                Sign Out
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Navbar;