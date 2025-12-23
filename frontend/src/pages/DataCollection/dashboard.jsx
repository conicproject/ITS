// frontend/src/pages/DataCollectionDashboard.jsx
import React, { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { BarChart } from "../../components/ui/BarChart";

const DataCollectionDashboard = () => {
  // ข้อมูลสำหรับ BarChart Component
  const trafficData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    vehicles: [10, 8, 5, 7, 18, 60, 82, 72, 65, 50, 48, 45, 42, 38, 45, 68, 82, 72, 60, 45, 32, 20, 15, 18][i],
    speed: [65, 68, 66, 64, 62, 58, 48, 42, 38, 36, 35, 38, 42, 45, 48, 52, 55, 58, 60, 62, 61, 63, 65, 68][i]
  }));

  // Config สำหรับ BarChart
  const barChartConfig = {
    seriesConfig: [
      {
        name: 'จำนวนรถเคริ่ม',
        type: 'column',
        data: trafficData.map(d => d.vehicles)
      },
      {
        name: 'การนเคริ่ถดำนต์(ค้นที่ห้น้า)',
        type: 'line',
        data: trafficData.map(d => d.speed)
      }
    ],
    colors: ['#A78BFA', '#FF6B6B'],
    customOptions: {
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          style: {
            fontSize: '11px'
          }
        }
      }
    },
    legendConfig: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '12px'
    }
  };

  // Initialize Pie Chart with amCharts
  useEffect(() => {
    let root = am5.Root.new("pieChartDiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false
      })
    );

    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    let data = [
      { category: "จักรยาน-มอเตอร์ไซค์-สามล้อ", value: 30, color: am5.color(0xFF6B6B) },
      { category: "รถเก๋ง-กระบะ-วินแอนด์ปิคอัพ", value: 35, color: am5.color(0x4ECDC4) },
      { category: "รถบัส-สามวง-รถบัสใหญ่", value: 15, color: am5.color(0x95E1D3) },
      { category: "สามหารบ่วน-รถบดถา-ราง", value: 15, color: am5.color(0xA78BFA) },
      { category: "อื่นเทาอื่น", value: 5, color: am5.color(0xF38181) }
    ];

    series.data.setAll(data);

    series.slices.template.adapters.add("fill", function(fill, target) {
      return target.dataItem.dataContext.color;
    });

    let label = chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: "525",
        fontSize: 32,
        fontWeight: "bold",
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        fill: am5.color(0x1F2937)
      })
    );

    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  const vehicleTypes = [
    { name: 'จักรยาน-มอเตอร์ไซค์-สามล้อ', color: '#FF6B6B' },
    { name: 'รถเก๋ง-กระบะ-วินแอนด์ปิคอัพ', color: '#4ECDC4' },
    { name: 'รถบัส-สามวง-รถบัสใหญ่', color: '#95E1D3' },
    { name: 'สามหารบ่วน-รถบดถา-ราง', color: '#A78BFA' },
    { name: 'อื่นเทาอื่น', color: '#F38181' }
  ];

  const alerts = [
    {
      id: 1,
      type: 'เตือน',
      location: 'ม่อนนนัฐม่อเนร - ร้ต-พ798',
      position: 'แขนปลัดำม ตลอดอุ่วาท',
      time: '27/06/2568, 14:12น.',
      severity: 'warning'
    },
    {
      id: 2,
      type: 'ความเอื่อนเด็กกล้อม',
      location: 'ม่อนนนัฐม่อเนร - ร้ต-1234',
      position: 'ตลอดอุ่วาท',
      time: '27/06/2568, 14:12น.',
      severity: 'danger',
      note: 'พอร์ต์ชี่48 หยุดน์ เลข่อนอินเต้อร์เนทและหวอ่ม'
    },
    {
      id: 3,
      type: 'เตือน',
      location: 'ม่อนนนัฐม่อเนร - ร้ต-พ785',
      position: 'แขนปลัดำม ตลอดอุ่วาท',
      time: '27/06/2568, 14:12น.',
      severity: 'warning'
    }
  ];

  return (
    <div className="fix-function-page-y-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 text-3xl">💾</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Traffic Data Collection</h1>
            <p className="text-sm text-gray-500">การโปรแมรมนับข้อมูลจราจร</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">14:20:39</div>
          <div className="text-sm text-gray-500">วันจันทร์ที่ 23 มิถุนายน 2568</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-b-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">🚗</div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">2,547</div>
          <div className="text-sm text-gray-600 mb-1">ยานพาหนะทั้งหมด</div>
          <div className="text-xs text-blue-600">↗ +12% จากเมื่อสต้น</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-b-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">📷</div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">23/24</div>
          <div className="text-sm text-gray-600 mb-1">กล้องทีี่ใช้งาน</div>
          <div className="text-xs text-green-600">95.8% ออนสถถอนออนทำม</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-b-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">🛡️</div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">89</div>
          <div className="text-sm text-gray-600 mb-1">การช้ำใช้วันนี้</div>
          <div className="text-xs text-red-600">ช้องข้อตม้า</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* BarChart Component - แทนที่ ApexCharts เดิม */}
        <div className="lg:col-span-2">
          <BarChart
            data={trafficData}
            height={350}
            title="📊 ปริมาณจราจรแบบเรียลไทม์"
            showTitle={true}
            seriesConfig={barChartConfig.seriesConfig}
            colors={barChartConfig.colors}
            customOptions={barChartConfig.customOptions}
            legendConfig={barChartConfig.legendConfig}
          />
        </div>

        {/* amCharts - Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📈 สถานะเสื้อง
          </h2>
          <div className="flex flex-col items-center">
            <div id="pieChartDiv" style={{ width: '100%', height: '200px' }}></div>
            <div className="mt-4 space-y-2 w-full text-xs">
              {vehicleTypes.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            การช้ำใช้จราจร
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'danger' 
                    ? 'bg-yellow-50 border-yellow-500' 
                    : 'bg-orange-50 border-orange-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-xl mt-1 ${
                    alert.severity === 'danger' ? 'text-yellow-600' : 'text-orange-500'
                  }`}>⚠️</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        alert.severity === 'danger' 
                          ? 'bg-yellow-200 text-yellow-800' 
                          : 'bg-orange-200 text-orange-800'
                      }`}>
                        {alert.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      🚗 {alert.location}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>📍 {alert.position}</span>
                      <span>🕐 {alert.time}</span>
                    </div>
                    {alert.note && (
                      <div className="mt-2 text-xs text-gray-700 bg-yellow-100 p-2 rounded">
                        {alert.note}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📊 สถานะเสื้อง
          </h2>
          <div className="space-y-3">
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-700">24</div>
              <div className="text-sm text-green-600">ทีส้อง</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-700">1</div>
              <div className="text-sm text-blue-600">ช้อแมแดน</div>
            </div>
            <div className="bg-orange-100 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-700">5</div>
              <div className="text-sm text-orange-600">ช้อแมแดนสำเร็จ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionDashboard;