import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function GetStudentForm() {

  return (

    <Container>

      <h3 className="text-center mb-4 py-2 text-primary fw-bold">GET STUDENT LIST</h3>
      <hr />

      <Form>

        <Row>

          {/* Session */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Session :-</Form.Label>

              <Form.Select>
                <option value="">Select Session</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Course */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Course :-</Form.Label>

              <Form.Select>
                <option value="">Select Course</option>
                <option value="B.Tech">B.Tech</option>
                <option value="MCA">MCA</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Branch */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Branch :-</Form.Label>

              <Form.Select>
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Year */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Year :-</Form.Label>

              <Form.Select>
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Semester */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Semester :-</Form.Label>

              <Form.Select>
                <option value="">Select Semester</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Section */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Section :-</Form.Label>

              <Form.Select>
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="C">D</option>
                <option value="C">E</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Faculty */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Faculty Name :-</Form.Label>

              <Form.Select>
                <option value="">Select Faculty</option>
                <option value="Faculty 1">Faculty 1</option>
                <option value="Faculty 2">Faculty 2</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Timeslot */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Timeslot :-</Form.Label>

              <Form.Select>
                <option value="">Select Timeslot</option>
                <option value="09-10">09:00 - 10:00</option>
                <option value="10-11">10:00 - 11:00</option>
                <option value="11-12">11:00 - 12:00</option>
                <option value="12-01">12:00 - 01:00</option>
                <option value="01-02">01:00 - 02:00</option>
                <option value="02-03">02:00 - 03:00</option>
                <option value="03-04">03:00 - 04:00</option>
                <option value="04-05">04:00 - 05:00</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Lecture */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Lecture :-</Form.Label>

              <Form.Select>
                <option value="">Select Lecture</option>
                <option value="Lecture 1">Lecture 1</option>
                <option value="Lecture 2">Lecture 2</option>
                <option value="Lecture 3">Lecture 3</option>
                <option value="Lecture 4">Lecture 4</option>
                <option value="Lecture 5">Lecture 5</option>
                <option value="Lecture 6">Lecture 6</option>
                <option value="Lecture 7">Lecture 7</option>
                <option value="Lecture 8">Lecture 8</option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Subject */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Subject :-</Form.Label>

              <Form.Select>
                <option value="">Select Subject</option>
                <option value="DBMS">DBMS</option>
                <option value="Java">Java</option>
                <option value="Web Development">
                  Web Development
                </option>
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Date */}
          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label>Date :-</Form.Label>

              <Form.Control
                type="date"
                name="date"
              />
            </Form.Group>
          </Col>

        </Row>


        {/* Get Students Button */}
        <Button type="submit" variant="primary">Get Students</Button>

      </Form>

    </Container>
  );

}

export default GetStudentForm;