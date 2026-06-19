import GenericFunction from "../../../../components/ui/GenericFunction";

function BlacklistFunction() {
  const items = [
    { name: "Blacklist", icon: "/assets/function_icon/incident_function/incident_1.png", path: "/document/function/detect-blacklist" },
    { name: "Manage Blacklist", icon: "/assets/function_icon/incident_function/incident_2.png", path: "/document/function/manage-blacklist" },
  ];

  return (
    <GenericFunction title="Blacklist Function" items={items} />
  );
}

export default BlacklistFunction;
