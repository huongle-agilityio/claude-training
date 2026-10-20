import { Link } from "react-router";
import { ROUTES } from "../constants/routes";

export const SortablePage = () => (
  <section id="center" className="sortable-page">
    <Link to={ROUTES.HOME} className="counter nav-link">
      ← Back to Home
    </Link>
    <h1>Sortable List</h1>
    <p>Drag an item to change its order.</p>
  </section>
);
