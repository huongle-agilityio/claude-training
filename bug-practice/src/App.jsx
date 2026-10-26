import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SortablePage } from "./pages/SortablePage";
import { PieChartPage } from "./pages/PieChartPage";
import { ROUTES } from "./constants/routes";
import "./App.css";

const App = () => (
  <Routes>
    <Route path={ROUTES.HOME} element={<HomePage />} />
    <Route path={ROUTES.SORTABLE} element={<SortablePage />} />
    <Route path={ROUTES.PIE_CHART} element={<PieChartPage />} />
  </Routes>
);

export default App;
