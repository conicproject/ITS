import GenericFunction from "../../../../components/ui/GenericFunction";

function BlacklistFunction() {
  const items = [
    {
      name: "Blacklist",
      icon: (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="7" width="15" height="9" rx="2" />
          <path d="M6 10.5h2M6 13h4" />
          <circle cx="17" cy="16" r="3.5" />
          <path d="M19.6 18.6L22 21" />
        </svg>
      ),
      path: "/authorization/function/detect-blacklist",
    },
    {
      name: "Manage Blacklist",
      icon: (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8.5l13-3.5 1 3.5-13 3.5z" />
          <path d="M16.5 6.2l3.5-1 .8 2.8-3.5 1" />
          <path d="M5 12v5M5 20h6M11 17a6 6 0 0 1 6-3" />
          <circle cx="18.5" cy="16.5" r="2.2" />
        </svg>
      ),
      path: "/authorization/function/manage-blacklist",
    }
  ]
  return (
    <GenericFunction title="Blacklist Function" items={items} />
  );
}

export default BlacklistFunction;
