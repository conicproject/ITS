// frontend/src/pages/RouteAnalysis.jsx
import React, { useState } from 'react';
import { FaSearch, FaTruck, FaClock, FaMapMarkerAlt, FaChartLine } from 'react-icons/fa';
import { Filter } from '../../../components/ui/Filter';
import { DonutChart } from '../../../components/ui/DonutChart';
import { BarChart } from '../../../components/ui/BarChart';

const RouteCard = ({ route, time, distance, speed, toll, violations, isHighlighted }) => (
  <div className={`border rounded-lg p-4 mb-3 ${isHighlighted ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}>
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-800">{route}</h3>
          {isHighlighted && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">เกิน</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaClock className="w-4 h-4" />
            <span>ระยะทาง: <strong className="text-gray-800">{distance} กม.</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="w-4 h-4" />
            <span>ช่วงเวลา: <strong className="text-gray-800">{time}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <FaChartLine className="w-4 h-4" />
            <span>ความเร็วเฉลี่ย: <strong className="text-gray-800">{speed} กม.</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="w-4 h-4" />
            <span>ด่านค่าทางผ่าน: <strong className="text-gray-800">{toll}</strong></span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-600">ปริมาณรถ:</div>
        <div className="text-2xl font-bold text-gray-800">{violations} <span className="text-base">คันรถ</span></div>
      </div>
    </div>
    <div className="text-xs text-gray-500">
      ต้นทาง: {route.split(' → ')[0]} → ปลายทาง: {route.split(' → ')[1]}
    </div>
  </div>
);

const PerformanceCard = ({ title, avgSpeed, time }) => {
  const getSpeedColor = (speed) => {
    if (speed <= 40) return 'bg-orange-500';
    if (speed <= 60) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getProgressWidth = (speed) => {
    return Math.min((speed / 100) * 100, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FaChartLine className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">ความเร็วเฉลี่ย:</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{avgSpeed} Km/h.</div>
        </div>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getSpeedColor(avgSpeed)}`} 
            style={{ width: `${getProgressWidth(avgSpeed)}%` }}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FaClock className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">ความล่าช้า:</span>
        </div>
        <div className="text-xl font-bold text-gray-800">{time} นาที</div>
      </div>
    </div>
  );
};

function RouteAnalysis() {
  const [searchFilters, setSearchFilters] = useState(null);

  const handleSearch = (filters) => {
    console.log('Search filters:', filters);
    setSearchFilters(filters);
    // TODO: เรียก API เพื่อดึงข้อมูลตาม filters
  };

  const routes = [
    { 
      route: 'รังสิต → อโศก', 
      time: '17:30 - 19:00', 
      distance: '12.5', 
      speed: '8,450', 
      toll: '17:30 - 19:00', 
      violations: '3', 
      isHighlighted: true 
    },
    { 
      route: 'สีลม → สะพานพระราม 6', 
      time: '08:00 - 09:30', 
      distance: '8.2', 
      speed: '6,240', 
      toll: '08:00 - 09:30', 
      violations: '2', 
      isHighlighted: false 
    }
  ];

  // ข้อมูลสำหรับ Donut Chart
  const donutChartData = {
    series: [1090, 3890, 8450, 8350, 5680, 6240],
    options: {
      chart: {
        type: 'donut',
        height: 300
      },
      labels: [
        'รังสิต → อโศก',
        'พระราม 6 → ประตูน้ำ',
        'สะพานพระราม 6',
        'อโศก → สถาบัน',
        'อโศก → อุทัย',
        'รังสิต → จันทร์'
      ],
      colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'],
      legend: {
        position: 'bottom',
        fontSize: '12px'
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(1) + "%"
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      }
    }
  };

  // ข้อมูลสำหรับ Bar Chart
  const barData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    vehicles: Math.floor(Math.random() * 60) + 10,
    speed: Math.floor(Math.random() * 30) + 40
  }));

  return (
    <div className="fix-function-page-y-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaSearch className="w-6 h-6" />
          ค้นหาเส้นทาง
        </h1>

        {/* ใช้ Filter Component ที่มีอยู่แล้ว */}
        <Filter type="route" onSearch={handleSearch} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* รายการเส้นทาง */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTruck className="w-5 h-5" />
                เส้นทางของยานพาหนะ
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {routes.map((route, index) => (
                  <RouteCard key={index} {...route} />
                ))}
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">วิเคราะห์เส้นทาง</h3>
            <DonutChart 
              height={300}
              headerShow={false}
              dataChart={donutChartData}
            />
          </div>
        </div>

        {/* Bar Chart - ใช้ BarChart Component */}
        <div className="mb-6">
          <BarChart 
            data={barData}
            height={300}
            title="📊 ปริมาณรถตามเวลา"
            showTitle={true}
            colors={['#8B5CF6', '#EF4444']}
          />
        </div>

        {/* Performance Cards */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="w-5 h-5" />
            ประสิทธิภาพเส้นทาง
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PerformanceCard title="รังสิต → อโศก" avgSpeed={25} time={8.5} />
            <PerformanceCard title="พระราม6-ประตูน้ำ" avgSpeed={80} time={2} />
            <PerformanceCard title="สีลม-พระราม6" avgSpeed={40} time={6} />
            <PerformanceCard title="อโศก-สุขุมวิท" avgSpeed={15} time={15} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteAnalysis;