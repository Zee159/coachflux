import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionView } from "./components/SessionView";
import { Dashboard } from "./components/Dashboard";
import { DemoSetup } from "./components/DemoSetup";
import { ThemeProvider } from "./ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<DemoSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/session/:sessionId" element={<SessionView />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
