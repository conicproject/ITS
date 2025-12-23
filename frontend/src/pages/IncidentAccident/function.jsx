import GenericFunction from "../../components/ui/GenericFunction";

function IncidentAccidentFunction() {
  const items = [
    { name: "อุบัติเหตุการเกี่ยวข้อง \nกับยานพาหนะ", icon: "/assets/function_icon/incident_function/incident_1.png", path: "/incident-accident/function/relate-accident" },
    { name: "สิ่งกีดขวางบนถนน", icon: "/assets/function_icon/incident_function/incident_2.png", path: "/incident-accident/function/road-obstruction" },
    { name: "เหตุการณ์อันตรายพิเศษ", icon: "/assets/function_icon/incident_function/incident_3.png", path: "/incident-accident/function/hazardous-incident" },
    { name: "ความผิดปกติของถนน \nและระบบกำกับจราจร", icon: "/assets/function_icon/incident_function/incident_4.png", path: "/incident-accident/function/irregularitie" },
    { name: "เหตุการณ์พิเศษ \nจากกิจกรรมมนุษย์", icon: "/assets/function_icon/incident_function/incident_5.png", path: "/incident-accident/function/special-event" }
  ];

  return (
    <GenericFunction title="Incident & Accident Function" items={items} />
  );
}

export default IncidentAccidentFunction;
