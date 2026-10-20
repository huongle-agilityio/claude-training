import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SortablePage } from "./pages/SortablePage";
import { ROUTES } from "./constants/routes";
import "./App.css";

const App = () => (
  <Routes>
    <Route path={ROUTES.HOME} element={<HomePage />} />
    <Route path={ROUTES.SORTABLE} element={<SortablePage />} />
  </Routes>
);

export default App;
