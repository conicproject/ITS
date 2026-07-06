import GenericFunction from "../../../../components/ui/GenericFunction";

function TaxFunction() {
  const items = [
    { name: "Tax", icon: "/assets/function_icon/incident_function/incident_1.png", path: "/document/function/detect-tax" },
    { name: "Manage Tax", icon: "/assets/function_icon/incident_function/incident_2.png", path: "/document/function/manage-tax" },
  ];

  return (
    <GenericFunction title="Tax Function" items={items} />
  );
}

export default TaxFunction;
