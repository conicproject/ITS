import GenericFunction from "../../../../components/ui/GenericFunction";

function GreenlistFunction() {
  const items = [
    { name: "Greenlist", icon: "/assets/function_icon/incident_function/incident_1.png", path: "/document/function/detect-greenlist" },
    { name: "Manage Greenlist", icon: "/assets/function_icon/incident_function/incident_2.png", path: "/document/function/manage-greenlist" },
  ];

  return (
    <GenericFunction title="Greenlist Function" items={items} />
  );
}

export default GreenlistFunction;
