import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Wand2 } from "lucide-react";

interface TemplateCardProps {
  id: number;
  type: string;
  title: string;
  preview?: string | null; // bisa null karena kamu upload manual
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  type,
  title,
  preview,
}) => {
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate(`/editor?mode=preview&id=${id}`);
  };

  const handleUse = () => {
    navigate(`/editor?id=${id}`);
  };

  return (
    <div
      className="
        rounded-2xl 
        bg-white/90 
        border border-gray-200 
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all duration-300 
        overflow-hidden 
        backdrop-blur-sm
        group
      "
    >
      {/* PREVIEW IMAGE */}
      <div className="relative aspect-square overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt={title}
            className="
              w-full h-full object-cover 
              transition-all duration-500
              group-hover:scale-110 
            "
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
            No Preview
          </div>
        )}

        {/* Hover Action Layer */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-b from-black/10 to-black/60 
            opacity-0 group-hover:opacity-100 
            transition-all duration-300 
            flex items-center justify-center gap-3
          "
        >
          <button
            onClick={handlePreview}
            className="
              flex items-center gap-2
              bg-white/90 backdrop-blur-md
              hover:bg-white 
              px-4 py-2 rounded-lg 
              shadow-md
              text-gray-800 text-sm font-medium
              opacity-0 translate-y-3 
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all
            "
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            onClick={handleUse}
            className="
              flex items-center gap-2
              bg-blue-600 hover:bg-blue-700 
              text-white px-4 py-2 rounded-lg 
              shadow-md
              text-sm font-medium
              opacity-0 translate-y-3 
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all
            "
          >
            <Wand2 className="w-4 h-4" />
            Gunakan
          </button>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="p-4">
        <span
          className="
            inline-block 
            text-xs font-semibold 
            bg-blue-50 text-blue-700 
            px-3 py-1 rounded-full 
            mb-2
            border border-blue-100
          "
        >
          {type}
        </span>

        <h3 className="font-semibold text-gray-800 text-lg leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default TemplateCard;
