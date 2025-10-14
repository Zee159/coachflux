import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionView } from "./components/SessionView";
import { Dashboard } from "./components/Dashboard";
import { DemoSetup } from "./components/DemoSetup";
import { ThemeProvider } from "./ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/setup" replace />} />
          <Route path="/setup" element={<DemoSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/session/:sessionId" element={<SessionView />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
