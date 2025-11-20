import React from "react";

function EnforcementDashboard() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Traffic Enforcement Dashboard</h1>
          <p className="text-sm text-gray-600">ระบบตรวจจับและบังคับใช้กฎหมายจราจร</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">14:20:39</div>
          <div className="text-sm text-gray-600">วันจันทร์ที่ 23 มิถุนายน 2568</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: "Speeding Violation", value: "33,900", color: "bg-red-100" },
          { label: "Truck Time Restriction Violation", value: "11,300", color: "bg-orange-100" },
          { label: "Red Light Violation", value: "16,950", color: "bg-red-200" },
          { label: "Parking Violation", value: "22,600", color: "bg-orange-200" },
          { label: "Driving on Sidewalk", value: "9,040", color: "bg-pink-200" },
          { label: "Lane Changing Over Solid Line", value: "13,560", color: "bg-yellow-200" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 shadow bg-white border-t-4 ${item.color}`}>
            <div className="text-sm font-semibold text-gray-700">{item.label}</div>
            <div className="text-3xl font-bold mt-2">
              {item.value} <span className="text-lg">คัน</span>
            </div>
          </div>
        ))}
      </div>

      {/* Map + Right Panels */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">แผนที่แสดงตำแหน่งระบบตรวจจับการกระทำผิดกฎหมายจราจร</h3>
          <div className="w-full h-[450px] bg-gray-300 rounded-xl"></div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-2">จุดที่มีจำนวนการกระทำผิด (เขตเมือง)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>ถ. แจ้งวัฒนะ — <span className="font-bold">245 ครั้ง</span></li>
              <li>ถ. งามวงศ์วาน — 230 ครั้ง</li>
              <li>ถ. รัตนาธิเบศร์ — 215 ครั้ง</li>
              <li>ถ. ลาดพร้าว — 200 ครั้ง</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-2">จุดที่มีจำนวนการกระทำผิด (นอกเขตเมือง)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>ถ. พระราม 2 — 230 ครั้ง</li>
              <li>ถ. เพชรเกษม — 215 ครั้ง</li>
              <li>ถ. กิ่งแก้ว — 200 ครั้ง</li>
              <li>ถ. ลาดกระบัง — 185 ครั้ง</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold">กราฟแสดงแนวโน้มการกระทำผิดกฎหมาย</h3>
          <div className="w-full h-[350px] bg-gray-200 rounded-xl"></div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">การฝ่าฝืนจราจร</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 border rounded-lg">
              <div className="font-bold text-red-500">ฝ่าไฟแดง</div>
              <div className="text-gray-600">ทะเบียน: ชบ-8765 | ถนนงามวงศ์วาน | 27/06/2568</div>
            </div>
            <div className="p-3 border rounded-lg bg-yellow-100">
              <div className="font-bold text-red-500">ความเร็วเกินกำหนด</div>
              <div className="text-gray-600">ทะเบียน: ขน-1234 | พหลโยธิน | 80 กม./ชม.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnforcementDashboard;