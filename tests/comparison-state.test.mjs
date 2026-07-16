import assert from "node:assert/strict";
import test from "node:test";
import {
  comparisonPositionFromKey,
  clampComparisonPosition,
} from "../app/comparison-state.mjs";

test("clamps comparison positions to the available image bounds", () => {
  assert.equal(clampComparisonPosition(-4), 0);
  assert.equal(clampComparisonPosition(42.5), 42.5);
  assert.equal(clampComparisonPosition(140), 100);
});

test("moves comparison position with arrow and home/end keys", () => {
  assert.equal(comparisonPositionFromKey(50, "ArrowLeft"), 45);
  assert.equal(comparisonPositionFromKey(50, "ArrowRight"), 55);
  assert.equal(comparisonPositionFromKey(50, "Home"), 0);
  assert.equal(comparisonPositionFromKey(50, "End"), 100);
  assert.equal(comparisonPositionFromKey(50, "Enter"), 50);
});
