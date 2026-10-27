import { Link } from "react-router";
import { GreetingForm } from "../components/GreetingForm";
import { ROUTES } from "../constants/routes";

export const GreetingPage = () => (
  <section id="center">
    <Link to={ROUTES.HOME} className="counter nav-link">
      ← Back to Home
    </Link>
    <h1>Greeting</h1>
    <GreetingForm />
  </section>
);
