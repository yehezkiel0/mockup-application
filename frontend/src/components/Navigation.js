import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <div className="container">
        <Navbar.Brand href="/dashboard">Biodata App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user && (
            <>
              <Nav className="me-auto">
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                {user.role === "admin" ? (
                  // Admin: hanya bisa lihat data (dashboard), tidak ada menu tambah biodata
                  <Nav.Link href="/biodata">Data Biodata (Admin)</Nav.Link>
                ) : (
                  // User: hanya ditampilkan tambah biodata saja
                  <Nav.Link href="/biodata/new">Tambah Biodata</Nav.Link>
                )}
              </Nav>
              <Nav>
                <Navbar.Text className="me-3">
                  Signed in as: {user.email} (
                  {user.role === "admin" ? "Admin" : "User"})
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;
