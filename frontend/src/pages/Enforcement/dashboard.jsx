import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function TrafficChart() {
  const data = {
    labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."],
    datasets: [
      {
        label: "จำนวนการกระทำผิด",
        data: [1200, 1800, 1500, 2000, 2300, 2600],
        borderWidth: 2,
      },
    ],
  };

  return <Line data={data} />;
}

function EnforcementDashboard() {
  const stats = [
    {
      icon: "S",
      label: "Speeding Violation",
      value: "33,900",
      color: "bg-red-100 border-red-500",
    },
    {
      icon: "T",
      label: "Truck Time Restriction Violation",
      value: "11,300",
      color: "bg-orange-100 border-orange-500",
    },
    {
      icon: "R",
      label: "Red Light Violation",
      value: "16,950",
      color: "bg-red-200 border-red-600",
    },
    {
      icon: "P",
      label: "Parking Violation",
      value: "22,600",
      color: "bg-orange-200 border-orange-600",
    },
    {
      icon: "W",
      label: "Driving on Sidewalk",
      value: "9,040",
      color: "bg-pink-200 border-pink-600",
    },
    {
      icon: "L",
      label: "Lane Changing Over Solid Line",
      value: "13,560",
      color: "bg-yellow-200 border-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-blue-600 text-4xl">🛡️</span>
            Traffic Enforcement Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            ระบบตรวจจับและบังคับใช้กฎหมายจราจร
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold">14:20:39</div>
          <div className="text-sm text-gray-600">
            วันจันทร์ที่ 23 มิถุนายน 2568
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`border-t-8 ${item.color} bg-white rounded-xl shadow p-4 flex flex-col gap-1`}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center font-bold">
                {item.icon}
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {item.label}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {item.value} <span className="text-lg">คัน</span>
            </div>
          </div>
        ))}
      </div>

      {/* Map + Ranking Panels */}
      <div className="grid grid-cols-3 gap-6">

        {/* Map */}
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">
            แผนที่แสดงตำแหน่งระบบตรวจจับการกระทำผิดกฎหมายจราจร
          </h3>

          {typeof window !== "undefined" && (
            <MapContainer
              center={[13.7563, 100.5018]}
              zoom={12}
              className="w-full h-[450px] rounded-xl"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[13.7563, 100.5018]}>
                <Popup>กรุงเทพมหานคร</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        {/* Ranking Lists */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-2">
              จุดที่มีจำนวนกระทำผิด (เขตเมือง มากที่สุด)
            </h3>
            <ul className="text-sm space-y-1">
              <li>ถ. แจ้งวัฒนะ — <b>245 ครั้ง</b></li>
              <li>ถ. งามวงศ์วาน — 230 ครั้ง</li>
              <li>ถ. วิภาวดีรังสิต — 215 ครั้ง</li>
              <li>ถ. ลาดพร้าว — 200 ครั้ง</li>
              <li>ถ. ประชาชื่น — 185 ครั้ง</li>
              <li>ถ. รัชดาฯ — 170 ครั้ง</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-2">
              จุดที่มีจำนวนกระทำผิด (นอกเขตเมือง มากที่สุด)
            </h3>
            <ul className="text-sm space-y-1">
              <li>ถ. พระราม 2 — 230 ครั้ง</li>
              <li>ถ. เพชรเกษม — 215 ครั้ง</li>
              <li>ถ. รามคำแหง — 200 ครั้ง</li>
              <li>ถ. ลาดกระบัง — 185 ครั้ง</li>
              <li>ถ. บรมราชชนนี — 170 ครั้ง</li>
              <li>ถ. ติวานนท์ — 160 ครั้ง</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">

        {/* Chart */}
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold">
            กราฟแสดงแนวโน้มการกระทำผิดกฎหมาย
          </h3>
          <div className="w-full h-[350px] rounded-xl">
            <TrafficChart />
          </div>
        </div>

        {/* Violations List */}
        <div className="bg-white rounded-xl shadow p-4 text-sm">
          <h3 className="font-semibold mb-3">การฝ่าฝืนจราจร</h3>

          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="font-bold text-red-500">ฝ่าไฟแดง</div>
              <div className="text-gray-600">
                ทะเบียน: ชบ-8765 — แยกเตาปูน — 27/06/2568 14:12 น.
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-yellow-100">
              <div className="font-bold text-red-500">ความเร็วเกินกำหนด</div>
              <div className="text-gray-600">
                ทะเบียน: ขน-1234 — พหลโยธิน — 85 กม./ชม. (จำกัด 60)
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="font-bold text-red-500">ฝ่าไฟแดง</div>
              <div className="text-gray-600">
                ทะเบียน: ชบ-8765 — ถนนงามวงศ์วาน — 27/06/2568 14:12 น.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default EnforcementDashboard;
