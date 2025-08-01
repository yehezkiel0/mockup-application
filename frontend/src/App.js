import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import BiodataForm from "./components/BiodataForm";
import BiodataList from "./components/BiodataList";
import Navigation from "./components/Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function UserOnlyRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/dashboard" />;
  return children;
}

function AdminOnlyRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <div className="container mt-4">
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/biodata/new"
                element={
                  <UserOnlyRoute>
                    <BiodataForm />
                  </UserOnlyRoute>
                }
              />
              <Route
                path="/biodata/edit/:id"
                element={
                  <ProtectedRoute>
                    <BiodataForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/biodata"
                element={
                  <ProtectedRoute>
                    <BiodataList />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
