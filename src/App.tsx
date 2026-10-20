import { Navigate, Route, Routes } from "react-router-dom";
import { App as RedixcSite } from "./site/App.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/about" element={<Navigate to="/nosotros" replace />} />
      <Route path="*" element={<RedixcSite />} />
    </Routes>
  );
}
