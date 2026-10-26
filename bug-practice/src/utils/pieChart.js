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

export const formatPercent = (value, total) =>
  `${Math.round((value / total) * 100)}%`;
