import React, { useState, useMemo } from "react";
import {
  Ban,
  Star,
  Plus,
  ScanLine,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Filter,
} from "lucide-react";

// ================== MOCK DATA ==================
const STATS = [
  {
    key: "blacklist",
    label: "Blacklist",
    total: "2,140",
    in: "1,070",
    out: "1,070",
    icon: Ban,
    accent: "#f43f5e",
    glow: "rgba(244,63,94,0.18)",
  },
  {
    key: "vip",
    label: "V.I.P.",
    total: "4,250",
    in: "2,125",
    out: "2,125",
    icon: Star,
    accent: "#f5c451",
    glow: "rgba(245,196,81,0.18)",
  },
  {
    key: "ambulance",
    label: "Ambulance",
    total: "1,895",
    in: "948",
    out: "947",
    icon: Plus,
    accent: "#fb7185",
    glow: "rgba(251,113,133,0.18)",
  },
  {
    key: "unregistered",
    label: "ยานพาหนะไม่ต่อภาษี",
    total: "7,321",
    in: "3,661",
    out: "3,660",
    icon: ScanLine,
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.18)",
  },
  {
    key: "green",
    label: "Green List",
    total: "2,140",
    in: "1,070",
    out: "1,070",
    icon: ShieldCheck,
    accent: "#34d399",
    glow: "rgba(52,211,153,0.18)",
  },
];

const CATEGORY_STYLES = {
  Ambulance: "bg-rose-400/15 text-rose-300 border border-rose-400/20",
  "V.I.P.": "bg-amber-400/15 text-amber-300 border border-amber-400/20",
  "Green List": "bg-emerald-400/15 text-emerald-300 border border-emerald-400/20",
  Blacklist: "bg-red-500/15 text-red-400 border border-red-500/20",
  "ยานพาหนะไม่ต่อภาษี": "bg-violet-400/15 text-violet-300 border border-violet-400/20",
};

const EVENTS = [
  { cat: "Ambulance", plate: "2วก-8855", loc: "สี่แยกบางนา จ.", dir: "in", time: "08:58 น." },
  { cat: "V.I.P.", plate: "1กก-3030", loc: "สี่แยกบางนา จ.", dir: "in", time: "06:51 น." },
  { cat: "Green List", plate: "งง-5566", loc: "สี่แยกบางนา จ.", dir: "in", time: "06:40 น." },
  { cat: "Ambulance", plate: "งง-5566", loc: "สี่แยกบางนา จ.", dir: "out", time: "05:56 น." },
  { cat: "Green List", plate: "กซ-1234", loc: "สี่แยกบางนา จ.", dir: "in", time: "04:46 น." },
  { cat: "Blacklist", plate: "7บบ-8081", loc: "สี่แยกบางนา จ.", dir: "in", time: "03:18 น." },
  { cat: "Ambulance", plate: "3ดด-5512", loc: "สี่แยกบางนา จ.", dir: "out", time: "00:44 น." },
  { cat: "Blacklist", plate: "3ดด-5512", loc: "สี่แยกบางนา จ.", dir: "out", time: "00:12 น." },
  { cat: "Green List", plate: "งง-5566", loc: "สี่แยกบางนา จ.", dir: "in", time: "07:31 น." },
  { cat: "Blacklist", plate: "2วก-8855", loc: "สี่แยกบางนา จ.", dir: "in", time: "07:31 น." },
  { cat: "ยานพาหนะไม่ต่อภาษี", plate: "ขค-4747", loc: "สี่แยกบางนา จ.", dir: "out", time: "07:20 น." },
  { cat: "ยานพาหนะไม่ต่อภาษี", plate: "ผผ-2210", loc: "สี่แยกบางนา จ.", dir: "in", time: "03:08 น." },
  { cat: "V.I.P.", plate: "2วก-8855", loc: "สี่แยกบางนา จ.", dir: "out", time: "01:07 น." },
  { cat: "V.I.P.", plate: "7บบ-8081", loc: "สี่แยกบางนา จ.", dir: "out", time: "00:25 น." },
  { cat: "V.I.P.", plate: "2วก-8855", loc: "สี่แยกบางนา จ.", dir: "in", time: "23:43 น." },
  { cat: "V.I.P.", plate: "2วก-8855", loc: "สี่แยกบางนา จ.", dir: "out", time: "08:16 น." },
];

const CAMERA_MARKERS = [
  { top: "44%", left: "55%", pulse: true },
  { top: "62%", left: "48%", pulse: false },
];

const DISTRICT_LABELS = [
  { name: "Lam Phaya", top: "9%", left: "6%" },
  { name: "Lat Sawai", top: "9%", left: "88%" },
  { name: "Khu Khot", top: "13%", left: "78%" },
  { name: "BANG BUA\nTHONG", top: "22%", left: "27%" },
  { name: "PAK KRET", top: "22%", left: "40%" },
  { name: "Huai Phlu", top: "31%", left: "6%" },
  { name: "Sao Thong Hin", top: "31%", left: "27%" },
  { name: "NONTHABURI", top: "36%", left: "39%" },
  { name: "Plai Bang", top: "45%", left: "27%" },
  { name: "Bang Krual", top: "43%", left: "43%" },
  { name: "Nakhon Chai Si", top: "51%", left: "3%" },
  { name: "Sala Ya", top: "51%", left: "18%" },
  { name: "BANGKOK", top: "58%", left: "38%" },
  { name: "OM NOI", top: "68%", left: "16%" },
  { name: "Krathum Baen", top: "75%", left: "7%" },
  { name: "Phra Pradaeng", top: "77%", left: "51%" },
  { name: "SAMUT PRAKAN", top: "85%", left: "48%" },
  { name: "Thephrak", top: "82%", left: "51%" },
  { name: "Bang Phli", top: "83%", left: "82%" },
  { name: "Bang Pla", top: "89%", left: "6%" },
  { name: "Laem Fa Pha", top: "93%", left: "40%" },
  { name: "SAMUT SAKHON", top: "96%", left: "13%" },
];

const FILTER_OPTIONS = ["รวมทุกประเภท", ...Object.keys(CATEGORY_STYLES)];

// ================== SUB COMPONENTS ==================

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div
      className="relative flex-1 min-w-[220px] rounded-2xl border border-white/5 bg-[#12151f] p-5 overflow-hidden"
      style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)` }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl"
        style={{ background: stat.glow }}
      />
      <div className="relative flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: stat.glow, color: stat.accent }}
        >
          <Icon size={16} strokeWidth={2.25} />
        </div>
        <span className="text-[13px] font-medium text-slate-300">{stat.label}</span>
      </div>

      <div className="relative mt-3 text-3xl font-semibold tracking-tight text-white">
        {stat.total}
      </div>

      <div className="relative mt-3 flex items-center gap-6">
        <div>
          <div className="text-[11px] font-medium text-cyan-400">ขาเข้า</div>
          <div className="text-[12px] text-slate-400">
            {stat.in} <span className="text-slate-500">คัน</span>
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium text-amber-400">ขาออก</div>
          <div className="text-[12px] text-slate-400">
            {stat.out} <span className="text-slate-500">คัน</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapPanel() {
  return (
    <div className="flex-[1.55] min-w-[320px] rounded-2xl border border-white/5 bg-[#12151f] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-[14px] font-semibold text-slate-100">
          แผนที่เฝ้าระวังยานพาหนะ
        </h2>
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-[12px] text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          จุดติดตั้งกล้อง
        </div>
      </div>

      <div className="relative mx-3 mb-3 flex-1 min-h-[520px] overflow-hidden rounded-xl bg-[#0a0c12]">
        {/* subtle road grid backdrop */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M42 0H0V42" fill="none" stroke="#1c2230" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M0,300 C300,260 500,420 900,380" stroke="#232a3a" strokeWidth="3" fill="none" />
          <path d="M150,0 C220,250 260,400 340,700" stroke="#232a3a" strokeWidth="3" fill="none" />
          <path d="M0,150 C260,180 600,120 950,200" stroke="#1c2230" strokeWidth="2" fill="none" />
          <path d="M500,0 C480,250 560,450 520,700" stroke="#1c2230" strokeWidth="2" fill="none" />
        </svg>

        {/* district labels */}
        {DISTRICT_LABELS.map((d) => (
          <span
            key={d.name}
            className="absolute select-none whitespace-pre-line text-[10px] font-medium tracking-wide text-slate-500/70"
            style={{ top: d.top, left: d.left }}
          >
            {d.name}
          </span>
        ))}

        {/* camera markers */}
        {CAMERA_MARKERS.map((m, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: m.top, left: m.left }}
          >
            <span className="absolute inset-0 -m-3 rounded-full border border-emerald-400/30" />
            <span className="absolute inset-0 -m-6 rounded-full border border-emerald-400/15" />
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]">
              <MapPin size={14} className="text-[#0a0c12]" strokeWidth={2.5} />
            </div>
          </div>
        ))}

        {/* zoom controls */}
        <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-md border border-white/10 bg-[#12151f]/90 backdrop-blur">
          <button className="h-7 w-7 text-slate-300 hover:bg-white/5 transition-colors border-b border-white/10">
            +
          </button>
          <button className="h-7 w-7 text-slate-300 hover:bg-white/5 transition-colors">
            −
          </button>
        </div>

        {/* attribution */}
        <div className="absolute bottom-1.5 left-2 text-[9px] text-slate-600">
          Leaflet | © OpenStreetMap, © CARTO
        </div>
      </div>
    </div>
  );
}

function EventTable() {
  const [filter, setFilter] = useState("รวมทุกประเภท");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    if (filter === "รวมทุกประเภท") return EVENTS;
    return EVENTS.filter((e) => e.cat === filter);
  }, [filter]);

  return (
    <div className="flex-1 min-w-[340px] rounded-2xl border border-white/5 bg-[#12151f] p-5 flex flex-col">
      <div className="flex items-center gap-2 text-[13px] text-slate-300 mb-2">
        <Filter size={13} className="text-slate-500" />
        กรองประเภทเหตุการณ์
      </div>

      <div className="relative mb-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#1a1e2b] px-4 py-2.5 text-[13px] text-slate-200"
        >
          {filter}
          <ChevronDown
            size={15}
            className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-white/10 bg-[#1a1e2b] shadow-xl">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setFilter(opt);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-[13px] hover:bg-white/5 ${
                  opt === filter ? "text-cyan-400" : "text-slate-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1.3fr_0.9fr_1.1fr_0.7fr_0.6fr] gap-2 border-b border-white/5 pb-2 text-[11px] font-medium text-slate-500">
        <span>EVENT</span>
        <span>ป้ายทะเบียน</span>
        <span>จุดติดตั้ง</span>
        <span>ทิศทางจราจร</span>
        <span className="text-right">เวลา</span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[460px] divide-y divide-white/[0.04]">
        {rows.map((e, i) => (
          <div
            key={i}
            className="grid grid-cols-[1.3fr_0.9fr_1.1fr_0.7fr_0.6fr] items-center gap-2 py-2.5 text-[12.5px]"
          >
            <span
              className={`inline-flex w-fit items-center rounded px-2 py-[3px] text-[10.5px] font-medium ${CATEGORY_STYLES[e.cat]}`}
            >
              {e.cat}
            </span>
            <span className="text-slate-300">{e.plate}</span>
            <span className="truncate text-slate-400">{e.loc}</span>
            <span
              className={`flex items-center gap-1 font-medium ${
                e.dir === "in" ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {e.dir === "in" ? "▲" : "▼"} {e.dir === "in" ? "ขาเข้า" : "ขาออก"}
            </span>
            <span className="text-right text-slate-500">{e.time}</span>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="py-10 text-center text-[13px] text-slate-500">
            ไม่พบข้อมูลในหมวดหมู่นี้
          </div>
        )}
      </div>
    </div>
  );
}

// ================== MAIN ==================
function AuthorizationDashboard() {
  return (
    <div className="min-h-screen w-full bg-[#0a0c12] p-6 font-sans">
      <div className="mx-auto max-w-[1600px]">
        {/* Stat cards row */}
        <div className="mb-5 flex flex-wrap gap-4">
          {STATS.map((s) => (
            <StatCard key={s.key} stat={s} />
          ))}
        </div>

        {/* Map + table row */}
        <div className="flex flex-wrap gap-4">
          <MapPanel />
          <EventTable />
        </div>
      </div>
    </div>
  );
}

export default AuthorizationDashboard;

//api PRTG 