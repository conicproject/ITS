// frontend/src/pages/Enforcement/function.jsx
import GenericFunctionPage from "../../components/GenericFunctionPage";

function EnforcementFunction() {
  const items = [
    { name: "รายงานข้อมูลจราจร", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/report-vehicle" },
    { name: "Enforcement_2", icon: "/assets/icons/icon-cross.png" },
    { name: "Enforcement_3", icon: "/assets/icons/icon-cross.png" },
    { name: "Enforcement_4", icon: "/assets/icons/icon-cross.png" },
  ];

  return <GenericFunctionPage title="Enforcement Function" items={items} />;
}

export default EnforcementFunction;
