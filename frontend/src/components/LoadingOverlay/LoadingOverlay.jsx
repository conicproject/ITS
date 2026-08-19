import "./LoadingOverlay.css";

export default function LoadingOverlay({ active, text = "กำลังโหลดข้อมูล...", children }) {
  return (
    <div className="loading-overlay-wrap">
      {children}

      {active && (
        <div className="loading-overlay" role="status" aria-label={text}>
          <div className="loading-spinner">
            <svg viewBox="0 0 24 24" className="loading-spinner-icon">
              <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" />
              <rect x="2" y="13" width="20" height="5" rx="1.5" />
              <circle cx="6.5" cy="18.5" r="1.6" />
              <circle cx="17.5" cy="18.5" r="1.6" />
            </svg>
          </div>
          <p className="loading-text">{text}</p>
        </div>
      )}
    </div>
  );
}