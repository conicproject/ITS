import GenericFunctionPage from "../../components/GenericFunctionPage";

function OperationManagementFunction() {
  const items = [
    { name: "OperationManagem_1", icon: "/assets/icons/icon-cross.png" },
    { name: "OperationManagem_2", icon: "/assets/icons/icon-cross.png" },
    { name: "OperationManagem_3", icon: "/assets/icons/icon-cross.png" },
    { name: "OperationManagem_4", icon: "/assets/icons/icon-cross.png" },
  ];

  return (
    <GenericFunctionPage
      title="Operation Management Function"
      items={items}
    />
  );
}

export default OperationManagementFunction;
