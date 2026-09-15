import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function GetStudentForm() {
  const navigate = useNavigate();

  const [mappings, setMappings] = useState([]);
  const [selectedMapping, setSelectedMapping] = useState("");
  const [timeslots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const [formData, setFormData] = useState({
    session: "",
    course: "",
    courseName: "",
    branch: "",
    branchName: "",
    year: "",
    semester: "",
    section: "",
  });

  // Get faculty mappings
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${apiUrl}/getfacultymappings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setMappings(res.data.data);
        } else {
          alert("Failed to load faculty mappings.");
        }
      })
      .catch((err) => {
        console.error("Error fetching faculty mappings:", err);
        alert("Failed to load faculty mappings.");
      });
  }, []);

  // Get time slots
  useEffect(() => {
    axios
      .get(`${apiUrl}/timeslots`)
      .then((res) => {
        setTimeSlots(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching time slots:", err);
        alert("Failed to load time slots.");
      });
  }, []);

  // When faculty selects a mapping
  const handleMappingChange = (e) => {
    const mappingId = e.target.value;

    setSelectedMapping(mappingId);

    const mapping = mappings.find(
      (item) => item._id === mappingId
    );

    if (mapping) {
      setFormData({
        session: mapping.session,
        course: mapping.course?._id || "",
        courseName: mapping.course?.courseShortName || "",
        branch: mapping.branch?._id || "",
        branchName: mapping.branch?.branchShortName || "",
        year: mapping.year,
        semester: mapping.semester,
        section: mapping.section,
      });
    } else {
      setFormData({
        session: "",
        course: "",
        courseName: "",
        branch: "",
        branchName: "",
        year: "",
        semester: "",
        section: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMapping) {
      alert("Please select a class.");
      return;
    }

    if (!selectedTimeSlot) {
      alert("Please select a time slot.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${apiUrl}/getstudentsdata`,
        {
          params: {
            mappingId: selectedMapping,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/studentsattendance", {
        state: {
          students: response.data.data,
          formData: formData,
          facultyMapId: selectedMapping,
          timeSlotId: selectedTimeSlot
        }
      });
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to fetch students"
      );
    }
  };

  return (
    <Container>
      <h3 className="text-center mb-4 py-2 text-primary fw-bold">
        FIND ATTENDANCE FORM
      </h3>

      <hr />

      <Form onSubmit={handleSubmit}>
        {/* Faculty Mapping */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>
                Select Class / Lecture :-
              </Form.Label>

              <Form.Select
                value={selectedMapping}
                onChange={handleMappingChange}
              >
                <option value="">
                  Select Class
                </option>

                {mappings.map((mapping) => (
                  <option
                    key={mapping._id}
                    value={mapping._id}
                  >
                    {mapping.session} |{" "}
                    {mapping.course?.courseShortName} |{" "}
                    {mapping.branch?.branchShortName} |{" "}
                    Year {mapping.year} |{" "}
                    Semester {mapping.semester} |{" "}
                    Section {mapping.section} |{" "}
                    {mapping.subjectId?.subjectFullName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Time Slot */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>
                Select TimeSlot
              </Form.Label>

              <Form.Select
                value={selectedTimeSlot}
                onChange={(e) =>
                  setSelectedTimeSlot(e.target.value)
                }
              >
                <option value="">
                  --Select TimeSlot--
                </option>

                {timeslots.map((t) => (
                  <option
                    key={t._id}
                    value={t._id}
                  >
                    Lecture {t.lectureNo} - {t.timeSlot}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col></Col>
        </Row>

        
          <Button
          type="submit"
          variant="primary"
          disabled={!selectedMapping || !selectedTimeSlot}
        >
          Get Students
        </Button>
        
          <Button
          className="ms-3"
            variant="secondary"
            onClick={() =>
              navigate("/viewattendance", {
                state: {
                  formData: formData,
                  facultyMapId: selectedMapping
                }
              })
            }
          >
            View Attendance
          </Button>

      </Form>
    </Container>
  );
}

export default GetStudentForm;
