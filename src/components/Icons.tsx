/* Small inline icon set (stroke = currentColor) */
type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const Arrow = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const Chevron = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const Close = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const Editor = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);
export const Docs = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 7v14M12 7a4 4 0 0 0-4-4H3v13h6a3 3 0 0 1 3 3M12 7a4 4 0 0 1 4-4h5v13h-6a3 3 0 0 0-3 3" />
  </svg>
);
export const Debug = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M8 3v3m8-3v3M9 15h6M12 21v-9" />
    <rect x="6" y="6" width="12" height="12" rx="6" />
  </svg>
);
export const Review = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 15l6-6" />
  </svg>
);
export const Optimize = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 2a10 10 0 1 1-7 3" />
    <path d="M16 12l-4-4-4 4M12 8v8" />
  </svg>
);
export const Clock = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const Async = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M13.5 10.5 15 9M4 4v15l2-2M9 15l1.5-1.5" />
  </svg>
);
export const Dead = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M9 15h12" />
  </svg>
);
export const Spark = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="5" r="2" />
    <path d="M7 17 17 7M12 12l9 3.5-3.5 1L16 20l-4-8Z" />
  </svg>
);
export const Help = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3 2.5c-.7.3-.9.8-.9 1.5M12 17h.01" />
  </svg>
);
export const Book = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5Z" />
  </svg>
);
export const Star = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3l2.5 6 6.5.5-5 4 1.6 6.3L12 16.9 6.4 19.8 8 13.5l-5-4 6.5-.5Z" />
  </svg>
);

export const socialIcons = {
  x: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M18.9 2H22l-7.3 8.3L23 22h-6.6l-5.2-6.7L5.3 22H2l7.8-8.9L1.5 2h6.8l4.7 6.2L18.9 2Zm-2.3 18h1.8L7.5 3.9H5.6L16.6 20Z" />
    </svg>
  ),
  in: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21H9z" />
    </svg>
  ),
  ig: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.9.07s-3.6 0-4.86-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.2 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm6.9-11.4a1.58 1.58 0 1 1-1.58-1.57 1.58 1.58 0 0 1 1.58 1.58Z" />
    </svg>
  ),
  fb: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.04-1.3-.13-2.46-.13-2.43 0-4.1 1.48-4.1 4.2v2.35H7.7V13h2.74v8Z" />
    </svg>
  ),
};
