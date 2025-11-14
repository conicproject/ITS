import GenericFunctionPage from "../../components/GenericFunctionPage";

function DataCollectionFunction() {
  const items = [
    { name: "DataCollection_1", icon: "/assets/icons/icon-cross.png" },
    { name: "DataCollection_2", icon: "/assets/icons/icon-cross.png" },
    { name: "DataCollection_3", icon: "/assets/icons/icon-cross.png" },
    { name: "DataCollection_4", icon: "/assets/icons/icon-cross.png" },
  ];

  return (
    <GenericFunctionPage title="Data Collection Function" items={items} />
  );
}

export default DataCollectionFunction;
