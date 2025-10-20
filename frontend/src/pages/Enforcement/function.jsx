import GenericFunctionPage from "../../components/GenericFunctionPage";

function EnforcementFunction() {
  const items = [
    { name: "Enforcement_1", icon: "/icons/license.png" },
    { name: "Enforcement_2", icon: "/icons/camera.png" },
    { name: "Enforcement_3", icon: "/icons/map.png" },
    { name: "Enforcement_4", icon: "/icons/report.png" },
  ];

  return <GenericFunctionPage title="Enforcement Function" items={items} />;
}

export default EnforcementFunction;
