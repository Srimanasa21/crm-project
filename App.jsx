import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import Leads from "./Leads";
import Login from "./Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "app-root dark" : "app-root"}>
      {!isAuthenticated ? (
        <Login onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <BrowserRouter>
          <div className="app-shell">
            <aside className="sidebar">
              <div className="brand">
                <h2>CRM Studio</h2>
                <p>Manage customers, leads, and pipeline activity from one place.</p>
              </div>

              <nav className="nav-links">
                <NavLink end to="/" className={({ isActive }) => (isActive ? "active" : undefined)}>
                  <span className="nav-icon">🏠</span>Dashboard
                </NavLink>
                <NavLink to="/customers" className={({ isActive }) => (isActive ? "active" : undefined)}>
                  <span className="nav-icon">👥</span>Customers
                </NavLink>
                <NavLink to="/leads" className={({ isActive }) => (isActive ? "active" : undefined)}>
                  <span className="nav-icon">📋</span>Leads
                </NavLink>
              </nav>

              <div className="sidebar-footer">
                <button className="btn btn-secondary sidebar-action" type="button" onClick={() => setDarkMode((prev) => !prev)}>
                  {darkMode ? "Light mode" : "Dark mode"}
                </button>
                <button className="btn btn-danger sidebar-action" type="button" onClick={() => setIsAuthenticated(false)}>
                  Logout
                </button>
                <p>Built with React, Vite, Express, MongoDB.</p>
              </div>
            </aside>

            <main className="content">
              <div className="top-bar">
                <div>
                  <h1 className="page-title">CRM Studio</h1>
                  <p className="page-subtitle">Professional sales dashboard for your team.</p>
                </div>
                <div className="top-controls">
                  <button className="btn btn-secondary" type="button" onClick={() => setDarkMode((prev) => !prev)}>
                    {darkMode ? "Light mode" : "Dark mode"}
                  </button>
                  <button className="btn btn-danger" type="button" onClick={() => setIsAuthenticated(false)}>
                    Logout
                  </button>
                </div>
              </div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/leads" element={<Leads />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
