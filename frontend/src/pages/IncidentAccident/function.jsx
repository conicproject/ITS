import GenericFunctionPage from "../../components/GenericFunctionPage";

function IncidentAccidentFunction() {
  const items = [
    { name: "IncidentAccident_1", icon: "/assets/icons/icon-cross.png" },
    { name: "IncidentAccident_2", icon: "/assets/icons/icon-cross.png" },
    { name: "IncidentAccident_3", iicon: "/assets/icons/icon-cross.png" },
    { name: "IncidentAccident_4", icon: "/assets/icons/icon-cross.png" },
  ];

  return (
    <GenericFunctionPage
      title="Incident & Accident Function"
      items={items}
    />
  );
}

export default IncidentAccidentFunction;
