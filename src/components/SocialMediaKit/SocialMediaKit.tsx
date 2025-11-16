import React, { useState } from 'react';
import { Plus, Upload, Palette, Type, Image as ImageIcon, Star, Share2, Bold } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from './TemplateCard';

const SocialMediaKit = () => {
  const navigate = useNavigate();
  const [brandAssets, setBrandAssets] = useState([
    { id: 1, name: 'Logo', type: 'image', file: null },
    { id: 2, name: 'Brand Guideline', type: 'pdf', file: null },
    { id: 3, name: 'Color Palette', type: 'color', file: null },
    { id: 4, name: 'Typography', type: 'font', file: null },
  ]);

  const templates = [
    {
      id: 1,
      type: 'Feed Post',
      title: 'Promo Product',
      preview: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    },
    {
      id: 2,
      type: 'Stories',
      title: 'Behind The Scenes',
      preview: 'https://images.pexels.com/photos/1337384/pexels-photo-1337384.jpeg',
    },
    {
      id: 3,
      type: 'Reels',
      title: 'Tutorial Quick',
      preview: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
    },
    {
      id: 4,
      type: 'Carousel',
      title: 'Tips Marketing',
      preview: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    },
  ];

  const handleUpload = (id: number, file: File) => {
    setBrandAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, file } : asset))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 md:p-12 space-y-14">
      
      {/* HEADER */}
<header className="mb-10">
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
    Social Media Kit
  </h1>
  <p className="text-gray-600 text-base md:text-lg max-w-2xl mt-2">
    Kelola aset brand dan gunakan template desain premium untuk branding yang konsisten dan profesional.
  </p>
</header>


      {/* ASSETS & BRAND GUIDELINES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BRAND ASSETS */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Aset Brand</h2>
          <div className="grid grid-cols-2 gap-4">
            {brandAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white/40 backdrop-blur-md border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center mb-3 border border-gray-200 overflow-hidden">
                  {asset.file ? (
                    asset.type === 'image' ? (
                      <img
                        src={URL.createObjectURL(asset.file)}
                        alt={asset.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-600 text-center">{asset.file.name}</span>
                    )
                  ) : (
                    <span className="text-gray-500 text-sm text-center">{asset.name}</span>
                  )}
                </div>

                <label className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium shadow hover:opacity-90">
                  <Upload className="h-3 w-3" /> Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files && handleUpload(asset.id, e.target.files[0])}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* BRAND GUIDELINES */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Panduan Brand</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Color Palette */}
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-start gap-2 hover:shadow-lg transition">
              <div className="flex items-center gap-1">
                <Palette className="h-5 w-5 text-orange-500" />
                <h3 className="font-medium text-gray-800 text-sm">Color Palette</h3>
              </div>
              <div className="flex gap-2 mt-1">
                <div className="w-6 h-6 rounded-md bg-orange-500 shadow" />
                <div className="w-6 h-6 rounded-md bg-white border shadow" />
                <div className="w-6 h-6 rounded-md bg-black shadow" />
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-start gap-1 hover:shadow-lg transition">
              <div className="flex items-center gap-1">
                <Type className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-gray-800 text-sm">Typography</h3>
              </div>
              <p className="text-gray-900 font-semibold text-sm">Inter Bold</p>
              <p className="text-gray-600 italic text-xs">Inter Regular</p>
            </div>

            {/* Logo Usage */}
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
              <ImageIcon className="h-5 w-5 text-green-600 mb-1" />
              <p className="font-medium text-gray-800 text-sm mb-1">Logo Usage</p>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
                className="h-16 object-contain mb-1"
              />
              <p className="text-xs text-gray-500 text-center">
                Gunakan logo dengan background putih atau transparan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Template Desain</h2>
          <button
            onClick={() => navigate('/editor')}
            className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Create Your Own
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              {...template}
              onUseTemplate={() => navigate(`/editor/${template.id}`)}
              onPreviewTemplate={() => window.open(template.preview, '_blank')}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SocialMediaKit;
