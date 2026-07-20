import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@vibe/core";
import { KonnectifyProvider } from "./hooks";
import { AccountSettings } from "./components/account-settings/AccountSettings";
import { BoardView } from "./components/board-view/BoardView";
import "./styles/global.css";

function App() {
  return (
    <ThemeProvider systemTheme="light">
      <KonnectifyProvider>
        <Router>
          <Routes>
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/board-view" element={<BoardView />} />
            <Route path="/" element={<Navigate to="/account-settings" replace />} />
          </Routes>
        </Router>
      </KonnectifyProvider>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
