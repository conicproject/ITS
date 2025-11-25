import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../../../service/client"; // ปรับ path ตามโครงสร้างคุณ
import DonutChart from "../../../components/ui/DonutChart"; // React component ต้องตั้งตัวแรกเป็นตัวใหญ่

function DetailReportVehicle() {
  const location = useLocation();
  const { type, date, checkpoint, typeData } = location.state || {};

  const [dateReport, setDateReport] = useState("");
  const [textReport, setTextReport] = useState("");
  const [cat, setCat] = useState([]);
  const [dataIn, setDataIn] = useState([]);
  const [dataOut, setDataOut] = useState([]);
  const [carType, setCarType] = useState({});
  const [direction, setDirection] = useState([]);
  const [dataDonut, setDataDonut] = useState({});
  const [headerDonutChart, setHeaderDonutChart] = useState("all"); // เพิ่มตัวแปร header
  const [donutHeight, setDonutHeight] = useState(300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location.state) return;

    const fetchData = async () => {
      setLoading(true);
      const url = `/api/traffic-detail/${typeData}?type=${type}&date=${date}&checkpoint=${checkpoint}`;

      try {
        const response = await apiClient.get(url);

        if (response.status === 200) {
          const resData = response.data;

          setCarType(resData.car_type);
          setDataDonut(setDonutChart(resData.car_type));
          setDirection(resData.direction);

          const inboundData = resData.graph.inbound.map((item) => item.volume);
          const outboundData = resData.graph.outbound.map((item) => item.volume);
          const categories = resData.graph.inbound.map(
            (item) => item.time || item.date || item.month
          );

          setDataIn(inboundData);
          setDataOut(outboundData);
          setCat(categories);

          setFormatReport(resData.report, type, typeData);

          if (typeData === "1") {
            setNestChart(resData.car_type.volume, resData.graph_inside);
          }

          // กำหนด headerDonutChart
          setHeaderDonutChart(typeData === "0" ? "all" : "violate");

        } else {
          alert(response.data.message || "Error fetching data");
        }
      } catch (error) {
        console.error(error);
        alert("Cannot connect API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, date, checkpoint, typeData, location.state]);

  // Dummy chart/report functions (replace with your implementations)
  const setDonutChart = (carType) => ({
    series: carType?.volume?.map((item) => item.volume) || [],
    options: {
      labels: carType?.volume?.map((item) => item.car_type) || [],
    },
  });

  const setNestChart = (volume, graphInside) => { };
  const setFormatReport = (report, type, typeData) => { };

  if (!location.state) {
    return <p className="text-gray-500 p-4">ไม่มีข้อมูล</p>;
  }

  return (
    <div className="h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Detail Report Vehicle</h2>

      <div className="bg-white shadow rounded p-4 space-y-2">
        <p>
          <strong>ชนิดข้อมูล:</strong>{" "}
          {typeData === "0" ? "ข้อมูลจราจร" : "ข้อมูลยานพาหนะที่ฝ่าฝืนสัญญาณไฟ"}
        </p>
        <p><strong>ประเภท:</strong> {type}</p>
        <p><strong>วันที่/สัปดาห์/เดือน/ปี:</strong> {date}</p>
        <p><strong>Checkpoint:</strong> {checkpoint}</p>
      </div>

      {/* Render DonutChart เฉพาะเมื่อมี data */}
      {dataDonut.series && dataDonut.series.length > 0 && (
        <DonutChart
          dataChart={dataDonut}
          height={donutHeight}
          headerShow={headerDonutChart}
        />
      )}

      {loading && <p className="mt-4 text-gray-500">Loading data...</p>}
    </div>
  );
}

export default DetailReportVehicle;
