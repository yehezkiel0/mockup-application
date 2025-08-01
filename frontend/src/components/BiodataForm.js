import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Row, Col, Table } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const BiodataForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    posisi: "",
    nama: "",
    no_ktp: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    agama: "",
    golongan_darah: "",
    status: "",
    alamat_ktp: "",
    alamat_tinggal: "",
    email: "",
    no_telp: "",
    orang_terdekat: "",
    skill: "",
    bersedia_ditempatkan: false,
    penghasilan_diharapkan: "",
  });

  const [education, setEducation] = useState([
    {
      jenjang_pendidikan: "",
      nama_institusi: "",
      jurusan: "",
      tahun_lulus: "",
      ipk: "",
    },
  ]);

  const [training, setTraining] = useState([
    {
      nama_kursus: "",
      sertifikat: false,
      tahun: "",
    },
  ]);

  const [workExperience, setWorkExperience] = useState([
    {
      nama_perusahaan: "",
      posisi: "",
      pendapatan: "",
      tahun: "",
    },
  ]);

  useEffect(() => {
    if (isEdit) {
      fetchBiodata();
    }
  }, [id, isEdit]);

  const fetchBiodata = async () => {
    try {
      let biodata;

      if (user.role === "admin") {
        // Admin can fetch any biodata directly
        console.log("Admin fetching biodata ID:", id);
        const response = await axios.get(
          `http://localhost:5000/api/admin/biodata/${id}`
        );
        biodata = response.data;
        console.log("Admin biodata response:", biodata);
      } else {
        // Regular user fetches from their own biodata list
        console.log("User fetching biodata list");
        const response = await axios.get(`http://localhost:5000/api/biodata`);
        biodata = response.data.find((item) => item.id === parseInt(id));
        console.log("User biodata found:", biodata);
      }

      if (!biodata) {
        setError("Biodata tidak ditemukan");
        return;
      }

      console.log("Setting form data with biodata:", biodata);
      setFormData({
        posisi: biodata.posisi || "",
        nama: biodata.nama || "",
        no_ktp: biodata.no_ktp || "",
        tempat_lahir: biodata.tempat_lahir || "",
        tanggal_lahir: biodata.tanggal_lahir
          ? biodata.tanggal_lahir.split("T")[0]
          : "",
        jenis_kelamin: biodata.jenis_kelamin || "",
        agama: biodata.agama || "",
        golongan_darah: biodata.golongan_darah || "",
        status: biodata.status || "",
        alamat_ktp: biodata.alamat_ktp || "",
        alamat_tinggal: biodata.alamat_tinggal || "",
        email: biodata.email || "",
        no_telp: biodata.no_telp || "",
        orang_terdekat: biodata.orang_terdekat || "",
        skill: biodata.skill || "",
        bersedia_ditempatkan: biodata.bersedia_ditempatkan || false,
        penghasilan_diharapkan: biodata.penghasilan_diharapkan || "",
      });

      // Parse education data
      if (biodata.education) {
        const eduData = biodata.education.split(";").map((item) => {
          const parts = item.split("|");
          return {
            jenjang_pendidikan: parts[0] || "",
            nama_institusi: parts[1] || "",
            jurusan: parts[2] || "",
            tahun_lulus: parts[3] || "",
            ipk: parts[4] || "",
          };
        });
        setEducation(
          eduData.length > 0
            ? eduData
            : [
                {
                  jenjang_pendidikan: "",
                  nama_institusi: "",
                  jurusan: "",
                  tahun_lulus: "",
                  ipk: "",
                },
              ]
        );
      }

      // Parse training data
      if (biodata.training) {
        const trainingData = biodata.training.split(";").map((item) => {
          const parts = item.split("|");
          return {
            nama_kursus: parts[0] || "",
            sertifikat: parts[1] === "true",
            tahun: parts[2] || "",
          };
        });
        setTraining(
          trainingData.length > 0
            ? trainingData
            : [{ nama_kursus: "", sertifikat: false, tahun: "" }]
        );
      }

      // Parse work experience data
      if (biodata.work_experience) {
        const workData = biodata.work_experience.split(";").map((item) => {
          const parts = item.split("|");
          return {
            nama_perusahaan: parts[0] || "",
            posisi: parts[1] || "",
            pendapatan: parts[2] || "",
            tahun: parts[3] || "",
          };
        });
        setWorkExperience(
          workData.length > 0
            ? workData
            : [{ nama_perusahaan: "", posisi: "", pendapatan: "", tahun: "" }]
        );
      }
    } catch (error) {
      console.error("Error fetching biodata:", error);
      console.error("Error response:", error.response?.data);
      setError(
        `Error loading biodata: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        jenjang_pendidikan: "",
        nama_institusi: "",
        jurusan: "",
        tahun_lulus: "",
        ipk: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const addTraining = () => {
    setTraining([
      ...training,
      { nama_kursus: "", sertifikat: false, tahun: "" },
    ]);
  };

  const removeTraining = (index) => {
    setTraining(training.filter((_, i) => i !== index));
  };

  const handleTrainingChange = (index, field, value) => {
    const newTraining = [...training];
    newTraining[index][field] =
      field === "sertifikat" ? value === "true" : value;
    setTraining(newTraining);
  };

  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      { nama_perusahaan: "", posisi: "", pendapatan: "", tahun: "" },
    ]);
  };

  const removeWorkExperience = (index) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperience = [...workExperience];
    newWorkExperience[index][field] = value;
    setWorkExperience(newWorkExperience);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        education: education.filter((edu) => edu.nama_institusi),
        training: training.filter((train) => train.nama_kursus),
        work_experience: workExperience.filter((work) => work.nama_perusahaan),
      };

      if (isEdit) {
        const endpoint =
          user.role === "admin"
            ? `http://localhost:5000/api/admin/biodata/${id}`
            : `http://localhost:5000/api/biodata/${id}`;
        await axios.put(endpoint, submitData);
        setSuccess("Biodata berhasil diupdate!");
      } else {
        await axios.post("http://localhost:5000/api/biodata", submitData);
        setSuccess("Biodata berhasil disimpan!");
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="mb-4">{isEdit ? "Edit" : "Tambah"} Biodata</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Header>
            <h5>Data Pribadi Pelamar</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>POSISI YANG DILAMAR</Form.Label>
                  <Form.Control
                    type="text"
                    name="posisi"
                    value={formData.posisi}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>NAMA</Form.Label>
                  <Form.Control
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>NO. KTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="no_ktp"
                    value={formData.no_ktp}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>TEMPAT, TANGGAL LAHIR</Form.Label>
                  <Row>
                    <Col md={7}>
                      <Form.Control
                        type="text"
                        name="tempat_lahir"
                        placeholder="Tempat Lahir"
                        value={formData.tempat_lahir}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="date"
                        name="tanggal_lahir"
                        value={formData.tanggal_lahir}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>JENIS KELAMIN</Form.Label>
                  <Form.Select
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      : LAKI-LAKI/PEREMPUAN*
                    </option>
                    <option value="LAKI-LAKI">LAKI-LAKI</option>
                    <option value="PEREMPUAN">PEREMPUAN</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>AGAMA</Form.Label>
                  <Form.Control
                    type="text"
                    name="agama"
                    value={formData.agama}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GOLONGAN DARAH</Form.Label>
                  <Form.Select
                    name="golongan_darah"
                    value={formData.golongan_darah}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>STATUS</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih</option>
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Duda/Janda">Duda/Janda</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ALAMAT KTP</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="alamat_ktp"
                    value={formData.alamat_ktp}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ALAMAT TINGGAL</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="alamat_tinggal"
                    value={formData.alamat_tinggal}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>EMAIL</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>NO. TELP</Form.Label>
                  <Form.Control
                    type="tel"
                    name="no_telp"
                    value={formData.no_telp}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>ORANG TERDEKAT YANG DAPAT DIHUBUNGI</Form.Label>
                  <Form.Control
                    type="text"
                    name="orang_terdekat"
                    value={formData.orang_terdekat}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Education Section */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5>PENDIDIKAN TERAKHIR</h5>
            <Button variant="outline-primary" size="sm" onClick={addEducation}>
              <FaPlus /> Tambah
            </Button>
          </Card.Header>
          <Card.Body>
            <Table bordered>
              <thead className="table-light">
                <tr>
                  <th>Jenjang Pendidikan Terakhir</th>
                  <th>Nama Institusi Akademik</th>
                  <th>Jurusan</th>
                  <th>Tahun Lulus</th>
                  <th>IPK</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {education.map((edu, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Select
                        value={edu.jenjang_pendidikan}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "jenjang_pendidikan",
                            e.target.value
                          )
                        }
                        size="sm"
                      >
                        <option value="">Pilih</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA</option>
                        <option value="SMK">SMK</option>
                        <option value="D3">D3</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={edu.nama_institusi}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "nama_institusi",
                            e.target.value
                          )
                        }
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={edu.jurusan}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "jurusan",
                            e.target.value
                          )
                        }
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={edu.tahun_lulus}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "tahun_lulus",
                            e.target.value
                          )
                        }
                        size="sm"
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        step="0.01"
                        max="4.00"
                        value={edu.ipk}
                        onChange={(e) =>
                          handleEducationChange(index, "ipk", e.target.value)
                        }
                        size="sm"
                        style={{ width: "70px" }}
                      />
                    </td>
                    <td>
                      {education.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeEducation(index)}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Training Section */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5>RIWAYAT PELATIHAN</h5>
            <Button variant="outline-primary" size="sm" onClick={addTraining}>
              <FaPlus /> Tambah
            </Button>
          </Card.Header>
          <Card.Body>
            <Table bordered>
              <thead className="table-light">
                <tr>
                  <th>Nama Kursus/Seminar</th>
                  <th>Sertifikat (ada/tidak)</th>
                  <th>Tahun</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {training.map((train, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        value={train.nama_kursus}
                        onChange={(e) =>
                          handleTrainingChange(
                            index,
                            "nama_kursus",
                            e.target.value
                          )
                        }
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Select
                        value={train.sertifikat}
                        onChange={(e) =>
                          handleTrainingChange(
                            index,
                            "sertifikat",
                            e.target.value
                          )
                        }
                        size="sm"
                      >
                        <option value={false}>Tidak</option>
                        <option value={true}>Ada</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={train.tahun}
                        onChange={(e) =>
                          handleTrainingChange(index, "tahun", e.target.value)
                        }
                        size="sm"
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
                      {training.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeTraining(index)}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Work Experience Section */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5>RIWAYAT PEKERJAAN</h5>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addWorkExperience}
            >
              <FaPlus /> Tambah
            </Button>
          </Card.Header>
          <Card.Body>
            <Table bordered>
              <thead className="table-light">
                <tr>
                  <th>Nama Perusahaan</th>
                  <th>Posisi Terakhir</th>
                  <th>Pendapatan Terakhir</th>
                  <th>Tahun</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {workExperience.map((work, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        value={work.nama_perusahaan}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "nama_perusahaan",
                            e.target.value
                          )
                        }
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={work.posisi}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "posisi",
                            e.target.value
                          )
                        }
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={work.pendapatan}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "pendapatan",
                            e.target.value
                          )
                        }
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={work.tahun}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "tahun",
                            e.target.value
                          )
                        }
                        size="sm"
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
                      {workExperience.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeWorkExperience(index)}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <h5>Informasi Tambahan</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label style={{ textAlign: "left" }}>SKILL</Form.Label>
                  <Form.Text className="text-muted d-block mb-2">
                    : Tuliskan keahlian & keterampilan yang saat ini anda
                    miliki.
                  </Form.Text>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="skill"
                    value={formData.skill}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="bersedia_ditempatkan"
                    label="BERSEDIA DITEMPATKAN DI SELURUH KANTOR PERUSAHAAN : YA/TIDAK*"
                    checked={formData.bersedia_ditempatkan}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ textAlign: "left" }}>
                    PENGHASILAN YANG DIHARAPKAN : _______________/Bulan
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="penghasilan_diharapkan"
                    placeholder="Masukkan nominal dalam Rupiah"
                    value={formData.penghasilan_diharapkan}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="d-flex gap-2 mb-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/dashboard")}
          >
            Kembali
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BiodataForm;
