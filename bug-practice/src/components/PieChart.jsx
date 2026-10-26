import { buildGradient, formatPercent } from "../utils/pieChart";
import "./PieChart.css";

export const PieChart = ({ data, title }) => {
  const slices = data.filter(({ value }) => value > 0);
  const total = slices.reduce((sum, { value }) => sum + value, 0);

  if (total === 0) {
    return <p className="pie-chart-empty">No data to display.</p>;
  }

  const summary = slices
    .map(({ label, value }) => `${label} ${formatPercent(value, total)}`)
    .join(", ");

  return (
    <figure className="pie-chart">
      <div
        className="pie-chart-circle"
        role="img"
        aria-label={`${title}: ${summary}`}
        style={{ background: buildGradient(slices, total) }}
      />
      <figcaption>
        <h2 className="pie-chart-title">{title}</h2>
        <ul className="pie-chart-legend">
          {slices.map(({ id, label, value, color }) => (
            <li key={id}>
              <span className="pie-chart-swatch" style={{ background: color }} />
              <span className="pie-chart-label">{label}</span>
              <span className="pie-chart-value">{formatPercent(value, total)}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
};
