export const MIN_GOAL = 1;
export const MAX_GOAL = 999;

// Returns the goal as a number, or null when the text is not a whole number
// from 1 to 999. Spaces at both ends are ignored; leading zeros are allowed.
export const parseGoal = (text) => {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return value >= MIN_GOAL && value <= MAX_GOAL ? value : null;
};

// Share of the goal reached, from 0 to 1. Capped at 1 so the bar stays full
// (and inside its frame) once the count passes the goal.
export const getProgress = (count, goal) => Math.min(count / goal, 1);
