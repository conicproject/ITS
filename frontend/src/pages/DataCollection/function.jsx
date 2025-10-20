import GenericFunctionPage from "../../components/GenericFunctionPage";

function DataCollectionFunction() {
  const items = [
    { name: "DataCollection_1", icon: "/icons/license.png" },
    { name: "DataCollection_2", icon: "/icons/camera.png" },
    { name: "DataCollection_3", icon: "/icons/map.png" },
    { name: "DataCollection_4", icon: "/icons/report.png" },
  ];

  return (
    <GenericFunctionPage title="Data Collection Function" items={items} />
  );
}

export default DataCollectionFunction;
