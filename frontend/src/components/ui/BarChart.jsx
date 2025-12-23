import React, { useRef, useState, useEffect } from 'react';
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
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const width = container.offsetWidth;
      if (width > 0) setContainerWidth(width);
    };

    updateSize();
    requestAnimationFrame(updateSize);

    const observer = new ResizeObserver(() => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(updateSize, 50);
    });

    observer.observe(container);

    const handleWindowResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(updateSize, 50);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  const defaultSeries = [
    { name: 'จำนวนรถ(คัน)', type: 'column', data: data.map(d => d.vehicles || d.value || 0) },
    { name: 'ความเร็วเฉลี่ย(Km/H)', type: 'line', data: data.map(d => d.speed || d.average || 0) }
  ];

  const series = seriesConfig.length > 0 ? seriesConfig : defaultSeries;

  const defaultChartOptions = {
    chart: {
      type: 'line',
      height,
      toolbar: { show: false },
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 400,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    stroke: { width: [0, 2], curve: 'smooth' },
    plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
    colors,
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map(d => d.hour || d.label || d.time || ''),
      labels: { style: { fontSize: '11px' }, rotate: 0, rotateAlways: false, hideOverlappingLabels: true, ...xAxisConfig.labels },
      tickPlacement: 'on',
      axisBorder: { show: true },
      axisTicks: { show: true },
      ...xAxisConfig
    },
    yaxis: yAxisConfig.length > 0 ? yAxisConfig : [
      { title: { text: 'จำนวนรถ (คัน)' }, labels: { style: { fontSize: '11px' } } },
      { opposite: true, title: { text: 'ความเร็ว (Km/H)' }, labels: { style: { fontSize: '11px' } } }
    ],
    legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '12px', markers: { radius: 2 }, ...legendConfig },
    grid: { borderColor: '#f0f0f0', strokeDashArray: 3, padding: { left: 10, right: 10, top: 0, bottom: 0 }, ...gridConfig },
    states: { hover: { filter: { type: 'lighten', value: 0.04 } } },
    ...customOptions
  };

  return (
    <div ref={containerRef} className="bg-white rounded-lg shadow-sm p-4">
      {showTitle && title && <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>}
      <div className="w-full overflow-hidden">
        {containerWidth && (
          <ApexCharts
            options={defaultChartOptions}
            series={series}
            type="line"
            height={height}
            width={containerWidth}
          />
        )}
      </div>
    </div>
  );
};

export default BarChart;
