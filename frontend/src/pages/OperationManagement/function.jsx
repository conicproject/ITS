import GenericFunction from "../../components/ui/GenericFunction";

function OperationManagementFunction() {
  const items = [
    { name: "Sequence", icon: "/assets/function_icon/management_function/management_4.png", path: "/operation-management/function/sequence" }
  ];

  return (
    <GenericFunction title="Operation Management Function" items={items} />
  );
}

export default OperationManagementFunction;
