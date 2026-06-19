import GenericFunction from "../../components/ui/GenericFunction";

function DataCollectionFunction() {
  const items = [
    { name: "วิเคราะห์เส้นทาง", icon: "/assets/function_icon/collection_function/collection_3.png", path: "/data-collection/function/route-analysis" },
    { name: "ระบบตรวจจับความหนาแน่น \nของการจราจร", icon: "/assets/function_icon/management_function/management_1.png", path: "/data-collection/function/traffic-signal" },
    { name: "รายงาน", icon: "/assets/function_icon/collection_function/collection_4.png", path: "/data-collection/function/vehicle-report" },
  ];

  return (
    <GenericFunction title="Data Collection Function" items={items} />
  );
}

export default DataCollectionFunction;
