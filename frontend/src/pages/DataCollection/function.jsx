import GenericFunction from "../../components/ui/GenericFunction";

function DataCollectionFunction() {
  const items = [
    { name: "ค้นหาป้ายยานพาหนะ", icon: "/assets/function_icon/collection_function/collection_1.png", path: "/data-collection/function/license-plate-search" },
    { name: "จุดติดตั้ง", icon: "/assets/function_icon/collection_function/collection_2.png", path: "/data-collection/function/installation-point" },
    { name: "วิเคราะห์เส้นทาง", icon: "/assets/function_icon/collection_function/collection_3.png", path: "/data-collection/function/route-analysis" },
    { name: "รายงาน", icon: "/assets/function_icon/collection_function/collection_4.png", path: "/data-collection/function/vehicle-report" }
  ];

  return (
    <GenericFunction title="Data Collection Function" items={items} />
  );
}

export default DataCollectionFunction;
