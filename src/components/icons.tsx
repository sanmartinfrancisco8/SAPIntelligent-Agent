export const AppLogo = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="8" fill="hsl(var(--primary))" />
    <path
      d="M13.5 11.5L20 20L13.5 28.5"
      stroke="hsl(var(--accent))"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.5 11.5L20 20L26.5 28.5"
      stroke="hsl(var(--primary-foreground))"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
