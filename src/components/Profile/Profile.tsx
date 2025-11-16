import React, { useState } from "react";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "Sari Makmur",
    email: "sari.makmur@email.com",
    phone: "+62 812-3456-7890",
    businessName: "Toko Kue Sari",
    address:
      "Jl. Mawar Indah No. 123, Kelurahan Bunga, Kecamatan Indah, Jakarta Selatan",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ======================= */}
        {/*        PROFILE CARD      */}
        {/* ======================= */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Informasi Profil
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 transition-all"
            >
              {isEditing ? "Batal" : "Edit Profil"}
            </button>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {profile.name}
              </h3>
              <p className="text-gray-500 text-sm">
                Pemilik {profile.businessName}
              </p>
              <p className="text-gray-500 text-sm">
                {profile.email} • {profile.phone}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  disabled={!isEditing}
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  disabled={!isEditing}
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  No. Telepon
                </label>
                <input
                  type="text"
                  name="phone"
                  disabled={!isEditing}
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nama Bisnis
                </label>
                <input
                  type="text"
                  name="businessName"
                  disabled={!isEditing}
                  value={profile.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>

            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Alamat
              </label>
              <textarea
                name="address"
                disabled={!isEditing}
                value={profile.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>

            {isEditing && (
              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium shadow-md hover:bg-orange-700 transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ======================= */}
        {/*      RIGHT SIDEBAR      */}
        {/* ======================= */}
        <div className="space-y-8">

          {/* Statistik */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Statistik Bisnis
            </h2>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex justify-between">
                <span>Total Followers</span>
                <span className="font-semibold text-gray-900">13.8K</span>
              </li>
              <li className="flex justify-between">
                <span>Posts Published</span>
                <span className="font-semibold text-gray-900">156</span>
              </li>
              <li className="flex justify-between">
                <span>Engagement Rate</span>
                <span className="font-semibold text-gray-900">8.7%</span>
              </li>
              <li className="flex justify-between">
                <span>Member Since</span>
                <span className="font-semibold text-gray-900">Jan 2024</span>
              </li>
            </ul>
          </div>

          {/* Subscription */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-xl border border-orange-100 p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Subscription
            </h2>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl mb-3">
                🔥
              </div>

              <p className="font-semibold text-gray-900">Premium Plan</p>
              <p className="text-sm text-gray-500">Berlaku hingga 15 Jan 2025</p>

              <button className="mt-4 px-5 py-2 bg-orange-600 text-white rounded-lg font-medium shadow-md hover:bg-orange-700 transition-all">
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Kontak Info
            </h2>

            <ul className="space-y-3 text-sm text-gray-700">
              <li>📍 Jakarta Selatan, Indonesia</li>
              <li>🏷️ Makanan & Minuman</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
