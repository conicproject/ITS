import GenericFunctionPage from "../../components/GenericFunctionPage";

function OperationManagementFunction() {
  const items = [
    { name: "OperationManagem_1", icon: "/icons/license.png" },
    { name: "OperationManagem_2", icon: "/icons/camera.png" },
    { name: "OperationManagem_3", icon: "/icons/map.png" },
    { name: "OperationManagem_4", icon: "/icons/report.png" },
  ];

  return (
    <GenericFunctionPage
      title="Operation Management Function"
      items={items}
    />
  );
}

export default OperationManagementFunction;
