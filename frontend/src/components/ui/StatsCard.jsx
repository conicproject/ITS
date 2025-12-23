// frontend/src/components/StatsCard.jsx
import React from "react";

function StatsCard({ stats }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">{stat.label}</div>
              <Icon className={stat.color} size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCard;