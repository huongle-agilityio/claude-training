import { Link } from "react-router";
import { SortableList } from "../components/SortableList";
import { MOCK_ITEMS } from "../data/mockItems";
import { ROUTES } from "../constants/routes";

export const SortablePage = () => (
  <section id="center" className="sortable-page">
    <Link to={ROUTES.HOME} className="counter nav-link">
      ← Back to Home
    </Link>
    <h1>Sortable List</h1>
    <p>Drag an item to change its order.</p>
    <SortableList initialItems={MOCK_ITEMS} />
  </section>
);
