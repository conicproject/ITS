// frontend/src/components/ui/BarChart.jsx
import React from 'react';
import ApexCharts from 'react-apexcharts';

export const BarChart = ({ 
  data = [], 
  height = 350,
  title = "",
  showTitle = true,
  seriesConfig = [],
  colors = ['#8B5CF6', '#EF4444'],
  xAxisConfig = {},
  yAxisConfig = [],
  legendConfig = {},
  gridConfig = {},
  customOptions = {}
}) => {
  // ตั้งค่า default series ถ้าไม่มีการส่งมา
  const defaultSeries = [
    {
      name: 'จำนวนรถ(คัน)',
      type: 'column',
      data: data.map(d => d.vehicles || d.value || 0)
    },
    {
      name: 'ความเร็วเฉลี่ย(Km/H)',
      type: 'line',
      data: data.map(d => d.speed || d.average || 0)
    }
  ];

  // ใช้ seriesConfig ที่ส่งมา หรือใช้ default
  const series = seriesConfig.length > 0 ? seriesConfig : defaultSeries;

  // ตั้งค่า default options
  const defaultChartOptions = {
    chart: {
      type: 'line',
      height: height,
      toolbar: { show: false },
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    stroke: {
      width: [0, 2],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4,
        distributed: false
      }
    },
    colors: colors,
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: data.map(d => d.hour || d.label || d.time || ''),
      labels: { 
        style: { fontSize: '11px' },
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
        ...xAxisConfig.labels
      },
      tickPlacement: 'on',
      axisBorder: { show: true },
      axisTicks: { show: true },
      ...xAxisConfig
    },
    yaxis: yAxisConfig.length > 0 ? yAxisConfig : [
      {
        title: { text: 'จำนวนรถ (คัน)' },
        labels: { style: { fontSize: '11px' } }
      },
      {
        opposite: true,
        title: { text: 'ความเร็ว (Km/H)' },
        labels: { style: { fontSize: '11px' } }
      }
    ],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: { radius: 2 },
      ...legendConfig
    },
    grid: {
      borderColor: '#f0f0f0',
      strokeDashArray: 3,
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 0
      },
      ...gridConfig
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.04
        }
      }
    },
    // รวม custom options ที่ส่งมา
    ...customOptions
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {showTitle && title && (
        <h3 className="font-semibold text-gray-800 mb-4">
          {title}
        </h3>
      )}
      <div className="w-full overflow-hidden">
        <ApexCharts
          options={defaultChartOptions}
          series={series}
          type="line"
          height={height}
          width="100%"
        />
      </div>
    </div>
  );
};

export default BarChart;