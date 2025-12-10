// frontend/src/components/IncidentTable.jsx
import React from "react";
import { FaEye, FaVideo } from "react-icons/fa";

function IncidentTable({ 
  incidents, 
  selectedSort, 
  setSelectedSort, 
  selectedStatus, 
  setSelectedStatus,
  currentPage,
  setCurrentPage,
  showVehicleColumn = true 
}) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Severe":
        return "bg-red-100 text-red-700";
      case "Moderate":
        return "bg-yellow-100 text-yellow-700";
      case "Minor":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return "bg-yellow-400 text-gray-900";
      case "New":
        return "bg-blue-400 text-white";
      case "Closed":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex gap-2">
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>ล่าสุด</option>
            <option>เก่าสุด</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>ทั้งหมด</option>
            <option>Verified</option>
            <option>New</option>
            <option>Closed</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">แสดง 50 รายการ</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">รหัส</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ประเภทเหตุการณ์</th>
              {showVehicleColumn && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ประเภทรถ</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">สถานที่</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">วัน/เวลา</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ระดับ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">สถานะ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">แหล่งที่มา</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{incident.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{incident.type}</td>
                {showVehicleColumn && (
                  <td className="px-4 py-3 text-sm text-gray-700">{incident.vehicle}</td>
                )}
                <td className="px-4 py-3 text-sm text-gray-700">{incident.location}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{incident.datetime}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {incident.cctv && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700">CCTV</span>
                      <FaVideo size={14} className="text-red-500" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">แสดง 1 จาก 5,100 รายการทั้งหมด</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">2</button>
          <span className="px-2">...</span>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">5</button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncidentTable;