import React, { useState, useEffect } from "react";
import { Card, Table, Button, Alert, Badge, Modal, Form, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const BiodataList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [biodataList, setBiodataList] = useState([]);
  const [filteredBiodataList, setFilteredBiodataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBiodata, setSelectedBiodata] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("nama"); // nama, posisi, pendidikan

  useEffect(() => {
    fetchBiodata();
  }, [user.role]);

  // Filter biodata based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBiodataList(biodataList);
    } else {
      const filtered = biodataList.filter((biodata) => {
        const searchValue = searchTerm.toLowerCase();
        
        switch (searchBy) {
          case "nama":
            return biodata.nama?.toLowerCase().includes(searchValue);
          case "posisi":
            return biodata.posisi?.toLowerCase().includes(searchValue);
          case "pendidikan":
            // Search in education field (format: "jenjang|institusi|jurusan|tahun|ipk")
            if (biodata.education) {
              return biodata.education.toLowerCase().includes(searchValue);
            }
            return false;
          default:
            return biodata.nama?.toLowerCase().includes(searchValue);
        }
      });
      setFilteredBiodataList(filtered);
    }
  }, [biodataList, searchTerm, searchBy]);

  const fetchBiodata = async () => {
    try {
      const endpoint =
        user.role === "admin"
          ? "http://localhost:5000/api/admin/biodata"
          : "http://localhost:5000/api/biodata";
      const response = await axios.get(endpoint);
      setBiodataList(response.data);
      setFilteredBiodataList(response.data); // Initialize filtered list
      setError("");
    } catch (error) {
      setError("Error loading biodata");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      const endpoint =
        user.role === "admin"
          ? `http://localhost:5000/api/admin/biodata/${deleteId}`
          : `http://localhost:5000/api/biodata/${deleteId}`;
      await axios.delete(endpoint);
      fetchBiodata();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      setError("Error deleting biodata");
    }
  };

  const handleView = (biodata) => {
    setSelectedBiodata(biodata);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const parseEducation = (educationString) => {
    if (!educationString) return [];
    return educationString.split(";").map((item) => {
      const parts = item.split("|");
      return {
        jenjang_pendidikan: parts[0] || "",
        nama_institusi: parts[1] || "",
        jurusan: parts[2] || "",
        tahun_lulus: parts[3] || "",
        ipk: parts[4] || "",
      };
    });
  };

  const parseTraining = (trainingString) => {
    if (!trainingString) return [];
    return trainingString.split(";").map((item) => {
      const parts = item.split("|");
      return {
        nama_kursus: parts[0] || "",
        sertifikat: parts[1] === "true",
        tahun: parts[2] || "",
      };
    });
  };

  const parseWorkExperience = (workString) => {
    if (!workString) return [];
    return workString.split(";").map((item) => {
      const parts = item.split("|");
      return {
        nama_perusahaan: parts[0] || "",
        posisi: parts[1] || "",
        pendapatan: parts[2] || "",
        tahun: parts[3] || "",
      };
    });
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {user.role === "admin"
            ? "List Data Biodata Karyawan"
            : "Data Biodata Karyawan"}
        </h2>
        {user.role !== "admin" && (
          <Button variant="primary" onClick={() => navigate("/biodata/new")}>
            <FaPlus /> Tambah Biodata
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search Form - Only for Admin */}
      {user.role === "admin" && (
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Cari Berdasarkan:</Form.Label>
                  <Form.Select 
                    value={searchBy} 
                    onChange={(e) => setSearchBy(e.target.value)}
                  >
                    <option value="nama">Nama</option>
                    <option value="posisi">Posisi yang Dilamar</option>
                    <option value="pendidikan">Tingkat Pendidikan Terakhir</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Kata Kunci Pencarian:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Masukkan ${searchBy === 'nama' ? 'nama' : searchBy === 'posisi' ? 'posisi yang dilamar' : 'tingkat pendidikan'} yang dicari...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSearchTerm("")}
                  disabled={!searchTerm}
                >
                  Reset
                </Button>
              </Col>
            </Row>
            {searchTerm && (
              <div className="mt-2">
                <small className="text-muted">
                  Menampilkan {filteredBiodataList.length} dari {biodataList.length} data 
                  untuk pencarian "{searchTerm}" pada {searchBy === 'nama' ? 'nama' : searchBy === 'posisi' ? 'posisi yang dilamar' : 'tingkat pendidikan terakhir'}
                </small>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Body>
          {filteredBiodataList.length === 0 ? (
            <div className="text-center py-4">
              <p>
                {searchTerm 
                  ? `Tidak ada data yang ditemukan untuk pencarian "${searchTerm}"`
                  : user.role === "admin"
                  ? "Belum ada data biodata dari user."
                  : "Belum ada data biodata."
                }
              </p>
              {user.role !== "admin" && !searchTerm && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/biodata/new")}
                >
                  Tambah Biodata Pertama
                </Button>
              )}
            </div>
          ) : (
            <Table responsive striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Posisi</th>
                  <th>Email</th>
                  {user.role === "admin" && <th>User Email</th>}
                  <th>No. Telp</th>
                  <th>Jenis Kelamin</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBiodataList.map((biodata, index) => (
                  <tr key={biodata.id}>
                    <td>{index + 1}</td>
                    <td>{biodata.nama}</td>
                    <td>
                      <Badge bg="info">{biodata.posisi || "-"}</Badge>
                    </td>
                    <td>{biodata.email || "-"}</td>
                    {user.role === "admin" && (
                      <td>
                        <Badge bg="secondary">
                          {biodata.user_email || "-"}
                        </Badge>
                      </td>
                    )}
                    <td>{biodata.no_telp || "-"}</td>
                    <td>{biodata.jenis_kelamin || "-"}</td>
                    <td>{biodata.status || "-"}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleView(biodata)}
                          title="Lihat Detail"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() =>
                            navigate(`/biodata/edit/${biodata.id}`)
                          }
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setDeleteId(biodata.id);
                            setShowDeleteModal(true);
                          }}
                          title="Hapus"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Biodata - {selectedBiodata?.nama}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBiodata && (
            <div>
              <h5>Data Pribadi</h5>
              <Table bordered size="sm">
                <tbody>
                  <tr>
                    <td>
                      <strong>Posisi:</strong>
                    </td>
                    <td>{selectedBiodata.posisi || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Nama:</strong>
                    </td>
                    <td>{selectedBiodata.nama}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>No. KTP:</strong>
                    </td>
                    <td>{selectedBiodata.no_ktp || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Tempat, Tanggal Lahir:</strong>
                    </td>
                    <td>
                      {selectedBiodata.tempat_lahir || "-"},{" "}
                      {formatDate(selectedBiodata.tanggal_lahir)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Jenis Kelamin:</strong>
                    </td>
                    <td>{selectedBiodata.jenis_kelamin || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Agama:</strong>
                    </td>
                    <td>{selectedBiodata.agama || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Golongan Darah:</strong>
                    </td>
                    <td>{selectedBiodata.golongan_darah || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Status:</strong>
                    </td>
                    <td>{selectedBiodata.status || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Alamat KTP:</strong>
                    </td>
                    <td>{selectedBiodata.alamat_ktp || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Alamat Tinggal:</strong>
                    </td>
                    <td>{selectedBiodata.alamat_tinggal || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email:</strong>
                    </td>
                    <td>{selectedBiodata.email || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>No. Telp:</strong>
                    </td>
                    <td>{selectedBiodata.no_telp || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Orang Terdekat:</strong>
                    </td>
                    <td>{selectedBiodata.orang_terdekat || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Skill:</strong>
                    </td>
                    <td>{selectedBiodata.skill || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Bersedia Ditempatkan:</strong>
                    </td>
                    <td>
                      {selectedBiodata.bersedia_ditempatkan ? "Ya" : "Tidak"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Penghasilan Diharapkan:</strong>
                    </td>
                    <td>
                      {formatCurrency(selectedBiodata.penghasilan_diharapkan)}
                    </td>
                  </tr>
                </tbody>
              </Table>

              {/* Education */}
              {selectedBiodata.education && (
                <>
                  <h5 className="mt-4">Pendidikan</h5>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Jenjang</th>
                        <th>Institusi</th>
                        <th>Jurusan</th>
                        <th>Tahun Lulus</th>
                        <th>IPK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseEducation(selectedBiodata.education).map(
                        (edu, index) => (
                          <tr key={index}>
                            <td>{edu.jenjang_pendidikan}</td>
                            <td>{edu.nama_institusi}</td>
                            <td>{edu.jurusan}</td>
                            <td>{edu.tahun_lulus}</td>
                            <td>{edu.ipk}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </>
              )}

              {/* Training */}
              {selectedBiodata.training && (
                <>
                  <h5 className="mt-4">Pelatihan</h5>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Nama Kursus</th>
                        <th>Sertifikat</th>
                        <th>Tahun</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseTraining(selectedBiodata.training).map(
                        (train, index) => (
                          <tr key={index}>
                            <td>{train.nama_kursus}</td>
                            <td>{train.sertifikat ? "Ada" : "Tidak Ada"}</td>
                            <td>{train.tahun}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </>
              )}

              {/* Work Experience */}
              {selectedBiodata.work_experience && (
                <>
                  <h5 className="mt-4">Pengalaman Kerja</h5>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Perusahaan</th>
                        <th>Posisi</th>
                        <th>Pendapatan</th>
                        <th>Tahun</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseWorkExperience(selectedBiodata.work_experience).map(
                        (work, index) => (
                          <tr key={index}>
                            <td>{work.nama_perusahaan}</td>
                            <td>{work.posisi}</td>
                            <td>{formatCurrency(work.pendapatan)}</td>
                            <td>{work.tahun}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus data biodata ini?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BiodataList;
