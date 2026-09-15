import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL
function GetStudentForm() {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    session: "",
    course: "",
    branch: "",
    year: "",
    semester: "",
    section: "",

  });
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const selectedCourse = courses.find(
    course => course.value === formData.course
  );
  const selectedBranch = branches.find(
    branch => branch.value === formData.branch
  );
  useEffect(() => {
    axios({
      url: apiUrl + '/courses/for/student',
      method: 'get'
    }).then((res) => {
      if (res.data.success) {
        setCourses(res.data.data);
      } else {
        alert("Failed to load Courses.");
      }
    })
      .catch((err) => {
        console.error("Error fetching Courses:", err);
      });
  }, []);

  useEffect(() => {
    if (!formData.course) {
      setBranches([]);
      return;
    }

    axios
      .get(`${apiUrl}/branches/for/student`, {
        params: {
          courseId: formData.course
        }
      })
      .then((res) => {
        if (res.data.success) {
          setBranches(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching Branches:", err);
        setBranches([]);
      });
  }, [formData.course]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${apiUrl}/getstudentsdata`, {
        params: {
          session: formData.session,
          course: formData.course,
          branch: formData.branch,
          year: formData.year,
          semester: formData.semester,
          section: formData.section,

        }
      });
      navigate('/studentsattendance', {
        state: {
          students: response.data.data,
          formData: formData,
          course: selectedCourse,
          branch: selectedBranch
        }
      })
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container>
      <h3 className="text-center mb-4 py-2 text-primary fw-bold">
        GET STUDENT LIST
      </h3>

      <hr />

      <Form onSubmit={handleSubmit}>
        <Row>

          {/* Session */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Session :-</Form.Label>
              <Form.Select
                name="session"
                value={formData.session}
                onChange={handleChange}
              >
                <option value="">Select Session</option>
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Course */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Course :-</Form.Label>
              <Form.Select
                name="course"
                value={formData.course}
                onChange={handleChange}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Branch */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Branch :-</Form.Label>
              <Form.Select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Year */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Year :-</Form.Label>
              <Form.Select
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Semester */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Semester :-</Form.Label>
              <Form.Select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="">Select Semester</option>
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

          {/* Section */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Section :-</Form.Label>
              <Form.Select
                name="section"
                value={formData.section}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Get Students Button */}
        <Button type="submit" variant="primary">
          Get Students
        </Button>
      </Form>
    </Container>
  );
}

export default GetStudentForm;
