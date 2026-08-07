type ArrowIconProps = {
  /** Visual direction — only applies when variant="arrow" (the default). */
  direction?: "right" | "up-right";
  /**
   * Semantic variant:
   * - "arrow" (default) — forward navigation or external link
   * - "check"  — approval / checklist / confirmation
   * - "play"   — media playback
   */
  variant?: "arrow" | "check" | "play";
  className?: string;
};

/**
 * Cinema Estate's single icon component.
 *
 * One SVG, recoloured per state via `currentColor`.
 * The `data-motion` attribute lets CSS apply the correct semantic hover
 * transform without overriding the base geometry.
 *
 * Motion mapping (used by button hover rules in globals.css):
 *   forward  — slides right (translateX)
 *   external — slides diagonally (translate + rotate)
 *   check    — no motion
 *   play     — subtle scale
 */
export function ArrowIcon({ direction = "right", variant = "arrow", className }: ArrowIconProps) {
  const motion =
    variant === "check" ? "check" :
    variant === "play" ? "play" :
    direction === "up-right" ? "external" :
    "forward";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      className={className}
      data-motion={motion}
      data-direction={direction}
      style={{ verticalAlign: "-0.125em" }}
    >
      {variant === "check" ? (
        <path d="M3 8.5L6.5 12L13 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : variant === "play" ? (
        <path d="M5 3.5L12.5 8L5 12.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3.5 8h9m0 0-4-4m4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
