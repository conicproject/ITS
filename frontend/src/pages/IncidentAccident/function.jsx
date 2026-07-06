import GenericFunction from "../../components/ui/GenericFunction";

function IncidentAccidentFunction() {
  const items = [
    {
      name: "อุบัติเหตุการเกี่ยวข้อง\nบนท้องถนน",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="34"
          height="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l9 16H3z" />
          <path d="M12 10v4M12 16.5v.2" />
        </svg>
      ),
      path: "/incident-accident/function/relate-accident",
    },
    {
      name: "สิ่งกีดขวางบนถนน",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="34"
          height="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l9 16H3z" />
          <path d="M12 10v4M12 16.5v.2" />
        </svg>
      ),
      path: "/incident-accident/function/road-obstruction",
    },
  ];

  return (
    <GenericFunction
      title="Incident & Accident Function"
      items={items}
    />
  );
}

export default IncidentAccidentFunction;