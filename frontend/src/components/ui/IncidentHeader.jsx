// frontend/src/components/IncidentHeader.jsx
import React from "react";
import { FaExclamationTriangle, FaDownload, FaPlus } from "react-icons/fa";

function IncidentHeader({ 
  title, 
  subtitle,
  onExport,
  onAddIncident,
  exportText = "Export Excel", // เพิ่ม Default props
  addText = "แจ้งเหตุอุบัติเหตุ"
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Title Section */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 text-white p-3 rounded-xl shadow-md shrink-0">
            <FaExclamationTriangle size={20} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full md:w-auto gap-3">
          {onExport && (
            <button 
              onClick={onExport}
              className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors bg-white shadow-sm"
            >
              <FaDownload size={14} className="text-gray-500" />
              {exportText}
            </button>
          )}
          
          {onAddIncident && (
            <button 
              onClick={onAddIncident}
              className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              <FaPlus size={14} />
              {addText}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default IncidentHeader;