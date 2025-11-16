import React, { useState } from "react";

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
    updates: true,
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("id");
  const [integrations, setIntegrations] = useState({
    instagram: true,
    facebook: false,
    tiktok: true,
    linkedin: false,
  });

  const toggleIntegration = (platform: keyof typeof integrations) => {
    setIntegrations((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* =============================== */}
        {/*   SECTION: PLATFORM INTEGRATION */}
        {/* =============================== */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">
            Integrasi Platform
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(integrations).map(([platform, connected]) => (
              <div
                key={platform}
                className="group p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-semibold mx-auto mb-4 shadow-md ${
                    platform === "instagram"
                      ? "bg-gradient-to-br from-pink-400 to-pink-600"
                    : platform === "facebook"
                      ? "bg-blue-600"
                    : platform === "tiktok"
                      ? "bg-black"
                    : "bg-blue-700"
                  }`}
                >
                  {platform.substring(0, 2).toUpperCase()}
                </div>

                <p className="capitalize text-center font-medium text-gray-900 mb-3">
                  {platform}
                </p>

                <button
                  onClick={() => toggleIntegration(platform as keyof typeof integrations)}
                  className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
                    connected
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* =============================== */}
        {/*   GRID: NOTIFIKASI + TAMPILAN   */}
        {/* =============================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Notifications */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Notifikasi
            </h2>

            {Object.keys(notifications).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between py-3 border-b last:border-none"
              >
                <span className="capitalize text-gray-700">
                  {key === "email"
                    ? "Email Notifications"
                    : key === "push"
                    ? "Push Notifications"
                    : key === "marketing"
                    ? "Marketing Updates"
                    : "Product Updates"}
                </span>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [key]: !prev[key as keyof typeof notifications],
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full p-1 flex items-center transition-all ${
                      notifications[key as keyof typeof notifications]
                        ? "bg-orange-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow transform transition-all ${
                        notifications[key as keyof typeof notifications]
                          ? "translate-x-5"
                          : ""
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Theme & Language */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Tampilan
            </h2>

            {/* Theme */}
            <div className="mb-6">
              <p className="font-medium text-gray-800 mb-2">Theme</p>
              <div className="space-y-3">
                {["light", "dark", "system"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={opt}
                      checked={theme === opt}
                      onChange={() => setTheme(opt)}
                    />
                    <span className="capitalize text-gray-700">
                      {opt === "light"
                        ? "Light Mode"
                        : opt === "dark"
                        ? "Dark Mode"
                        : "System Default"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <p className="font-medium text-gray-800 mb-2">Language</p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* =============================== */}
        {/*   GRID: PRIVACY + ACCOUNT ACTION */}
        {/* =============================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Privasi */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Privasi & Keamanan
            </h2>

            <div className="p-4 rounded-xl bg-green-50 border border-green-300">
              <p className="text-sm font-medium text-green-700">
                Two-Factor Authentication Aktif
              </p>
              <button className="mt-2 px-4 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-all">
                Kelola 2FA
              </button>
            </div>

            <button className="w-full py-2.5 rounded-xl border text-orange-600 border-orange-400 hover:bg-orange-50 transition-all">
              Ubah Password
            </button>

            <button className="w-full py-2.5 rounded-xl border text-orange-600 border-orange-400 hover:bg-orange-50 transition-all">
              Sesi Aktif
            </button>

            <button className="w-full py-2.5 rounded-xl border text-orange-600 border-orange-400 hover:bg-orange-50 transition-all">
              Download Data
            </button>
          </div>

          {/* Aksi Akun */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Aksi Akun
            </h2>

            <div className="p-4 border rounded-xl bg-yellow-50">
              <p className="font-medium text-yellow-800">Export Data</p>
              <button className="mt-2 px-4 py-1.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all">
                Export
              </button>
            </div>

            <div className="p-4 border rounded-xl bg-red-50">
              <p className="font-medium text-red-800">Hapus Akun</p>
              <button className="mt-2 px-4 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all">
                Hapus Akun
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
