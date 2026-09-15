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

  const [formData, setFormData] = useState({
    session: "",
    course: "",
    branch: "",
    year: "",
    semester: "",
    section: "",
  });

  // Get faculty mappings
  useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get(`${apiUrl}/getfacultymappings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
        branch: "",
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

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${apiUrl}/getstudentsdata`,
        {
          params: {
            mappingId: selectedMapping
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/studentsattendance", {
        state: {
          students: response.data.data,
          formData: formData,
          mappingId: selectedMapping
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

          <Col md={12}>

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


        {/* Automatically filled fields */}

        <Row>

          {/* Session */}

          <Col md={4}>

            <Form.Group className="mb-4">

              <Form.Label>
                Session :-
              </Form.Label>

              <Form.Control
                value={formData.session}
                readOnly
              />

            </Form.Group>

          </Col>


          {/* Course */}

          <Col md={4}>

            <Form.Group className="mb-4">

              <Form.Label>
                Course :-
              </Form.Label>

              <Form.Control
                value={mappings.find(
                  m => m._id === selectedMapping
                )?.course?.courseShortName || ""}
                readOnly
              />

            </Form.Group>

          </Col>


          {/* Branch */}

          <Col md={4}>

            <Form.Group className="mb-4">

              <Form.Label>
                Branch :-
              </Form.Label>

              <Form.Control
                value={mappings.find(
                  m => m._id === selectedMapping
                )?.branch?.branchShortName || ""}
                readOnly
              />

            </Form.Group>

          </Col>


          {/* Year */}

          <Col md={4}>

            <Form.Group className="mb-4">

              <Form.Label>
                Year :-
              </Form.Label>

              <Form.Control
                value={formData.year}
                readOnly
              />

            </Form.Group>

          </Col>


          {/* Semester */}

          <Col md={4}>

            <Form.Group className="mb-4">

              <Form.Label>
                Semester :-
              </Form.Label>

              <Form.Control
                value={formData.semester}
                readOnly
              />

            </Form.Group>

          </Col>


          {/* Section */}

          <Col md={4}>

            <Form.Group className="mb-4">

              <Form.Label>
                Section :-
              </Form.Label>

              <Form.Control
                value={formData.section}
                readOnly
              />

            </Form.Group>

          </Col>

        </Row>


        <Button
          type="submit"
          variant="primary"
          disabled={!selectedMapping}
        >
          Get Students
        </Button>

      </Form>

    </Container>
  );
}

export default GetStudentForm;