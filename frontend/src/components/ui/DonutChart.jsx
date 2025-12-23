// frontend/src/components/ui/DonutChart.jsx
import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export const DonutChart = ({
  height,
  headerShow,
  btnShow,
  textChart,
  btnChart,
  dataChart,
  point,
}) => {
  const [width, setWidth] = useState("150");

  useEffect(() => {
    // แก้ขนาด chart หลัง mount
    const timer = setTimeout(() => setWidth("100%"), 500);
    return () => clearTimeout(timer);
  }, []);

  const setSeries = dataChart?.series || [];
  const setOptions = dataChart?.options || {};

  const setNestChart = () => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(80),
        innerRadius: am5.percent(10),
      })
    );

    // Outer series
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "sales",
        categoryField: "country",
      })
    );

    series.get("colors").set("colors", [am5.color(0x0ff000), am5.color(0xf0000f)]);

    series.data.setAll([
      { country: "France", sales: 100000 },
      { country: "Spain", sales: 160000 },
    ]);

    series.slices.template.setAll({ stroke: am5.color(0xffffff), strokeWidth: 2 });
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    // Inner series
    let series2 = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series2",
        valueField: "sales",
        categoryField: "country",
        alignLabels: false,
      })
    );

    series2.get("colors").set("colors", [
      am5.color(0x00f0dc),
      am5.color(0x087f8c),
      am5.color(0x5aaa95),
      am5.color(0x86a873),
      am5.color(0xbb9f06),
    ]);

    series2.data.setAll([
      { country: "รถจักรยานยนต์", sales: 60000 },
      { country: "รถบรรทุก", sales: 60000 },
      { country: "รถยนต์ส่วนบุคคล", sales: 120000 },
      { country: "รถโดยสาร", sales: 90000 },
      { country: "รถบรรทุกขนาดเล็ก", sales: 60000 },
      { country: "รถตู้", sales: 60000 },
      { country: "รถ SUV", sales: 120000 },
      { country: "รถสามล้อเครื่อง", sales: 90000 },
    ]);

    series2.slices.template.setAll({ stroke: am5.color(0xffffff), strokeWidth: 2 });
    series2.labels.template.setAll({
      fontSize: 12,
      text: "{category}",
      textType: "adjusted",
      radius: 10,
    });
  };

  return (
    <div>
      <div>
        {headerShow === "all" && <span>ประเภทยานพาหนะ</span>}
        {headerShow === "violate" && (
          <span>ประเภทยานพาหนะที่ฝ่าฝืนสัญญาณไฟจราจรทางข้ามชนิดปุ่มกด</span>
        )}
      </div>

      {headerShow === false ? (
        <ApexCharts
          type="donut"
          width={width}
          height={height}
          series={setSeries}
          options={setOptions}
        />
      ) : (
        <ApexCharts
          type="donut"
          width={width}
          height={height}
          series={setSeries}
          options={setOptions}
        />
      )}

      {/* Div สำหรับ nested chart ของ amCharts */}
      {headerShow === "violate" && <div id="chartdiv" style={{ width: "100%", height: "16em", paddingTop: "5%" }} />}
    </div>
  );
};