import { useRoutes } from "react-router-dom";
import App from "./App.jsx";

export default function AppRoutes() {
  const routes = useRoutes([{ path: "/", element: <App /> }]);
  return routes;
}
