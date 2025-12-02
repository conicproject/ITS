import GenericFunction from "../../components/ui/GenericFunction";

function DataCollectionFunction() {
  const items = [
    { name: "ค้นหาป้ายยานพาหนะ", icon: "/assets/icons/icon-report.png", path: "/data-collection/function/license-plate-search" },
    { name: "จุดติดตั้ง", icon: "/assets/icons/icon-report.png", path: "/data-collection/function/installation-point" },
    { name: "วิเคราะห์เส้นทาง", icon: "/assets/icons/icon-report.png", path: "/data-collection/function/route-analysis" },
    { name: "รายงาน", icon: "/assets/icons/icon-report.png", path: "/data-collection/function/vehicle-report" }
  ];

  return (
    <GenericFunction title="Data Collection Function" items={items} />
  );
}

export default DataCollectionFunction;
