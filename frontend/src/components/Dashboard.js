import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [biodataCount, setBiodataCount] = useState(0);

  useEffect(() => {
    const fetchBiodataCount = async () => {
      try {
        const endpoint =
          user.role === "admin"
            ? "http://localhost:5000/api/admin/biodata"
            : "http://localhost:5000/api/biodata";
        const response = await axios.get(endpoint);
        setBiodataCount(response.data.length);
      } catch (error) {
        console.error("Error fetching biodata count:", error);
      }
    };

    fetchBiodataCount();
  }, [user.role]);

  return (
    <div>
      <h1 className="mb-4">
        Dashboard {user.role === "admin" ? "(Admin)" : "(User)"}
      </h1>
      <Row>
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3>Selamat Datang!</h3>
              <p className="text-muted">Email: {user?.email}</p>
              <p className="text-muted">
                Role: {user?.role === "admin" ? "Administrator" : "User"}
              </p>
              <p>
                {user.role === "admin"
                  ? "Anda dapat melihat semua biodata yang telah disubmit oleh user."
                  : "Aplikasi CRUD untuk mengelola biodata karyawan sesuai dengan spesifikasi yang diminta."}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h4>
                {user.role === "admin"
                  ? "Total Biodata (Semua User)"
                  : "Total Biodata Anda"}
              </h4>
              <h2 className="text-primary">{biodataCount}</h2>
              {user.role === "admin" ? (
                <Button variant="primary" onClick={() => navigate("/biodata")}>
                  Lihat Semua Data
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() => navigate("/biodata/new")}
                >
                  Tambah Biodata
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        {user.role !== "admin" && (
          <Col md={6} lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <h4>Tambah Data Baru</h4>
                <p className="text-muted">Tambahkan biodata karyawan baru</p>
                <Button
                  variant="success"
                  onClick={() => navigate("/biodata/new")}
                >
                  Tambah Biodata
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Dashboard;
