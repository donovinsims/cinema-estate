export function clampComparisonPosition(position) {
  return Math.min(100, Math.max(0, position));
}

export function comparisonPositionFromKey(position, key) {
  if (key === "Home") return 0;
  if (key === "End") return 100;
  if (key === "ArrowLeft") return clampComparisonPosition(position - 5);
  if (key === "ArrowRight") return clampComparisonPosition(position + 5);
  return position;
}
