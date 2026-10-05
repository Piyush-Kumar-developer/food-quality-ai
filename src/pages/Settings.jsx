import { useEffect, useRef, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  ShieldCheck,
  SlidersHorizontal,
  Moon,
  Globe,
  Camera,
  Save,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Cpu,
  Database,
  Wifi,
  Activity,
  Info,
  ScanLine,
  Mail,
  KeyRound,
  Eye,
  BarChart3,
  Check,
  Lock,
  Trash2,
} from "lucide-react";

function Settings() {
  const [activeTab, setActiveTab] = useState("General");

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [generalSaved, setGeneralSaved] = useState(false);

  const [displayName, setDisplayName] = useState("User");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const photoInputRef = useRef(null);

  const [notifications, setNotifications] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const [confidenceInfo, setConfidenceInfo] = useState(true);
  const [visualAnalysis, setVisualAnalysis] = useState(true);

  const loadUser = () => {
    const storedUser =
      localStorage.getItem("foodai_user") ||
      sessionStorage.getItem("foodai_user");

    if (!storedUser) {
      setDisplayName("User");
      setProfileEmail("");
      setProfilePhoto("");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      setDisplayName(user?.name || "User");
      setProfileEmail(user?.email || "");
      setProfilePhoto(user?.profilePhoto || "");
    } catch (error) {
      console.error("Unable to load user:", error);
      setDisplayName("User");
      setProfileEmail("");
      setProfilePhoto("");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener("foodai-user-updated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate);

    return () => {
      window.removeEventListener("foodai-user-updated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfilePhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleProfileSave = () => {
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setDisplayName("User");
      return;
    }

    let saved = false;

    [localStorage, sessionStorage].forEach((storage) => {
      const storedUser = storage.getItem("foodai_user");

      if (!storedUser) return;

      try {
        const parsedUser = JSON.parse(storedUser);

        const updatedUser = {
          ...parsedUser,
          name: trimmedName,
          profilePhoto: profilePhoto || "",
        };

        storage.setItem(
          "foodai_user",
          JSON.stringify(updatedUser)
        );

        saved = true;
      } catch (error) {
        console.error("Unable to save profile:", error);
      }
    });

    if (!saved) return;

    window.dispatchEvent(new Event("foodai-user-updated"));

    setProfileSaved(true);

    setTimeout(() => {
      setProfileSaved(false);
    }, 2500);
  };

  const Toggle = ({ enabled, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 ${
        enabled ? "bg-slate-950" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
    iconClass = "bg-slate-100 text-slate-700",
  }) => (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={19} />
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-950">
          {title}
        </h2>

        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );

  const SettingRow = ({
    icon: Icon,
    title,
    description,
    control,
  }) => (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="hidden h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 sm:flex">
            <Icon size={15} />
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {control}
    </div>
  );

  const StatusCard = ({
    icon: Icon,
    title,
    status,
  }) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <Icon size={18} className="text-slate-500" />
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      </div>

      <p className="mt-3 text-sm font-bold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-[11px] font-semibold text-emerald-600">
        {status}
      </p>
    </div>
  );

  const GeneralSection = () => (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <SectionHeader
          icon={SettingsIcon}
          title="General Settings"
          description="Manage your basic FoodAI workspace preferences."
        />

        <div className="mt-7 space-y-4">
          <div className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Globe size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Language
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Choose your preferred interface language.
                </p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Moon size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Dark Mode
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Enable a darker interface.
                </p>
              </div>
            </div>

            <Toggle
              enabled={darkMode}
              onClick={() => setDarkMode(!darkMode)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <SectionHeader
          icon={Activity}
          title="Workspace"
          description="Current FoodAI workspace information."
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatusCard
            icon={Cpu}
            title="AI Engine"
            status="Operational"
          />

          <StatusCard
            icon={Database}
            title="Database"
            status="Connected"
          />

          <StatusCard
            icon={Wifi}
            title="API"
            status="Connected"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Sparkles size={19} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              About FoodAI
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              FoodAI is an AI-powered food recognition and visible
              quality analysis platform.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                AI Powered
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                System Online
              </span>

              <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold text-violet-700">
                Version 1.0
              </span>
            </div>
          </div>
        </div>
      </section>

      <SaveBar
        saved={generalSaved}
        onSave={() => {
          setGeneralSaved(true);
          setTimeout(() => setGeneralSaved(false), 2500);
        }}
        text="Save your general FoodAI preferences."
      />
    </div>
  );

  const ProfileSection = () => {
    const initial =
      displayName?.trim()?.charAt(0)?.toUpperCase() || "U";

    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <SectionHeader
            icon={User}
            title="Profile"
            description="Manage your FoodAI account information."
          />

          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-950 text-3xl font-bold text-white shadow-sm">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-white bg-slate-950 text-white shadow-md transition hover:bg-slate-800"
                title="Change profile photo"
              >
                <Camera size={15} />
              </button>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <p className="text-xl font-bold text-slate-950">
                {displayName || "User"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Food Analyst
              </p>

              {profileEmail && (
                <p className="mt-1 text-xs text-slate-400">
                  {profileEmail}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                  Account Active
                </span>

                <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold text-violet-700">
                  AI Enabled
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Camera size={15} />
              Change Photo
            </button>
          </div>

          {profilePhoto && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-semibold text-emerald-700">
                Profile photo selected
              </p>

              <button
                type="button"
                onClick={() => {
                  setProfilePhoto("");

                  if (photoInputRef.current) {
                    photoInputRef.current.value = "";
                  }
                }}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <SectionHeader
            icon={User}
            title="Account Details"
            description="Update the information displayed on your FoodAI workspace."
          />

          <div className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Display Name
              </label>

              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Email
              </label>

              <input
                type="email"
                value={profileEmail}
                disabled
                readOnly
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-sm text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Role
              </label>

              <input
                type="text"
                value="Food Analyst"
                disabled
                readOnly
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-sm text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Workspace
              </label>

              <input
                type="text"
                value="FoodAI Standard Workspace"
                disabled
                readOnly
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-sm text-slate-500 outline-none"
              />
            </div>
          </div>
        </section>

        <SaveBar
          saved={profileSaved}
          onSave={handleProfileSave}
          text="Update your FoodAI profile information."
        />
      </div>
    );
  };

  const NotificationsSection = () => (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="Control alerts and product notifications."
          iconClass="bg-blue-50 text-blue-600"
        />

        <div className="mt-7 divide-y divide-slate-100">
          <SettingRow
            icon={Bell}
            title="Product Notifications"
            description="Receive updates about FoodAI features and improvements."
            control={
              <Toggle
                enabled={notifications}
                onClick={() => setNotifications(!notifications)}
              />
            }
          />

          <SettingRow
            icon={Sparkles}
            title="AI Analysis Alerts"
            description="Get alerts when FoodAI detects potential quality concerns."
            control={
              <Toggle
                enabled={aiAlerts}
                onClick={() => setAiAlerts(!aiAlerts)}
              />
            }
          />

          <SettingRow
            icon={Mail}
            title="Email Updates"
            description="Receive important account-related emails."
            control={
              <Toggle
                enabled={emailUpdates}
                onClick={() => setEmailUpdates(!emailUpdates)}
              />
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
        <div className="flex items-start gap-3">
          <Info size={18} className="mt-0.5 text-blue-600" />

          <div>
            <p className="text-sm font-bold text-blue-900">
              Notification Preferences
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Your selected notification preferences will be used by
              the FoodAI workspace.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const PrivacySection = () => (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <SectionHeader
          icon={ShieldCheck}
          title="Privacy & Security"
          description="Manage your account security preferences."
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={() => alert("Password management can be connected here.")}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
          >
            <KeyRound size={18} className="text-slate-500" />

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                Change Password
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Update your account password.
              </p>
            </div>

            <ChevronRight size={17} className="text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => alert("Security settings can be connected here.")}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
          >
            <Lock size={18} className="text-slate-500" />

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                Security Settings
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Review your account security configuration.
              </p>
            </div>

            <ChevronRight size={17} className="text-slate-400" />
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <div>
            <p className="text-sm font-bold text-emerald-900">
              Account Security
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Your current FoodAI session is protected.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const AIPreferencesSection = () => (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <SectionHeader
          icon={Sparkles}
          title="AI Preferences"
          description="Configure how FoodAI communicates analysis results."
          iconClass="bg-violet-50 text-violet-600"
        />

        <div className="mt-7 divide-y divide-slate-100">
          <SettingRow
            icon={Sparkles}
            title="AI Analysis Alerts"
            description="Show important alerts when FoodAI detects potential quality concerns."
            control={
              <Toggle
                enabled={aiAlerts}
                onClick={() => setAiAlerts(!aiAlerts)}
              />
            }
          />

          <SettingRow
            icon={BarChart3}
            title="Confidence Information"
            description="Display AI confidence scores with food analysis results."
            control={
              <Toggle
                enabled={confidenceInfo}
                onClick={() => setConfidenceInfo(!confidenceInfo)}
              />
            }
          />

          <SettingRow
            icon={Eye}
            title="Visual Analysis Mode"
            description="Use visual characteristics such as color, texture and appearance."
            control={
              <Toggle
                enabled={visualAnalysis}
                onClick={() => setVisualAnalysis(!visualAnalysis)}
              />
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/50 p-6">
        <div className="flex items-start gap-3">
          <Sparkles
            size={19}
            className="mt-0.5 shrink-0 text-violet-600"
          />

          <div>
            <p className="text-sm font-bold text-violet-900">
              FoodAI Analysis Engine
            </p>

            <p className="mt-1 text-xs leading-5 text-violet-700">
              FoodAI uses machine learning models to recognize supported
              food categories and analyze visible quality characteristics.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-emerald-700">
                AI Engine Operational
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <SectionHeader
          icon={Activity}
          title="Model Services"
          description="Current FoodAI AI service status."
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatusCard
            icon={Cpu}
            title="Recognition"
            status="Operational"
          />

          <StatusCard
            icon={Sparkles}
            title="Quality Model"
            status="Operational"
          />

          <StatusCard
            icon={Database}
            title="MongoDB"
            status="Connected"
          />
        </div>
      </section>
    </div>
  );

  const SaveBar = ({ saved, onSave, text }) => (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        {saved ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <CheckCircle2 size={17} />
            Changes saved successfully
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Save size={15} className="text-slate-400" />

            <p className="text-xs text-slate-500">
              {text}
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
      >
        <Save size={16} />
        Save Changes
      </button>
    </div>
  );

  const renderContent = () => {
    if (activeTab === "General") return <GeneralSection />;
    if (activeTab === "Profile") return <ProfileSection />;
    if (activeTab === "Notifications") return <NotificationsSection />;
    if (activeTab === "Privacy") return <PrivacySection />;
    if (activeTab === "AI Preferences") return <AIPreferencesSection />;

    return <GeneralSection />;
  };

  const menuItems = [
    { name: "General", icon: SettingsIcon },
    { name: "Profile", icon: User },
    { name: "Notifications", icon: Bell },
    { name: "Privacy", icon: ShieldCheck },
    { name: "AI Preferences", icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                <SettingsIcon size={21} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    Settings
                  </h1>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                    {activeTab}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your FoodAI preferences and account settings.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-emerald-700">
                System Online
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:sticky lg:top-6">
            <div className="mb-2 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Settings
              </p>
            </div>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.name);
                      setGeneralSaved(false);
                      setProfileSaved(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm transition-all ${
                      active
                        ? "bg-slate-950 font-semibold text-white shadow-sm"
                        : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <Icon size={17} />
                    {item.name}

                    {active && (
                      <Check size={14} className="ml-auto opacity-80" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="my-3 border-t border-slate-100" />

            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-violet-600" />

                <span className="text-xs font-bold text-slate-700">
                  FoodAI Engine
                </span>
              </div>

              <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                AI analysis services are currently available.
              </p>

              <div className="mt-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[10px] font-semibold text-emerald-600">
                  Operational
                </span>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                FoodAI Workspace
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                {activeTab}
              </h2>
            </div>

            {renderContent()}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <ScanLine size={14} className="text-slate-400" />

            <p className="text-xs font-semibold text-slate-500">
              FoodAI
            </p>
          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            AI-powered food quality intelligence • v1.0
          </p>
        </div>
      </main>
    </div>
  );
}

export default Settings;