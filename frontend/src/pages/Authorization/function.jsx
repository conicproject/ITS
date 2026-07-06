import GenericFunction from "../../components/ui/GenericFunction";

function AuthorizationFunction() {
  const items = [
    {
      name: "Blacklist",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="34"
          height="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l8 3.2v5.3c0 4.9-3.3 8.6-8 9.9-4.7-1.3-8-5-8-9.9V6.2z" />
          <path d="M9 11.6l2.2 2.2L15.4 9.5" />
        </svg>
      ),
      path: "/authorization/function/blacklist-function",
    },
    {
      name: "Greenlist",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="34"
          height="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.3l2.6 2.6L16 9.5" />
        </svg>
      ),
      path: "/authorization/function/greenlist-function",
    },
    {
      name: "Tax",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="34"
          height="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="M3.5 9.5h17M8 14.5l8-3M9 13.2v.1M15 16.8v.1" />
        </svg>
      ),
      path: "/authorization/function/tax-function",
    },
    {
      name: "Ambulance",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="34"
          height="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 16V8a2 2 0 0 1 2-2h8l5 5h1a2 2 0 0 1 2 2v3M3 16h18M6.5 19a1.8 1.8 0 1 0 0-3.6M17.5 19a1.8 1.8 0 1 0 0-3.6M9 9v4M7 11h4" />
        </svg>
      ),
      path: "/authorization/function/ambulance-function",
    },
    {
      name: "VIP",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="34"
          height="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9 6.75 19.4l1-5.85L3.5 9.4l5.9-.85z" />
        </svg>
      ),
      path: "/authorization/function/vip-function",
    },
  ];

  return <GenericFunction title="Authorization" items={items} />;
}

export default AuthorizationFunction;