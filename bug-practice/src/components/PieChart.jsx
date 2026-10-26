import { buildGradient, formatPercent, toPercents } from "../utils/pieChart";
import "./PieChart.css";

export const PieChart = ({ data = [], title = "" }) => {
  const valid = data
    .map((slice) => ({ ...slice, value: Number(slice.value) }))
    .filter(({ value }) => Number.isFinite(value) && value > 0);
  const total = valid.reduce((sum, { value }) => sum + value, 0);

  if (total === 0) {
    return <p className="pie-chart-empty">No data to display.</p>;
  }

  const percents = toPercents(
    valid.map(({ value }) => value),
    total,
  );
  const slices = valid.map((slice, index) => ({
    ...slice,
    percent: formatPercent(percents[index]),
  }));

  const summary = slices
    .map(({ label, percent }) => `${label} ${percent}`)
    .join(", ");

  return (
    <figure className="pie-chart">
      <div
        className="pie-chart-circle"
        role="img"
        aria-label={title ? `${title}: ${summary}` : summary}
        style={{ background: buildGradient(slices, total) }}
      />
      <figcaption>
        {title && <h2 className="pie-chart-title">{title}</h2>}
        <ul className="pie-chart-legend">
          {slices.map(({ id, label, color, percent }, index) => (
            <li key={id ?? index}>
              <span
                className="pie-chart-swatch"
                style={{ background: color }}
                aria-hidden="true"
              />
              <span className="pie-chart-label">{label}</span>
              <span className="pie-chart-value">{percent}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
};
