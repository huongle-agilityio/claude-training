// Turns slices into a conic-gradient so the pie is drawn with plain CSS
export const buildGradient = (slices, total) => {
  let start = 0;
  const stops = slices.map(({ value, color }) => {
    const end = start + (value / total) * 100;
    const stop = `${color} ${start}% ${end}%`;
    start = end;
    return stop;
  });
  return `conic-gradient(${stops.join(", ")})`;
};

// Largest-remainder rounding so the whole percents always add up to 100
export const toPercents = (values, total) => {
  const raw = values.map((value) => (value / total) * 100);
  const percents = raw.map(Math.floor);
  const leftover = 100 - percents.reduce((sum, percent) => sum + percent, 0);
  raw
    .map((value, index) => ({ index, remainder: value - percents[index] }))
    .sort((a, b) => b.remainder - a.remainder)
    .slice(0, leftover)
    .forEach(({ index }) => {
      percents[index] += 1;
    });
  return percents;
};

// A drawn slice should never read as "0%"
export const formatPercent = (percent) =>
  percent === 0 ? "<1%" : `${percent}%`;
