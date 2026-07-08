// components/ui/IncidentList.jsx
import { IncidentRow } from "./IncidentRow";

export const IncidentList = ({
  incidents = [],
  selectedSort,
  setSelectedSort,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="mt-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Controls */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex gap-2">
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg"
          >
            <option>ล่าสุด</option>
            <option>เก่าสุด</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg"
          >
            <option>ทั้งหมด</option>
            <option>Verified</option>
            <option>New</option>
            <option>Closed</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          แสดง {incidents.length} รายการ
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-3 text-xs text-left">รหัส</th>
              <th className="px-4 py-3 text-xs text-left">ประเภท</th>
              <th className="px-4 py-3 text-xs text-left">รถ</th>
              <th className="px-4 py-3 text-xs text-left">สถานที่</th>
              <th className="px-4 py-3 text-xs text-left">วัน/เวลา</th>
              <th className="px-4 py-3 text-xs text-left">ระดับ</th>
              <th className="px-4 py-3 text-xs text-left">สถานะ</th>
              <th className="px-4 py-3 text-xs text-left">แหล่ง</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {incidents.map((incident) => (
              <IncidentRow key={incident.id} incident={incident} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
