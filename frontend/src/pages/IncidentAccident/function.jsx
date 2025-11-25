import GenericFunction from "../../components/ui/GenericFunction";

function IncidentAccidentFunction() {
  const items = [
    { name: "อุบัติเหตุการเกี่ยวข้องกับยานพาหนะ", icon: "/assets/icons/icon-cross.png", path: "/incident-accident/function/relate-accident" },
    { name: "สิ่งกีดขวางบนถนน", icon: "/assets/icons/icon-cross.png", path: "/incident-accident/function/road-obstruction" },
    { name: "เหตุการณ์อันตรายพิเศษ", icon: "/assets/icons/icon-cross.png", path: "/incident-accident/function/hazardous-incident" },
    { name: "ความผิดปกติของถนนและระบบกำกับจราจร", icon: "/assets/icons/icon-cross.png", path: "/incident-accident/function/irregularitie" },
    { name: "เหตุการณ์พิเศษจากกิจกรรมมนุษย์", icon: "/assets/icons/icon-cross.png", path: "/incident-accident/function/special-event" }
  ];

  return (
    <GenericFunction title="Incident & Accident Function" items={items} />
  );
}

export default IncidentAccidentFunction;
