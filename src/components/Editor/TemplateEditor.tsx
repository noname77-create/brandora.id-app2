import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import {
  Save,
  Download,
  ArrowLeft,
  Type,
  Image,
  Square,
  Layers,
  Palette,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Cloud,
  Check,
} from "lucide-react";

/**
 * PremiumTemplateEditor.tsx
 * - Tailwind-based UI
 * - TypeScript
 * - Lightweight DOM drag / resize implementation
 *
 * Note: For production-level editor, replace drag/resize with libraries:
 * react-rnd / interactjs / fabric.js for robust behavior.
 */

/* ---------- Types ---------- */
type BaseLayer = {
  id: number;
  type: "text" | "image" | "shape" | "background";
  x: number;
  y: number;
  z: number;
};

type TextLayer = BaseLayer & {
  type: "text";
  content: string;
  fontSize: number;
  color: string;
  fontWeight?: "normal" | "bold";
  width?: number;
};

type ImageLayer = BaseLayer & {
  type: "image";
  src: string | null;
  width: number;
  height: number;
  objectUrl?: string; // keep for revoking
};

type ShapeLayer = BaseLayer & {
  type: "shape";
  shape: "rect" | "circle";
  width: number;
  height: number;
  color: string;
};

type BackgroundLayer = BaseLayer & {
  type: "background";
  color: string;
};

type Layer = TextLayer | ImageLayer | ShapeLayer | BackgroundLayer;

/* ---------- Helpers ---------- */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const nextId = () => Date.now() + Math.floor(Math.random() * 999);

/* ---------- Component ---------- */
const PremiumTemplateEditor: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();

  // canvas ref
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // main state
  const [layers, setLayers] = useState<Layer[]>(() => {
    // default canvas background + sample text layers
    return [
      { id: 1, type: "background", x: 0, y: 0, z: 0, color: "#ffffff" } as BackgroundLayer,
      {
        id: 2,
        type: "text",
        content: "Your Title Here",
        x: 60,
        y: 80,
        fontSize: 40,
        color: "#0f172a",
        fontWeight: "bold",
        z: 2,
      } as TextLayer,
      {
        id: 3,
        type: "text",
        content: "Subtitle or short description",
        x: 60,
        y: 140,
        fontSize: 16,
        color: "#475569",
        z: 3,
      } as TextLayer,
    ];
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(100); // percent
  const [history, setHistory] = useState<Layer[][]>([]);
  const futureRef = useRef<Layer[][]>([]);
  const dragRef = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);
  const resizeRef = useRef<{ id: number; startW: number; startH: number; startMouseX: number; startMouseY: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  /* ---------- Sidebar hide pattern ----------
     add/remove a class to body so global sidebar can be hidden
  */
  useEffect(() => {
    document.body.classList.add("editor-open-hide-global-sidebar");
    return () => {
      document.body.classList.remove("editor-open-hide-global-sidebar");
    };
  }, []);

  /* ---------- Autosave every 5s ---------- */
  useEffect(() => {
    const t = setInterval(() => {
      localStorage.setItem("premium_editor_autosave", JSON.stringify(layers));
    }, 5000);
    return () => clearInterval(t);
  }, [layers]);

  /* ---------- Load autosave on mount ---------- */
  useEffect(() => {
    const raw = localStorage.getItem("premium_editor_autosave");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Layer[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLayers(parsed);
        }
      } catch (e) {
        // ignore
      }
    }
    // push first snapshot
    setHistory((h) => [...h, JSON.parse(JSON.stringify(layers))]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  /* ---------- History helpers ---------- */
  const pushHistory = (nextLayers: Layer[]) => {
    setHistory((h) => {
      const newH = [...h, JSON.parse(JSON.stringify(nextLayers))];
      // limit to 60 states
      return newH.slice(-60);
    });
    futureRef.current = [];
  };

  const undo = () => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const last = h[h.length - 1];
      futureRef.current.push(JSON.parse(JSON.stringify(last)));
      const prev = h[h.length - 2];
      setLayers(JSON.parse(JSON.stringify(prev)));
      return h.slice(0, -1);
    });
  };

  const redo = () => {
    const next = futureRef.current.pop();
    if (!next) return;
    setLayers(JSON.parse(JSON.stringify(next)));
    setHistory((h) => [...h, JSON.parse(JSON.stringify(next))]);
  };

  /* ---------- Layer operations ---------- */
  const addText = (content = "New Text") => {
    const id = nextId();
    const newLayer: TextLayer = {
      id,
      type: "text",
      content,
      x: 80,
      y: 80,
      z: layers.length + 1,
      fontSize: 20,
      color: "#0f172a",
    };
    const next = [...layers, newLayer];
    setLayers(next);
    pushHistory(next);
    setSelectedId(id);
  };

  const addImage = (file?: File) => {
    const id = nextId();
    const objectUrl = file ? URL.createObjectURL(file) : null;
    const newLayer: ImageLayer = {
      id,
      type: "image",
      src: objectUrl ?? "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      x: 120,
      y: 180,
      width: 260,
      height: 160,
      z: layers.length + 1,
      objectUrl: objectUrl ?? undefined,
    };
    const next = [...layers, newLayer];
    setLayers(next);
    pushHistory(next);
    setSelectedId(id);
  };

  const addShape = (shape: "rect" | "circle") => {
    const id = nextId();
    const newLayer: ShapeLayer = {
      id,
      type: "shape",
      shape,
      x: 100,
      y: 220,
      width: 260,
      height: 120,
      color: "#f1f5f9",
      z: layers.length + 1,
    };
    const next = [...layers, newLayer];
    setLayers(next);
    pushHistory(next);
    setSelectedId(id);
  };

  const duplicateLayer = (id: number) => {
    const src = layers.find((l) => l.id === id);
    if (!src) return;
    const clone = JSON.parse(JSON.stringify(src)) as Layer;
    clone.id = nextId();
    clone.x += 16;
    clone.y += 16;
    clone.z = layers.length + 1;
    // if image with objectUrl, create new object url? we can reuse src — objectUrl is only for revoking
    if ((clone as any).objectUrl) {
      (clone as any).objectUrl = (clone as any).objectUrl; // keep same
    }
    const next = [...layers, clone];
    setLayers(next);
    pushHistory(next);
    setSelectedId(clone.id);
  };

  const deleteLayer = (id: number) => {
    const layer = layers.find((l) => l.id === id);
    // revoke object URL if any
    if (layer && layer.type === "image" && (layer as ImageLayer).objectUrl) {
      try {
        URL.revokeObjectURL((layer as ImageLayer).objectUrl!);
      } catch (e) {}
    }
    const next = layers.filter((l) => l.id !== id);
    setLayers(next);
    pushHistory(next);
    setSelectedId(null);
  };

  const bringForward = (id: number) => {
    const sorted = [...layers].sort((a, b) => (a.z || 0) - (b.z || 0));
    const idx = sorted.findIndex((s) => s.id === id);
    if (idx === -1 || idx === sorted.length - 1) return;
    [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]];
    sorted.forEach((s, i) => (s.z = i));
    setLayers(sorted);
    pushHistory(sorted);
  };

  const sendBackward = (id: number) => {
    const sorted = [...layers].sort((a, b) => (a.z || 0) - (b.z || 0));
    const idx = sorted.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    [sorted[idx], sorted[idx - 1]] = [sorted[idx - 1], sorted[idx]];
    sorted.forEach((s, i) => (s.z = i));
    setLayers(sorted);
    pushHistory(sorted);
  };

  const updateLayer = (id: number, patch: Partial<Layer>) => {
    const next = layers.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l));
    setLayers(next);
  };

  /* ---------- Drag & Resize logic ---------- */
  const onMouseDownLayer = (e: React.MouseEvent, layer: Layer) => {
    e.stopPropagation();
    setSelectedId(layer.id);
    const rect = canvasRef.current!.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / (zoom / 100) - layer.x;
    const offsetY = (e.clientY - rect.top) / (zoom / 100) - layer.y;
    dragRef.current = { id: layer.id, offsetX, offsetY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragRef.current) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const id = dragRef.current.id;
      const x = clamp(Math.round(((e.clientX - rect.left) / (zoom / 100) - dragRef.current!.offsetX)), 0, 2000);
      const y = clamp(Math.round(((e.clientY - rect.top) / (zoom / 100) - dragRef.current!.offsetY)), 0, 2000);
      setLayers((prev) => prev.map((l) => (l.id === id ? ({ ...l, x, y } as Layer) : l)));
    }
    if (resizeRef.current) {
      const r = resizeRef.current;
      const rect = canvasRef.current!.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / (zoom / 100);
      const my = (e.clientY - rect.top) / (zoom / 100);
      const nw = clamp(Math.round(mx - r.startMouseX + r.startW), 20, 2000);
      const nh = clamp(Math.round(my - r.startMouseY + r.startH), 20, 2000);
      setLayers((prev) => prev.map((l) => (l.id === r.id ? ({ ...l, width: nw, height: nh } as any) : l)));
    }
  };

  const onMouseUp = () => {
    if (dragRef.current || resizeRef.current) {
      pushHistory(layers);
    }
    dragRef.current = null;
    resizeRef.current = null;
  };

  /* ---------- File pick ---------- */
  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    addImage(f);
    e.currentTarget.value = ""; // reset
  };

  /* ---------- AI quick generate (very lightweight) ---------- */
  const aiQuickGenerate = () => {
    // pick first text layer as base
    const t = layers.find((l) => l.type === "text") as TextLayer | undefined;
    const base = t ? t.content : "Produk Baru";
    const title = `${base} - Special Promo`;
    const caption = `Jangan lewatkan ${base} dengan diskon terbatas. Klik sekarang!`;
    addText(title);
    addText(caption);
    // return palette suggestion
    return ["#FEF3C7", "#FDBA74", "#FB923C"];
  };

  /* ---------- Save (persist & redirect) ---------- */
  const handleSave = async () => {
    // simple localStorage save; in production: POST to server
    const key = `template_${templateId ?? "new"}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(layers));
    // show snackbar then redirect
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
    setTimeout(() => navigate("/social-media-kit"), 900);
  };

  /* ---------- Export PNG using html2canvas ---------- */
  const handleDownload = async () => {
    if (!canvasRef.current) {
      alert("Canvas not ready");
      return;
    }
    try {
      // temporarily scale to 1:1 for accurate export
      const el = canvasRef.current;
      const previousTransform = el.style.transform;
      // clear transform for export, compute natural scale factor
      el.style.transform = "scale(1)";
      // use html2canvas
      const canvas = await html2canvas(el, { backgroundColor: "#fff", scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `design-${Date.now()}.png`;
      a.click();
      // restore transform
      el.style.transform = previousTransform;
    } catch (err) {
      console.error(err);
      alert("Export failed — lihat console untuk detail.");
    }
  };

  /* ---------- Keyboard shortcuts ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        selectedId && duplicateLayer(selectedId);
      } else if (e.key === "Delete" && selectedId) {
        e.preventDefault();
        deleteLayer(selectedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, layers]);

  /* ---------- Render ---------- */
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/social-media-kit")}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>

          <div>
            <div className="text-lg font-semibold text-slate-900">{templateId ? `Template ${templateId}` : "New Design"}</div>
            <div className="text-xs text-slate-500">Premium Editor — drag, resize, autosave</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border rounded-full px-3 py-1 gap-2">
            <button onClick={undo} className="p-1 hover:bg-gray-100 rounded">
              <Undo className="h-4 w-4" />
            </button>
            <button onClick={redo} className="p-1 hover:bg-gray-100 rounded">
              <Redo className="h-4 w-4" />
            </button>
            <div className="border-l h-5" />
            <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="p-1 hover:bg-gray-100 rounded"><ZoomIn className="h-4 w-4" /></button>
            <span className="text-sm px-2">{zoom}%</span>
            <button onClick={() => setZoom((z) => Math.max(25, z - 10))} className="p-1 hover:bg-gray-100 rounded"><ZoomOut className="h-4 w-4" /></button>
          </div>

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFilePick} />

          <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-white border rounded-xl hover:shadow-sm flex items-center gap-2 text-sm">
            <Image className="h-4 w-4" /> Add Image
          </button>

          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:opacity-95 flex items-center gap-2">
            <Save className="h-4 w-4" /> Save
          </button>

          <button onClick={handleDownload} className="px-4 py-2 bg-white border rounded-xl hover:shadow-sm flex items-center gap-2">
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT TOOLBAR */}
        <aside className="w-24 bg-white border-r border-gray-200 p-4 flex flex-col items-center gap-3 shadow-inner">
          <button onClick={() => addText()} title="Add text" className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center hover:scale-105 transition">
            <Type className="h-5 w-5 text-slate-700" />
          </button>

          <button onClick={() => fileInputRef.current?.click()} title="Add image" className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center hover:scale-105 transition">
            <Image className="h-5 w-5 text-slate-700" />
          </button>

          <button onClick={() => addShape("rect")} title="Add rectangle" className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center hover:scale-105 transition">
            <Square className="h-5 w-5 text-slate-700" />
          </button>

          <button onClick={() => addShape("circle")} title="Add circle" className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center hover:scale-105 transition">
            <Palette className="h-5 w-5 text-slate-700" />
          </button>

          <div className="mt-3 w-full border-t" />

          <button onClick={() => { aiQuickGenerate(); }} title="AI Quick" className="w-full mt-2 px-3 py-2 rounded-lg bg-gradient-to-br from-rose-500 to-orange-400 text-white text-sm shadow">
            <Cloud className="inline-block mr-2 h-4 w-4" /> AI Quick
          </button>

          <div className="mt-auto" />

          <button onClick={() => selectedId && duplicateLayer(selectedId)} title="Duplicate" className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center hover:scale-105 transition">
            <Copy className="h-5 w-5 text-slate-700" />
          </button>

          <button onClick={() => selectedId && deleteLayer(selectedId)} title="Delete" className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center hover:scale-105 transition">
            <Trash2 className="h-5 w-5 text-red-600" />
          </button>
        </aside>

        {/* CANVAS */}
        <main className="flex-1 p-8 overflow-auto flex items-center justify-center" onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <div className="bg-slate-100 p-6 rounded-2xl">
            <div
              ref={canvasRef}
              className="relative bg-white rounded-lg border border-gray-200 shadow-md"
              style={{
                width: 820,
                height: 820,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "left top",
              }}
              onMouseDown={() => setSelectedId(null)}
            >
              {/* grid background */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#f8fafc, #f8fafc 24px, #f1f5f9 24px, #f1f5f9 25px)] rounded-lg" />

              {/* render sorted layers */}
              {layers
                .slice()
                .sort((a, b) => (a.z || 0) - (b.z || 0))
                .map((layer) => {
                  const baseStyle: React.CSSProperties = {
                    position: "absolute",
                    left: layer.x,
                    top: layer.y,
                    zIndex: layer.z || 0,
                    cursor: "move",
                    userSelect: "none",
                  };

                  if (layer.type === "background") {
                    const bg = layer as BackgroundLayer;
                    return <div key={layer.id} style={{ ...baseStyle, left: 0, top: 0, width: "100%", height: "100%", background: bg.color }} />;
                  }

                  if (layer.type === "text") {
                    const t = layer as TextLayer;
                    return (
                      <div key={layer.id} style={baseStyle} onMouseDown={(e) => onMouseDownLayer(e, layer)} onClick={(e) => { e.stopPropagation(); setSelectedId(layer.id); }}>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) => {
                            const v = (e.target as HTMLDivElement).innerText;
                            setLayers((prev) => prev.map((p) => (p.id === layer.id ? ({ ...(p as TextLayer), content: v } as Layer) : p)));
                          }}
                          style={{ fontSize: t.fontSize, color: t.color, fontWeight: t.fontWeight || "normal", minWidth: 40 }}
                          className={`${selectedId === layer.id ? "ring-2 ring-indigo-300 rounded-sm px-1" : "px-1"}`}
                        >
                          {t.content}
                        </div>

                        {/* selection controls */}
                        {selectedId === layer.id && (
                          <div className="absolute right-0 -bottom-7 flex gap-2">
                            <button onClick={() => duplicateLayer(layer.id)} className="bg-white px-2 py-1 rounded shadow-sm text-xs">Duplicate</button>
                            <button onClick={() => bringForward(layer.id)} className="bg-white px-2 py-1 rounded shadow-sm text-xs">Bring +</button>
                            <button onClick={() => sendBackward(layer.id)} className="bg-white px-2 py-1 rounded shadow-sm text-xs">Send -</button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (layer.type === "image") {
                    const im = layer as ImageLayer;
                    return (
                      <div key={layer.id} style={baseStyle} onMouseDown={(e) => onMouseDownLayer(e, layer)} onClick={(e) => { e.stopPropagation(); setSelectedId(layer.id); }}>
                        <img src={im.src ?? ""} alt="" style={{ width: im.width, height: im.height, objectFit: "cover", borderRadius: 8 }} className={selectedId === layer.id ? "ring-2 ring-indigo-300" : ""} />
                        {/* resize handle */}
                        {selectedId === layer.id && (
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const rect = canvasRef.current!.getBoundingClientRect();
                              resizeRef.current = { id: layer.id, startW: im.width, startH: im.height, startMouseX: (e.clientX - rect.left) / (zoom / 100), startMouseY: (e.clientY - rect.top) / (zoom / 100) };
                            }}
                            className="w-4 h-4 bg-white border border-gray-300 absolute"
                            style={{ right: -8, bottom: -8, cursor: "nwse-resize" }}
                          />
                        )}
                      </div>
                    );
                  }

                  if (layer.type === "shape") {
                    const s = layer as ShapeLayer;
                    return (
                      <div key={layer.id} style={baseStyle} onMouseDown={(e) => onMouseDownLayer(e, layer)} onClick={(e) => { e.stopPropagation(); setSelectedId(layer.id); }}>
                        <div style={{ width: s.width, height: s.height, background: s.color, borderRadius: s.shape === "rect" ? 12 : "9999px" }} className={selectedId === layer.id ? "ring-2 ring-indigo-300" : ""} />
                        {selectedId === layer.id && (
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const rect = canvasRef.current!.getBoundingClientRect();
                              resizeRef.current = { id: layer.id, startW: s.width, startH: s.height, startMouseX: (e.clientX - rect.left) / (zoom / 100), startMouseY: (e.clientY - rect.top) / (zoom / 100) };
                            }}
                            className="w-4 h-4 bg-white border border-gray-300 absolute"
                            style={{ right: -8, bottom: -8, cursor: "nwse-resize" }}
                          />
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
            </div>
          </div>
        </main>

        {/* RIGHT PROPERTIES */}
        <aside className="w-80 bg-white border-l border-gray-200 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Properties</h3>
            <div className="text-xs text-slate-500">Selected: {selectedId ?? "—"}</div>
          </div>

          {selectedId ? (
            (() => {
              const sel = layers.find((l) => l.id === selectedId) as Layer | undefined;
              if (!sel) return <div className="text-sm text-slate-500">Layer not found</div>;

              if (sel.type === "text") {
                const t = sel as TextLayer;
                return (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Text</label>
                    <input value={t.content} onChange={(e) => updateLayer(t.id, { ...t, content: e.target.value } as any)} className="w-full border rounded px-3 py-2" />
                    <label className="text-sm font-medium">Font Size</label>
                    <input type="range" min={10} max={72} value={t.fontSize} onChange={(e) => updateLayer(t.id, { ...t, fontSize: Number(e.target.value) } as any)} className="w-full" />
                    <label className="text-sm font-medium">Color</label>
                    <input type="color" value={t.color} onChange={(e) => updateLayer(t.id, { ...t, color: e.target.value } as any)} />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => duplicateLayer(t.id)} className="px-3 py-2 bg-gray-100 rounded">Duplicate</button>
                      <button onClick={() => bringForward(t.id)} className="px-3 py-2 bg-gray-100 rounded">Bring +</button>
                      <button onClick={() => sendBackward(t.id)} className="px-3 py-2 bg-gray-100 rounded">Send -</button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => deleteLayer(t.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded">Delete</button>
                      <button onClick={() => duplicateLayer(t.id)} className="px-3 py-2 bg-indigo-600 text-white rounded">Copy</button>
                    </div>
                  </div>
                );
              }

              if (sel.type === "image") {
                const im = sel as ImageLayer;
                return (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Image</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      // revoke old
                      if (im.objectUrl) try { URL.revokeObjectURL(im.objectUrl); } catch (e) {}
                      const url = URL.createObjectURL(f);
                      updateLayer(im.id, { ...im, src: url, objectUrl: url } as any);
                    }} />
                    <label className="text-sm font-medium">Size</label>
                    <div className="flex gap-2">
                      <input type="number" value={im.width} onChange={(e) => updateLayer(im.id, { ...im, width: Number(e.target.value) } as any)} className="w-1/2 border rounded px-2 py-1" />
                      <input type="number" value={im.height} onChange={(e) => updateLayer(im.id, { ...im, height: Number(e.target.value) } as any)} className="w-1/2 border rounded px-2 py-1" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => deleteLayer(im.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded">Delete</button>
                      <button onClick={() => duplicateLayer(im.id)} className="px-3 py-2 bg-indigo-600 text-white rounded">Duplicate</button>
                    </div>
                  </div>
                );
              }

              if (sel.type === "shape") {
                const s = sel as ShapeLayer;
                return (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Fill Color</label>
                    <input type="color" value={s.color} onChange={(e) => updateLayer(s.id, { ...s, color: e.target.value } as any)} />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => deleteLayer(s.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded">Delete</button>
                      <button onClick={() => duplicateLayer(s.id)} className="px-3 py-2 bg-indigo-600 text-white rounded">Duplicate</button>
                    </div>
                  </div>
                );
              }

              return null;
            })()
          ) : (
            <div className="text-sm text-slate-500">No layer selected — click an element to edit properties.</div>
          )}

          <div className="mt-auto text-xs text-slate-500 pt-6">Autosave every 5s • Shortcuts: Ctrl/Cmd+Z Undo • Ctrl/Cmd+Y Redo</div>
        </aside>
      </div>

      {/* SNACKBAR */}
      {showSnackbar && (
        <div className="fixed right-6 bottom-6 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-medium">Disimpan</div>
            <div className="text-xs text-slate-500">Template berhasil disimpan ke koleksi Anda</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumTemplateEditor;
