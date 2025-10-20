import GenericFunctionPage from "../../components/GenericFunctionPage";

function IncidentAccidentFunction() {
  const items = [
    { name: "IncidentAccident_1", icon: "/icons/license.png" },
    { name: "IncidentAccident_2", icon: "/icons/camera.png" },
    { name: "IncidentAccident_3", icon: "/icons/map.png" },
    { name: "IncidentAccident_4", icon: "/icons/report.png" },
  ];

  return (
    <GenericFunctionPage
      title="Incident & Accident Function"
      items={items}
    />
  );
}

export default IncidentAccidentFunction;
