import GenericFunction from "../../components/ui/GenericFunction";

function OverviewFunction() {
  const items = [
    { name: "ค้นหาป้ายยานพาหนะ", icon: "/assets/function_icon/collection_function/collection_1.png", path: "/overview/function/license-plate-search" },
    { name: "จุดติดตั้ง", icon: "/assets/function_icon/collection_function/collection_2.png", path: "/overview/function/installation-point" },
  ];

  return (
    <GenericFunction title="Overview Function" items={items} />
  );
}

export default OverviewFunction;
