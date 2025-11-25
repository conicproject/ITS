import GenericFunction from "../../components/ui/GenericFunction";

function OperationManagementFunction() {
  const items = [
    { name: "สัญญาณไฟจราจร", icon: "/assets/icons/icon-cross.png", path: "/operation-management/function/traffic-signal" },
    { name: "Ambulance", icon: "/assets/icons/icon-cross.png", path: "/operation-management/function/ambulance" },
    { name: "V.I.P", icon: "/assets/icons/icon-cross.png", path: "/operation-management/function/vip" },
    { name: "Sequence", icon: "/assets/icons/icon-cross.png", path: "/operation-management/function/sequence" }
  ];

  return (
    <GenericFunction title="Operation Management Function" items={items} />
  );
}

export default OperationManagementFunction;
