// frontend/src/pages/DataCollectionDashboard.jsx
import React, { useEffect, useRef, useMemo, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import DateTimeDisplay from "../../components/ui/DateTimeDisplay";

// --- ICON COMPONENTS ---
// NOTE: เนื้อหา SVG ของไอคอนหายไปตอนก็อปปี้โค้ดมา ให้ใส่ path จริงกลับเข้าไปตามของเดิมในโปรเจกต์
const SuvIcon = ({ className }) => <svg className={className} />;
const CarIcon = ({ className }) => <svg className={className} />;
const MotorcycleIcon = ({ className }) => <svg className={className} />;
const VanIcon = ({ className }) => <svg className={className} />;
const TrikeIcon = ({ className }) => <svg className={className} />;
const SmallTruckIcon = ({ className }) => <svg className={className} />;
const PickupTruckIcon = ({ className }) => <svg className={className} />;
const BusIcon = ({ className }) => <svg className={className} />;
const PedestrianIcon = ({ className }) => <svg className={className} />;
const DatabaseIcon = ({ className }) => <svg className={className} />;

// --- VEHICLE TYPE META (key ต้องตรงกับ field ที่ backend ส่งกลับใน data.data) ---
// อัปเดตตามผล full-scan จริงของ Artemis (get_vehicle_by_hour แบบ discover ทุก record)
// ผลสแกนจริงพบ 10 types: vehicle, twoWheelVehicle, pickupTruck, largeBus, buggy,
// truck, threeWheelVehicle, SUVMPV, van, pedestrian
// หมายเหตุ: pedestrian รวมเข้ากับยอด/กราฟของยานพาหนะทั้งหมดแล้ว ไม่แยกออกต่างหาก
const VEHICLE_META = [
  { key: "vehicle", label: "รถยนต์ส่วนบุคคล", color: "#EC4899", icon: CarIcon },
  { key: "twoWheelVehicle", label: "รถจักรยานยนต์", color: "#F97316", icon: MotorcycleIcon },
  { key: "pickupTruck", label: "รถกระบะ", color: "#FB923C", icon: PickupTruckIcon },
  { key: "largeBus", label: "รถโดยสาร", color: "#8B5CF6", icon: BusIcon },
  { key: "buggy", label: "รถบรรทุกขนาดเล็ก", color: "#84CC16", icon: SmallTruckIcon },
  { key: "truck", label: "รถบรรทุก", color: "#A16207", icon: SmallTruckIcon },
  { key: "threeWheelVehicle", label: "รถสามล้อ", color: "#F472B6", icon: TrikeIcon },
  { key: "SUVMPV", label: "รถ SUV", color: "#14B8A6", icon: SuvIcon },
  { key: "van", label: "รถตู้", color: "#3B82F6", icon: VanIcon },
  { key: "pedestrian", label: "คนเดินเท้า", color: "#DC2626", icon: PedestrianIcon },
];

// --- HELPERS ---
const gauss = (x, mu, sigma) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));

const genHourlySeries = (peak, floor) => {
  const out = [];
  for (let h = 1; h <= 24; h++) {
    const bump = Math.max(gauss(h, 7, 1.7), gauss(h, 17, 1.7) * 0.98);
    out.push(Math.round(floor + (peak - floor) * bump));
  }
  return out;
};

// วันที่ปัจจุบันในรูปแบบ 'YYYY-MM-DD' (ใช้เทียบว่าเข้าสู่วันใหม่หรือยัง)
const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// มิลลิวินาทีที่เหลือจนถึงนาทีที่หาร 5 ลงตัวถัดไป (เช่น ...:00, :05, :10, :15, :20, ... :55)
// เช่น ตอนนี้ 17:12:30.500 -> คืนค่าเวลาที่เหลือถึง 17:15:00.000 พอดี
const msUntilNextFiveMinuteMark = () => {
  const now = new Date();
  const next = new Date(now);
  const minutes = now.getMinutes();
  const remainder = minutes % 5;
  const isExactlyOnMark =
    remainder === 0 && now.getSeconds() === 0 && now.getMilliseconds() === 0;
  const minutesToAdd = isExactlyOnMark ? 0 : 5 - remainder;
  next.setMinutes(minutes + minutesToAdd, 0, 0); // เคลียร์วินาที/มิลลิวินาทีเป็น 0
  if (next <= now) next.setMinutes(next.getMinutes() + 5);
  return next.getTime() - now.getTime();
};

const POLL_INTERVAL_MS = 5 * 60 * 1000; // ดึงข้อมูลใหม่ทุก 5 นาที (ตรงนาที เช่น 00:00, 00:05, 17:15, 17:20 ...)
const MIDNIGHT_CHECK_MS = 60 * 1000; // เช็กทุก 1 นาทีว่าข้ามวันปฏิทินหรือยัง
const CACHE_KEY = "vehicleByHourCache"; // เก็บผลลัพธ์ล่าสุดไว้ใช้ตอน refresh หน้า (ไม่ต้องยิง API ใหม่ทันที)

// อ่าน cache จาก localStorage (ถ้ามี) — คืน null ถ้าไม่มีหรือ parse ไม่ได้
const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data) return null;
    return parsed;
  } catch {
    return null;
  }
};

// บันทึก cache ลง localStorage ทุกครั้งที่ fetch สำเร็จ
const writeCache = (data, date, updatedAtIso) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, date, updatedAt: updatedAtIso })
    );
  } catch {
    // เก็บ cache ไม่สำเร็จ (เช่น storage เต็ม/ถูกบล็อก) ไม่กระทบการทำงานหลัก ข้ามไปเฉย ๆ
  }
};

const DataCollectionDashboard = () => {
  const donutChartRef = useRef(null);
  const lineChartRef = useRef(null);

  // โหลด cache ครั้งเดียวตอน mount ไว้ใช้เป็นค่าเริ่มต้น (refresh หน้าแล้วเห็นข้อมูลเดิมทันที ไม่ต้องรอ API)
  const initialCacheRef = useRef(readCache());

  // --- STATE: ผลลัพธ์ดิบจาก API get_vehicle_by_hour ---
  const [apiData, setApiData] = useState(() => initialCacheRef.current?.data ?? null); // = res.data.data
  const [loading, setLoading] = useState(() => !initialCacheRef.current); // มี cache แล้ว = ไม่ต้อง loading
  const [error, setError] = useState(null);
  // วันที่ปัจจุบันตามที่ backend ยืนยันมา (ใช้ตรวจจับการข้ามวัน)
  const [currentDate, setCurrentDate] = useState(
    () => initialCacheRef.current?.date ?? todayStr()
  );
  // เวลาที่ fetch สำเร็จล่าสุด (ไว้โชว์บนหน้าเว็บเพื่อ verify ว่า poll จริง) — โหลดจาก cache ถ้ามี
  const [lastUpdatedAt, setLastUpdatedAt] = useState(
    () => (initialCacheRef.current?.updatedAt ? new Date(initialCacheRef.current.updatedAt) : null)
  );

  // --- EFFECT: เรียก API get_vehicle_by_hour พร้อม polling ทุก 5 นาที
  //     โดย "ตรงนาทีที่หาร 5 ลงตัว" เสมอ เช่น 00:00, 17:15, 17:20 ไม่ใช่นับ 5 นาทีจากตอนเปิดหน้า
  //     และรีเซ็ตอัตโนมัติเมื่อข้ามวัน (backend คำนวณช่วงเวลาเป็น "วันนั้นวันเดียว" ให้อยู่แล้ว
  //     ฝั่งนี้แค่ต้อง fetch ใหม่เมื่อวันเปลี่ยน ไม่ต้อง reset ยอดเอง) ---
  useEffect(() => {
    let cancelled = false;
    let pollId = null; // interval รอบ 5 นาที (เริ่มหลัง align ตรงนาทีแล้ว)
    let alignTimeoutId = null; // timeout ตัวแรกไว้ "รอ" ให้ตรงนาทีที่หาร 5 ลงตัว

    const fetchVehicleByHour = async () => {
      setError(null);
      try {
        const token = localStorage.getItem("token"); // TODO: ปรับให้ตรงกับที่โปรเจกต์เก็บ token จริง
        const res = await fetch("/api/get_vehicle_by_hour", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (!res.ok) {
          throw new Error(`get_vehicle_by_hour failed: ${res.status}`);
        }

        const json = await res.json();
        if (!json.success) {
          throw new Error("get_vehicle_by_hour: success = false");
        }

        if (cancelled) return;

        // ถ้า backend ยืนยันว่าวันที่เปลี่ยนไปแล้ว ให้ sync state ไว้ใช้เทียบรอบถัดไป
        if (json.date && json.date !== currentDate) {
          setCurrentDate(json.date);
        }

        const updatedAt = new Date();
        setApiData(json.data);
        setLastUpdatedAt(updatedAt);
        // เก็บ cache ไว้ใช้ตอน refresh หน้าครั้งถัดไป จะได้ไม่ต้องยิง API ทันที
        writeCache(json.data, json.date || currentDate, updatedAt.toISOString());
      } catch (err) {
        if (cancelled) return;
        console.error("get_vehicle_by_hour error:", err);
        setError(err.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // ถ้ายังไม่มี cache เลย (เปิดครั้งแรกสุด ไม่เคยโหลดข้อมูลมาก่อน) ต้อง fetch ทันที
    // เพราะไม่มีอะไรให้โชว์รอ — แต่ถ้ามี cache แล้ว จะ "ใช้ข้อมูลเก่าค้างไว้" โดยไม่ยิง API ใหม่
    // จนกว่าจะถึงนาทีที่หาร 5 ลงตัวถัดไป (เช่น ตอนนี้ 17:22 จะยังโชว์ข้อมูลของรอบ 17:20 ค้างไว้
    // จนกว่าจะถึง 17:25 ถึงจะดึงข้อมูลใหม่)
    if (!initialCacheRef.current) {
      fetchVehicleByHour();
    }

    // ตั้ง timeout ตัวแรกให้ตรงกับนาทีที่หาร 5 ลงตัวถัดไป (เช่น 17:15:00, 17:20:00, 00:00:00, ...)
    // จากนั้นค่อยตั้ง interval ทุก 5 นาทีต่อเนื่องจากจุดนั้น เพื่อให้ตรงเวลาตลอดไปไม่คลาดเคลื่อนสะสม
    alignTimeoutId = setTimeout(() => {
      if (cancelled) return;
      fetchVehicleByHour();
      pollId = setInterval(fetchVehicleByHour, POLL_INTERVAL_MS);
    }, msUntilNextFiveMinuteMark());

    // เช็กทุก 1 นาทีว่าข้ามวันปฏิทินหรือยัง ถ้าใช่ ยิง fetch ใหม่ทันที
    // ไม่ต้องรอครบรอบ 5 นาที เพื่อให้ตัวเลขเริ่มนับใหม่ของวันถัดไปเร็วที่สุด
    const midnightCheckId = setInterval(() => {
      const nowStr = todayStr();
      if (nowStr !== currentDate) {
        fetchVehicleByHour();
      }
    }, MIDNIGHT_CHECK_MS);

    return () => {
      cancelled = true;
      if (alignTimeoutId) clearTimeout(alignTimeoutId);
      if (pollId) clearInterval(pollId);
      clearInterval(midnightCheckId);
    };
  }, [currentDate]);

  // --- VEHICLE TYPE DATA: รวม META (label/icon/color) เข้ากับตัวเลขจริงจาก API ---
  // total  <- api[key].total
  // in     <- api[key].eastWest
  // out    <- api[key].westEast
  const vehicleTypes = useMemo(() => {
    return VEHICLE_META.map((meta) => {
      const item = apiData?.[meta.key];
      return {
        ...meta,
        total: item?.total ?? 0,
        in: item?.eastWest ?? 0,
        out: item?.westEast ?? 0,
      };
    });
  }, [apiData]);

  const totalAll = useMemo(() => vehicleTypes.reduce((s, v) => s + v.total, 0), [vehicleTypes]);
  const totalIn = useMemo(() => vehicleTypes.reduce((s, v) => s + v.in, 0), [vehicleTypes]);
  const totalOut = useMemo(() => vehicleTypes.reduce((s, v) => s + v.out, 0), [vehicleTypes]);

  // กราฟรายชั่วโมง: API นี้ยังไม่ได้ส่งข้อมูลแยกตาม 24 ชม. มาให้ (ส่งเป็นยอดรวมของช่วงที่เลือก)
  // จึงยัง generate เส้นแนวโน้มแบบจำลอง แต่ scale ตามยอดรวมจริงของแต่ละประเภทแทนค่าคงที่เดิม
  // TODO: ส่วนกราฟเส้นนี้พักไว้ก่อนตามที่ตกลงกัน —ยังไม่ทำ real-time ตามชั่วโมงจริง
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => (i === 23 ? "24:00" : `${(i + 1).toString().padStart(2, "0")}:00`));
    return hours.map((hour, i) => {
      const row = { hour };
      vehicleTypes.forEach((v) => {
        const peak = Math.max(1, Math.round(v.total / 10));
        const floor = Math.max(0, Math.round(v.total / 200));
        row[v.key] = genHourlySeries(peak, floor)[i];
      });
      return row;
    });
  }, [vehicleTypes]);

  // --- EFFECT: DONUT CHART ---
  // สีของแต่ละสไลซ์ผูกกับ fillField จาก data โดยตรง + ปิด default ColorSet ของ amCharts
  // เพื่อให้สีตรงกับ legend/กริดด้านล่างที่ใช้ v.color เดียวกันเป๊ะ ๆ ไม่ถูกสุ่มสีแทรก
  useEffect(() => {
    if (!donutChartRef.current) return;

    let root = am5.Root.new(donutChartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(68),
        radius: am5.percent(90),
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        fillField: "color", // ผูกสีจาก field "color" ในข้อมูลโดยตรง
        alignLabels: false,
      })
    );

    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);
    series.slices.template.setAll({
      stroke: am5.color("#131B2E"),
      strokeWidth: 3,
    });

    // ปิดพาเลตต์สุ่มสีของ amCharts ผูกกับสีที่กำหนดเองแทน กันสีชนกับ fillField
    series.set(
      "colors",
      am5.ColorSet.new(root, {
        colors: vehicleTypes.map((v) => am5.color(v.color)),
        reuse: false,
      })
    );

    series.data.setAll(
      vehicleTypes.map((v) => ({
        category: v.label,
        value: v.total,
        color: am5.color(v.color), // ต้องเป็น am5.color() object ไม่ใช่ hex string เฉย ๆ
      }))
    );

    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: totalAll.toLocaleString(),
        fontSize: 26,
        fontWeight: "700",
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        fill: am5.color("#FFFFFF"),
      })
    );
    series.appear(800, 100);

    return () => root.dispose();
  }, [vehicleTypes, totalAll]);

  // --- EFFECT: LINE CHART ---
  useEffect(() => {
    if (!lineChartRef.current) return;

    let root = am5.Root.new(lineChartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
        paddingLeft: 0,
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "hour",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 20,
          stroke: am5.color("#334155"),
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.data.setAll(hourlyData);
    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color("#94A3B8"),
      fontSize: 10,
    });
    xAxis.get("renderer").grid.template.setAll({ stroke: am5.color("#1E293B") });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );
    yAxis.get("renderer").labels.template.setAll({ fill: am5.color("#94A3B8"), fontSize: 11 });
    yAxis.get("renderer").grid.template.setAll({ stroke: am5.color("#1E293B") });

    const addLineSeries = (item) => {
      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: item.label,
          xAxis,
          yAxis,
          valueYField: item.key,
          categoryXField: "hour",
          stroke: am5.color(item.color),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}",
          }),
        })
      );
      series.set("tensionX", 0.8);
      series.strokes.template.setAll({
        strokeWidth: 2,
      });
      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 2.5,
            fill: am5.color(item.color),
            stroke: am5.color("#131B2E"),
            strokeWidth: 1,
          }),
        })
      );
      series.data.setAll(hourlyData);
      series.appear(800);
    };

    vehicleTypes.forEach((v) => addLineSeries(v));

    chart.appear(800, 100);

    return () => root.dispose();
  }, [hourlyData, vehicleTypes]);

  return (
    <div className="w-full h-screen overflow-y-auto p-6 bg-[#0B1120]">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Traffic Data Collection</h1>
          <p className="text-xs text-slate-400">ระบบจัดเก็บและวิเคราะห์ข้อมูลจราจร</p>
        </div>
        <div className="text-right">
          <DateTimeDisplay />
          {lastUpdatedAt && (
            <p className="text-[11px] text-slate-500 mt-1">
              อัปเดตล่าสุด{" "}
              {lastUpdatedAt.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          โหลดข้อมูลไม่สำเร็จ: {error}
        </div>
      )}

      {/* TOP ROW: total + donut (left) | vehicle type grid (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5 items-stretch">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Total Card */}
          <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-2">ยานพาหนะทั้งหมด</div>
              <div className="text-4xl font-bold text-white">
                {loading ? "…" : totalAll.toLocaleString()}
              </div>
            </div>
            <div className="text-right text-xs space-y-2">
              <div>
                <span className="text-slate-400">ขาเข้า</span>
                <div className="text-emerald-400 font-bold text-base">
                  {loading ? "…" : totalIn.toLocaleString()}{" "}
                  <span className="text-slate-500 font-normal text-[10px]">คัน</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400">ขาออก</span>
                <div className="text-orange-400 font-bold text-base">
                  {loading ? "…" : totalOut.toLocaleString()}{" "}
                  <span className="text-slate-500 font-normal text-[10px]">คัน</span>
                </div>
              </div>
            </div>
          </div>

          {/* Donut Card */}
          <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5 flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-white mb-1">สัดส่วนประเภทยานพาหนะ</h2>
            <p className="text-xs text-slate-500 mb-2">รวม {totalAll.toLocaleString()} คัน</p>
            <div ref={donutChartRef} className="w-full h-[210px]"></div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
              {vehicleTypes.map((v) => (
                <div key={v.key} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: v.color }}></span>
                  <span className="truncate">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Vehicle Type Grid */}
        <div className="lg:col-span-2 bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">ประเภทยานพาหนะ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicleTypes.map((v) => (
              <div
                key={v.key}
                className="bg-[#0F1626] border border-slate-800/50 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: v.color }}
                  >
                    <v.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400 mb-0.5 truncate">{v.label}</div>
                    <div className="text-xl font-bold text-white">
                      {loading ? "…" : v.total.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] leading-tight shrink-0 pl-2">
                  <div className="text-slate-400">
                    ขาเข้า <span className="text-emerald-400 font-bold">{loading ? "…" : v.in.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-400">
                    ขาออก <span className="text-orange-400 font-bold">{loading ? "…" : v.out.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Hourly traffic line chart */}
      <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5 opacity-30 cursor-not-allowed">
        <h2 className="text-sm font-bold text-white mb-1">ปริมาณการจราจรตามช่วงเวลา</h2>
        <p className="text-xs text-slate-500 mb-4">จำนวนยานพาหนะรายชั่วโมง แยกตามประเภท (Volume / Time)</p>
        <div className="flex flex-col lg:flex-row gap-4">
          <div ref={lineChartRef} className="flex-1 h-[420px]"></div>
          <div className="lg:w-44 flex lg:flex-col flex-row flex-wrap gap-x-4 gap-y-2 lg:justify-center">
            {vehicleTypes.map((v) => (
              <div key={v.key} className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: v.color }}></span>
                <span className="truncate">{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionDashboard;