// frontend/src/components/IncidentHeader.jsx
import React from "react";
import { FaExclamationTriangle, FaDownload } from "react-icons/fa";

function IncidentHeader({ 
  title, 
  subtitle,
  onExport,
  onAddIncident
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 text-white p-2 rounded-lg">
            <FaExclamationTriangle size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <FaDownload size={16} />
            Export Excel
          </button>
          <button 
            onClick={onAddIncident}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
          >
            + แจ้งเหตุอุบัติเหตุ
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncidentHeader;