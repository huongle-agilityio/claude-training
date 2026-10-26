import { Link } from "react-router";
import { PieChart } from "../components/PieChart";
import { MOCK_CHART_DATA } from "../data/mockChartData";
import { ROUTES } from "../constants/routes";

export const PieChartPage = () => (
  <section id="center">
    <Link to={ROUTES.HOME} className="counter nav-link">
      ← Back to Home
    </Link>
    <h1>Pie Chart</h1>
    <p>Share of time spent on each project phase.</p>
    <PieChart data={MOCK_CHART_DATA} title="Project phases" />
  </section>
);
