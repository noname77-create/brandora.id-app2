import React, { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MousePointer,
  DollarSign,
  Download,
  Share2,
  Calendar,
  Filter,
  Crown,
} from "lucide-react";

/* -------------------------
   Dummy Data
   ------------------------- */
const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const weeklyData = {
  Instagram: {
    reach: [45200, 51200, 47800, 60100, 53200, 58900, 62000],
    likes: [4200, 4800, 4500, 6100, 5300, 5800, 6400],
    ctr: [3.2, 3.8, 3.5, 4.6, 3.9, 4.4, 4.9],
    conversion: [1.2, 1.5, 1.3, 1.8, 1.6, 1.9, 2.2],
  },
  TikTok: {
    reach: [38200, 42000, 41000, 70000, 64500, 72000, 76000],
    likes: [5200, 6100, 5900, 8800, 7600, 9300, 9800],
    ctr: [2.8, 3.0, 2.9, 4.1, 3.8, 4.5, 5.0],
    conversion: [0.9, 1.0, 0.95, 1.6, 1.4, 1.8, 2.0],
  },
  Facebook: {
    reach: [28500, 30200, 29800, 33000, 31000, 34000, 35500],
    likes: [1200, 1350, 1300, 1500, 1400, 1600, 1700],
    ctr: [1.7, 1.9, 1.8, 2.0, 1.9, 2.1, 2.3],
    conversion: [0.7, 0.8, 0.75, 0.9, 0.85, 1.0, 1.1],
  },
  LinkedIn: {
    reach: [18000, 19500, 19000, 21000, 20500, 23000, 24000],
    likes: [400, 480, 450, 520, 510, 580, 600],
    ctr: [2.2, 2.5, 2.4, 2.8, 2.7, 3.0, 3.2],
    conversion: [1.1, 1.2, 1.1, 1.4, 1.3, 1.6, 1.7],
  },
};

type PlatformKey = keyof typeof weeklyData;

/* -------------------------
   Utils
   ------------------------- */
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);
const percentChange = (prev: number, curr: number) =>
  prev === 0 ? 100 : ((curr - prev) / Math.abs(prev)) * 100;

/* -------------------------
   LineChart Component
   ------------------------- */
const LineChart: React.FC<{
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
  formatPoint?: (v: number) => string;
  ariaLabel?: string;
}> = ({ data, labels, height = 160, color = "#6366F1", formatPoint, ariaLabel }) => {
  const [hover, setHover] = useState<{ idx: number; x: number; y: number } | null>(null);

  const width = 700;
  const padding = 24;
  const innerW = width - padding * 2;
  const max = Math.max(...data) || 1;
  const min = Math.min(...data) || 0;
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * innerW;
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return { x, y, v };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white/60 p-4 border border-gray-100 shadow-sm">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-40"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.14" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <path
          d={`${pathD} L ${padding + innerW} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#grad)"
          stroke="none"
        />

        <path d={pathD} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="white"
              stroke={color}
              strokeWidth={1.6}
              onMouseEnter={() => setHover({ idx, x: p.x, y: p.y })}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer", transition: "transform .15s" }}
            />
          </g>
        ))}

        {labels.map((lab, i) => {
          const x = padding + (i / (labels.length - 1)) * innerW;
          return (
            <text key={i} x={x} y={height - 6} fontSize={10} textAnchor="middle" fill="#6b7280">
              {lab}
            </text>
          );
        })}

        {hover && (
          <g transform={`translate(${hover.x}, ${hover.y - 8})`}>
            <rect x={8} y={-34} rx={6} ry={6} width={90} height={28} fill="#111827" opacity={0.95} />
            <text x={12} y={-14} fontSize={11} fill="#fff">
              {formatPoint ? formatPoint(data[hover.idx]) : data[hover.idx]}
            </text>
            <rect x={-1} y={-2} width={2} height={8} fill={color} />
          </g>
        )}
      </svg>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <div>Min: {min.toLocaleString()}</div>
        <div>Avg: {Math.round(avg(data)).toLocaleString()}</div>
        <div>Max: {Math.max(...data).toLocaleString()}</div>
      </div>
    </div>
  );
};

/* -------------------------
   AI Insight Generator
   ------------------------- */
const generateAIInsights = (platformData: typeof weeklyData) => {
  const platforms = Object.keys(platformData) as PlatformKey[];

  type Insight = {
    platform: string;
    reachTotal: number;
    reachPctChange: number;
    bestDayReach: { day: string; value: number };
  };

  const insights: Insight[] = platforms.map((p) => {
    const reach = platformData[p].reach;
    const first = reach[0];
    const last = reach[reach.length - 1];
    const reachTotal = sum(reach);
    const reachPctChange = percentChange(first, last);
    const bestIdx = reach.indexOf(Math.max(...reach));
    return {
      platform: p,
      reachTotal,
      reachPctChange,
      bestDayReach: { day: days[bestIdx], value: reach[bestIdx] },
    };
  });

  let bestPlatform = insights[0];
  for (const ins of insights) if (ins.bestDayReach.value > bestPlatform.bestDayReach.value) bestPlatform = ins;

  const summary = `Ringkasan: Platform terbaik minggu ini adalah ${bestPlatform.platform} (puncak pada ${bestPlatform.bestDayReach.day}, reach ${bestPlatform.bestDayReach.value.toLocaleString()}). Rata-rata pertumbuhan reach ${
    bestPlatform.reachPctChange >= 0 ? "naik" : "turun"
  } ${Math.abs(Math.round(bestPlatform.reachPctChange))}% dari awal minggu ke akhir minggu.`;

  const recommendation = `Rekomendasi: Tingkatkan anggaran konten pada ${bestPlatform.platform} di hari-hari puncak (${bestPlatform.bestDayReach.day}). Uji variasi kreatif berbasis format yang menghasilkan likes & CTR tertinggi (mis. video pendek untuk TikTok). Pertimbangkan A/B test CTA untuk meningkatkan conversion sekitar 10-20%.`;

  const reachLeader = platforms.map((p) => ({ p, val: platformData[p].reach[platformData[p].reach.length - 1] })).sort((a, b) => b.val - a.val)[0];
  const likesLeader = platforms.map((p) => ({ p, val: platformData[p].likes[platformData[p].likes.length - 1] })).sort((a, b) => b.val - a.val)[0];
  const ctrLeader = platforms.map((p) => ({ p, val: platformData[p].ctr[platformData[p].ctr.length - 1] })).sort((a, b) => b.val - a.val)[0];
  const convLeader = platforms.map((p) => ({ p, val: platformData[p].conversion[platformData[p].conversion.length - 1] })).sort((a, b) => b.val - a.val)[0];

  return {
    summary,
    recommendation,
    leaders: {
      reach: reachLeader,
      likes: likesLeader,
      ctr: ctrLeader,
      conversion: convLeader,
    },
  };
};

/* -------------------------
   Main Component
   ------------------------- */
const PerformanceReport: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedPlatform, setSelectedPlatform] = useState<"all" | PlatformKey | string>("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const periods = [
    { value: "7days", label: "7 Hari Terakhir" },
    { value: "30days", label: "30 Hari Terakhir" },
    { value: "90days", label: "3 Bulan Terakhir" },
    { value: "custom", label: "Custom Range" },
  ];

  const platforms: Array<"all" | PlatformKey> = ["all", "Instagram", "TikTok", "Facebook", "LinkedIn"];

  const ai = useMemo(() => generateAIInsights(weeklyData), []);

  const handleExportPDF = () => alert("Export PDF demo");
  const handleExportCSV = () => alert("Export CSV demo");
  const handleShareReport = () => alert("Share demo");

  const selectedPlatformsToRender =
    selectedPlatform === "all" ? (["Instagram", "TikTok", "Facebook", "LinkedIn"] as PlatformKey[]) : [selectedPlatform as PlatformKey];

  const aggregated = useMemo(() => {
    const platformsToUse = selectedPlatformsToRender as PlatformKey[];
    const aggReach = platformsToUse.reduce((acc, p) => acc + sum(weeklyData[p].reach), 0);
    const aggLikes = platformsToUse.reduce((acc, p) => acc + sum(weeklyData[p].likes), 0);
    const aggCtr = (platformsToUse.reduce((acc, p) => acc + avg(weeklyData[p].ctr), 0) / platformsToUse.length) || 0;
    const aggConv = (platformsToUse.reduce((acc, p) => acc + avg(weeklyData[p].conversion), 0) / platformsToUse.length) || 0;
    return { reach: aggReach, likes: aggLikes, ctr: aggCtr, conversion: aggConv };
  }, [selectedPlatform]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header & Action Buttons */}
        <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-0">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-semibold text-slate-900">
              <BarChart3 className="w-9 h-9 text-indigo-600" /> Performance Report
            </h1>
            <p className="mt-2 text-slate-500 max-w-xl">
              Analisis performa kampanye digital marketing Anda secara mendalam — ringkasan & insight otomatis untuk keputusan cepat.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:gap-2">
            <button onClick={handleExportPDF} className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow hover:shadow-md">
              <Download className="w-4 h-4 text-slate-600" /> Export PDF
            </button>
            <button onClick={handleExportCSV} className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow hover:shadow-md">
              <Download className="w-4 h-4 text-slate-600" /> Export CSV
            </button>
            <button onClick={handleShareReport} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:opacity-95">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </header>

        {/* Controls */}
        <section className="bg-white rounded-2xl p-4 md:p-6 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white"
                >
                  {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              {selectedPeriod === "custom" && (
                <div className="flex items-center gap-2">
                  <input type="date" value={customRange.start} onChange={(e) => setCustomRange(s => ({ ...s, start: e.target.value }))} className="px-3 py-2 border rounded-xl" />
                  <span className="text-gray-500">s/d</span>
                  <input type="date" value={customRange.end} onChange={(e) => setCustomRange(s => ({ ...s, end: e.target.value }))} className="px-3 py-2 border rounded-xl" />
                </div>
              )}

              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} className="pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white">
                  {platforms.map(p => <option key={p} value={p}>{p === "all" ? "Semua Platform" : p}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-50 px-3 py-2 rounded-xl text-sm text-slate-600">Periode: {selectedPeriod}</div>
              <div className="bg-slate-50 px-3 py-2 rounded-xl text-sm text-slate-600">Platform: {selectedPlatform}</div>
            </div>
          </div>
        </section>

        {/* Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Reach */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50"><Eye className="w-5 h-5 text-indigo-600" /></div>
                <div>
                  <div className="text-xs text-slate-500">Total Reach</div>
                  <div className="text-xl font-semibold mt-1">{aggregated.reach.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-sm text-green-600 font-semibold">+{Math.round((aggregated.reach / 1000) % 20)}%</div>
            </div>
          </div>

          {/* Total Likes */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-50"><Heart className="w-5 h-5 text-pink-600" /></div>
                <div>
                  <div className="text-xs text-slate-500">Total Likes</div>
                  <div className="text-xl font-semibold mt-1">{aggregated.likes.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-sm text-green-600 font-semibold">+{Math.round((aggregated.likes / 1000) % 20)}%</div>
            </div>
          </div>

          {/* Average CTR */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50"><MousePointer className="w-5 h-5 text-green-600" /></div>
                <div>
                  <div className="text-xs text-slate-500">CTR (%)</div>
                  <div className="text-xl font-semibold mt-1">{aggregated.ctr.toFixed(2)}%</div>
                </div>
              </div>
              <div className="text-sm text-green-600 font-semibold">+{(aggregated.ctr % 5).toFixed(1)}%</div>
            </div>
          </div>

          {/* Average Conversion */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50"><DollarSign className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <div className="text-xs text-slate-500">Conversion (%)</div>
                  <div className="text-xl font-semibold mt-1">{aggregated.conversion.toFixed(2)}%</div>
                </div>
              </div>
              <div className="text-sm text-green-600 font-semibold">+{(aggregated.conversion % 5).toFixed(1)}%</div>
            </div>
          </div>
        </section>

        {/* AI Insights */}
<section className="bg-gradient-to-r from-indigo-50 to-white rounded-2xl p-6 border border-slate-100 shadow-md">
  <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
    {/* Left: Icon + Summary */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
      <div className="p-3 rounded-lg bg-indigo-600 text-white flex-shrink-0">
        <Crown className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">AI Insight (Auto-generated)</h3>
        <p className="text-slate-600 mt-1">{ai.summary}</p>
      </div>
    </div>

    {/* Right: Key Leaders */}
    <div className="w-full lg:w-auto mt-4 lg:mt-0">
      <div className="text-sm text-slate-500 mb-2">Key Leaders</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <div className="text-xs text-slate-400">Top Reach</div>
          <div className="font-semibold text-slate-800">
            {ai.leaders.reach.p} ({ai.leaders.reach.val.toLocaleString()})
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <div className="text-xs text-slate-400">Top Likes</div>
          <div className="font-semibold text-slate-800">
            {ai.leaders.likes.p} ({ai.leaders.likes.val.toLocaleString()})
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <div className="text-xs text-slate-400">Top CTR</div>
          <div className="font-semibold text-slate-800">
            {ai.leaders.ctr.p} ({ai.leaders.ctr.val}%)
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <div className="text-xs text-slate-400">Top Conv</div>
          <div className="font-semibold text-slate-800">
            {ai.leaders.conversion.p} ({ai.leaders.conversion.val}%)
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Recommendation */}
  <div className="mt-6 text-slate-600">
    <div className="text-sm font-medium mb-2">Recommendation</div>
    <div className="text-sm">{ai.recommendation}</div>
  </div>
</section>


        {/* Charts */}
        <section className="grid grid-cols-1 gap-6 overflow-x-auto">
          {selectedPlatformsToRender.map((platform) => (
            <div key={platform} className="bg-white rounded-2xl p-4 md:p-6 border border-slate-100 shadow-sm min-w-[320px]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-900">{platform} - Weekly Performance</h3>
                </div>
                <div className="text-sm text-slate-500 mt-2 md:mt-0">Last 7 days</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <div className="text-sm text-slate-500 mb-2">Reach</div>
                  <LineChart
                    data={weeklyData[platform as PlatformKey].reach}
                    labels={days}
                    color="#2563EB"
                    formatPoint={(v) => `${v.toLocaleString()} reach`}
                    ariaLabel={`${platform} reach chart`}
                  />
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-2">Likes</div>
                  <LineChart
                    data={weeklyData[platform as PlatformKey].likes}
                    labels={days}
                    color="#DB2777"
                    formatPoint={(v) => `${v.toLocaleString()} likes`}
                    ariaLabel={`${platform} likes chart`}
                  />
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-2">CTR (%)</div>
                  <LineChart
                    data={weeklyData[platform as PlatformKey].ctr}
                    labels={days}
                    color="#10B981"
                    formatPoint={(v) => `${v.toFixed(2)} %`}
                    ariaLabel={`${platform} ctr chart`}
                  />
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-2">Conversion (%)</div>
                  <LineChart
                    data={weeklyData[platform as PlatformKey].conversion}
                    labels={days}
                    color="#7C3AED"
                    formatPoint={(v) => `${v.toFixed(2)} %`}
                    ariaLabel={`${platform} conversion chart`}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Campaign Table */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <div className="p-4 md:p-6 border-b">
            <h3 className="text-lg font-semibold text-slate-900">Campaign Performance</h3>
            <p className="text-sm text-slate-500 mt-1">Detail metrik campaign & channel</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-white border-b">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-slate-500">Campaign</th>
                  <th className="px-4 md:px-6 py-3 text-left text-slate-500">Platform</th>
                  <th className="px-4 md:px-6 py-3 text-left text-slate-500">Reach</th>
                  <th className="px-4 md:px-6 py-3 text-left text-slate-500">Engagement</th>
                  <th className="px-4 md:px-6 py-3 text-left text-slate-500">CTR</th>
                  <th className="px-4 md:px-6 py-3 text-left text-slate-500">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Summer Sale Campaign", platform: "Instagram", reach: "45.2K", engagement: "6.8K", ctr: "4.2%", conv: "3.1%" },
                  { name: "Product Launch Video", platform: "TikTok", reach: "32.1K", engagement: "5.4K", ctr: "3.8%", conv: "2.8%" },
                  { name: "Brand Awareness", platform: "Facebook", reach: "28.7K", engagement: "4.2K", ctr: "2.9%", conv: "1.8%" },
                  { name: "Professional Content", platform: "LinkedIn", reach: "19.4K", engagement: "2.8K", ctr: "3.5%", conv: "2.4%" },
                ].map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 md:px-6 py-3">{c.name}</td>
                    <td className="px-4 md:px-6 py-3">
                      <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs">{c.platform}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3">{c.reach}</td>
                    <td className="px-4 md:px-6 py-3">{c.engagement}</td>
                    <td className="px-4 md:px-6 py-3">{c.ctr}</td>
                    <td className="px-4 md:px-6 py-3">{c.conv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PerformanceReport;
