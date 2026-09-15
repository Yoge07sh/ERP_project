import { Container, Form, Row, Col, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL
function StudentsAttendance() {

    const location = useLocation();
    const students = location.state?.students || [];
    const formData = location.state?.formData || {};

    const course = location.state?.course;
    const branch = location.state?.branch;
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [facultyMaps, setFacultyMaps] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [attendance, setAttendance] = useState({});

    const selectedSlot = timeSlots.find(
        slot => slot._id === selectedTimeSlot
    );

    useEffect(() => {

        if (!formData.session) {
            return;
        }

        axios.get(`${apiUrl}/timeslots`, {
            params: {
                session: formData.session
            }
        })
            .then((res) => {

                if (res.data.success) {
                    setTimeSlots(res.data.data);
                }

            })
            .catch((err) => {
                console.error("Error fetching TimeSlots:", err);
            });

    }, [formData.session]);

    useEffect(() => {

        if (
            !formData.session ||
            !formData.course ||
            !formData.branch ||
            !formData.year ||
            !formData.semester ||
            !formData.section
        ) {
            return;
        }

        axios.get(`${apiUrl}/faculty/for/attendance`, {
            params: {
                session: formData.session,
                course: formData.course,
                branch: formData.branch,
                year: formData.year,
                semester: formData.semester,
                section: formData.section
            }
        })
            .then((res) => {

                if (res.data.success) {
                    setFacultyMaps(res.data.data);
                }

            })
            .catch((err) => {
                console.error("Error fetching Faculty Mapping:", err);
            });

    }, [formData]);

    return (
        <Container>
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">
                STUDENT LIST
            </h3>

            <hr />

            <Form>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select Session</Form.Label>
                            <Form.Select value={formData.session} readOnly>
                                <option value={formData.session}>
                                    {formData.session}
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select TimeSlot</Form.Label>
                            <Form.Select
                                value={selectedTimeSlot}
                                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            >
                                <option value="">---Select TimeSlot---</option>

                                {timeSlots.map((slot) => (
                                    <option key={slot._id} value={slot._id}>
                                        {slot.timeSlot}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select Lecture</Form.Label>
                            <Form.Select value={selectedSlot?.lectureNo || ""} disabled>
                                <option value={selectedSlot?.lectureNo || ""}>
                                    {selectedSlot
                                        ? `Lecture ${selectedSlot.lectureNo}`
                                        : "---Select Lecture---"}
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select Subject</Form.Label>
                            <Form.Select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="">---Select Subject---</option>

                                {facultyMaps.map((item) => (
                                    <option
                                        key={item.subjectId._id}
                                        value={item.subjectId._id}
                                    >
                                        {item.subjectId.subjectFullName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Course</Form.Label>
                            <Form.Select value={course?.value || ""} disabled>
                                <option value={course?.value || ""}>
                                    {course?.label || ""}
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select Branch</Form.Label>
                            <Form.Select value={branch?.value || ""} disabled>
                                <option value={branch?.value || ""}>
                                    {branch?.label || ""}
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select Year</Form.Label>
                            <Form.Select value={formData.year} readOnly>
                                <option value={formData.year}>
                                    {formData.year}
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select Semester</Form.Label>
                            <Form.Select value={formData.semester} readOnly>
                                <option value={formData.semester}>
                                    {formData.semester}
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Select Section</Form.Label>
                            <Form.Select value={formData.section} readOnly>
                                <option value={formData.section}>
                                    {formData.section}
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Faculty Name</Form.Label>
                            <Form.Select>
                                <option value="">---Select Faculty---</option>

                                {facultyMaps.map((item) => (
                                    <option
                                        key={item.facultyId._id}
                                        value={item.facultyId._id}
                                    >
                                        {item.facultyId.firstName} {item.facultyId.lastName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                </Row>
                <Table bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Roll No.</th>
                            <th>Student Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student._id}>
                                <td>{index + 1}</td>
                                <td>{student.rollNumber}</td>
                                <td>
                                    {student.firstName} {student.lastName}
                                </td>
                                <td>
                                    <Form.Select
                                        value={attendance[student._id] || "Present"}
                                        onChange={(e) =>
                                            setAttendance({
                                                ...attendance,
                                                [student._id]: e.target.value
                                            })
                                        }
                                    >
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Button variant="primary" size="sm">
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button>Submit Attendance</Button>
            </Form>
        </Container>
    )
}

export default StudentsAttendance