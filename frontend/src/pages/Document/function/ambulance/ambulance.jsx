import GenericFunction from "../../../../components/ui/GenericFunction";

function AmbulanceFunction() {
  const items = [
    { name: "Ambulancelist", icon: "/assets/function_icon/incident_function/incident_1.png", path: "/document/function/detect-ambulance" },
    { name: "Manage Ambulance", icon: "/assets/function_icon/incident_function/incident_2.png", path: "/document/function/manage-ambulance" },
  ];

  return (
    <GenericFunction title="Ambulance Function" items={items} />
  );
}

export default AmbulanceFunction;
