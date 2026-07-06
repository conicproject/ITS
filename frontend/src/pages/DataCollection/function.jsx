import GenericFunction from "../../components/ui/GenericFunction";

function DataCollectionFunction() {
  const items = [
    {
      name: "ระบบตรวจจับความหนาแน่น \nของการจราจร",
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
          <path d="M5 12l1.4-4.2A2 2 0 0 1 8.3 6.4h7.4a2 2 0 0 1 1.9 1.4L19 12M4 12h16v5H4z" />
          <circle cx="7.5" cy="14.5" r=".5" />
          <circle cx="16.5" cy="14.5" r=".5" />
        </svg>
      ),
      path: "/data-collection/function/traffic-signal",
    },
    {
      name: "รายงาน",
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
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v4h4M9 12h6M9 16h6" />
        </svg>
      ),
      path: "/data-collection/function/vehicle-report",
    },
  ];

  return (
    <GenericFunction
      title="Data Collection Function"
      items={items}
    />
  );
}

export default DataCollectionFunction;