type ArrowIconProps = {
  direction?: "right" | "up-right";
  className?: string;
};

export function ArrowIcon({ direction = "right", className }: ArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      className={className}
      style={{
        verticalAlign: "-0.125em",
        transform: direction === "up-right" ? "rotate(-45deg)" : undefined,
      }}
    >
      <path d="M3.5 8h9m0 0-4-4m4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
