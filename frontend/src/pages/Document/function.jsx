import GenericFunction from "../../components/ui/GenericFunction";

function DocumentFunction() {
  const items = [
    { name: "Blacklist", icon: "/assets/function_icon/incident_function/incident_1.png", path: "/document/function/blacklist-function" },
    { name: "Greenlist", icon: "/assets/function_icon/incident_function/incident_2.png", path: "/document/function/greenlist-function" },
    { name: "Tax", icon: "/assets/function_icon/incident_function/incident_3.png", path: "/document/function/tax-function" },
    { name: "Ambulance", icon: "/assets/function_icon/incident_function/incident_4.png", path: "/document/function/ambulance-function" },
    { name: "VIP", icon: "/assets/function_icon/incident_function/incident_5.png", path: "/document/function/vip-function" },
  ];

  return (
    <GenericFunction title="Document" items={items} />
  );
}

export default DocumentFunction;
