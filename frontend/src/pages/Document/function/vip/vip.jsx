import GenericFunction from "../../../../components/ui/GenericFunction";

function VipFunction() {
  const items = [
    { name: "VIP", icon: "/assets/function_icon/incident_function/incident_1.png", path: "/document/function/detect-vip" },
    { name: "Manage VIP", icon: "/assets/function_icon/incident_function/incident_2.png", path: "/document/function/manage-vip" },
  ];

  return (
    <GenericFunction title="VIP Function" items={items} />
  );
}

export default VipFunction;
