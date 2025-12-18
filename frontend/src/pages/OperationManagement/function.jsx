import GenericFunction from "../../components/ui/GenericFunction";

function OperationManagementFunction() {
  const items = [
    { name: "ระบบตรวจจับความหนาแน่น \nของการจราจร", icon: "/assets/function_icon/management_function/management_1.png", path: "/operation-management/function/traffic-signal" },
    { name: "Ambulance", icon: "/assets/function_icon/management_function/management_2.png", path: "/operation-management/function/ambulance" },
    { name: "V.I.P", icon: "/assets/function_icon/management_function/management_3.png", path: "/operation-management/function/vip" },
    { name: "Sequence", icon: "/assets/function_icon/management_function/management_4.png", path: "/operation-management/function/sequence" }
  ];

  return (
    <GenericFunction title="Operation Management Function" items={items} />
  );
}

export default OperationManagementFunction;
