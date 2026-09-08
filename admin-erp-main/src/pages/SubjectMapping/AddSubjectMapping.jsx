import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Spinner,
  Card,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function SubjectMapping() {
  let navigate = useNavigate();
  let [subjects, setSubjects] = useState([]);
  let [courses, setCourses] = useState([]);
  let [branchs, setBranchs] = useState([]);
  const [show, setShow] = useState(false);
  let [showForm, SetShowForm] = useState(true);
  let [showSpinner, setShowSpinner] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(false);
  let [session, setSession] = useState("");
  let [subject, setSubject] = useState("");
  let [course, setCourse] = useState("");
  let [branch, setBranch] = useState("");
  let [year, setYear] = useState("1");
  let [semester, setSemester] = useState("1");

  useEffect(() => {
    axios
      .get("http://localhost:3000/courses/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          alert("Failed to load Course.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Courses:", err);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3000/subjects/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setSubjects(res.data.data);
        } else {
          alert("Failed to load Subjects.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Subjects:", err);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3000/branchs/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setBranchs(res.data.data);
        } else {
          alert("Failed to load Branch.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Branchs:", err);
      });
  }, []);

  let doAddMapping = () => {
    setButtonDisabled(true);
    SetShowForm(false);
    setShowSpinner(true);
    axios({
      url: "http://localhost:3000/add/subjectMapping",
      method: "post",
      data: { session,subject, course, branch, year, semester },
    })
      .then((result) => {
        if (result.data.success) setButtonDisabled(false);
        setShow(true);
        setShowSpinner(false);
        SetShowForm(true);
      })
      .catch((err) => {
        setShowSpinner(false);
        setButtonDisabled(false);
        SetShowForm(true);
        alert(err);
      });
  };

  const handleClose = () => {
    setShow(false);
    navigate("/subjectsmap");
  };

  return (
    <>
      {showForm && (
        <Container className="mt-5">

          <h3 className="text-center mb-4 py-2 text-primary fw-bold ">ADD SUBJECT MAPPING</h3>
          <hr />

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Session</Form.Label>
                  <Form.Select
                    onChange={(e) => setSession(e.target.value)}
                    required
                  >
                    <option value="">-- Select Year--</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                    <option value="2027-28">2027-28</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subjects</Form.Label>
                  <Form.Select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((c) => (
                      <option key={c.value} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Courses</Form.Label>
                  <Form.Select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((c) => (
                      <option key={c.value} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <Form.Select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  >
                    <option value="">-- Select Branch --</option>
                    {branchs.map((b) => (
                      <option key={b.value} value={b.label}>
                        {b.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button
                onClick={() => navigate("/subjectsmap")}
                variant="secondary"
                type="button"
              >
                Cancel
              </Button>
              <Button
                onClick={doAddMapping}
                disabled={buttonDisabled}
                variant="success"
                type="submit"
              >
                Add Mapping
              </Button>
            </div>
          </Form>

        </Container>
      )}
      {showSpinner && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sucess</Modal.Title>
        </Modal.Header>
        <Modal.Body>Subject mapping added successfully</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SubjectMapping;
