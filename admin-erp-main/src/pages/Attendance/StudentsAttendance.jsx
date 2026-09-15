import { Container, Form, Button, Table, Card } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import { useState } from "react";

import { useLocation } from "react-router-dom";

function StudentsAttendance() {

    const location = useLocation();

    const {
        students = [],
        formData = {}
    } = location.state || {};

    const [attendance, setAttendance] = useState({});

    return (

        <Container className="py-3">

            {/* Page Heading */}
            <div className="text-center mb-3">

                <h3 className="text-primary fw-bold mb-1">
                    STUDENT ATTENDANCE
                </h3>

                <div className="text-muted small">
                    Mark attendance for the selected class
                </div>

            </div>

            {/* Class Information */}
            <Card className="shadow-sm border-0 mb-4">

                <Card.Body className="py-3">

                    <h5 className="text-center fw-bold mb-0">

                        {formData.courseName || ""}{" "}

                        {formData.branchName
                            ? `[${formData.branchName}]`
                            : ""}{" "}

                        <span className="text-muted">
                            ({formData.year || ""} Year, Semester {formData.semester || ""}, Section {formData.section || ""})
                        </span>

                    </h5>

                </Card.Body>

            </Card>

            {/* Student Table */}
            <Card className="shadow-sm border-0">

                <Card.Body className="p-0">

                    <Table
                        bordered
                        hover
                        responsive
                        className="mb-0 align-middle"
                    >

                        <thead className="table-primary">

                            <tr>
                                <th className="text-center" style={{ width: "8%" }}>
                                    S.No
                                </th>

                                <th className="text-center" style={{ width: "18%" }}>
                                    Roll No.
                                </th>

                                <th style={{ width: "44%" }}>
                                    Student Name
                                </th>

                                <th className="text-center" style={{ width: "30%" }}>
                                    Attendance
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {students.length > 0 ? (

                                students.map((student, index) => (

                                    <tr key={student._id}>

                                        <td className="text-center fw-semibold">
                                            {index + 1}
                                        </td>

                                        <td className="text-center">
                                            {student.rollNumber}
                                        </td>

                                        <td>
                                            <span className="fw-semibold">
                                                {student.firstName} {student.lastName}
                                            </span>
                                        </td>

                                        <td>

                                            <Form.Select
                                                size="sm"
                                                value={
                                                    attendance[student._id] ||
                                                    "Present"
                                                }
                                                onChange={(e) =>
                                                    setAttendance({
                                                        ...attendance,
                                                        [student._id]: e.target.value
                                                    })
                                                }
                                            >

                                                <option value="Present">
                                                    Present
                                                </option>

                                                <option value="Absent">
                                                    Absent
                                                </option>

                                            </Form.Select>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center py-4 text-muted"
                                    >
                                        No students found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

            {/* Submit Button */}
            <div className="text-end mt-3">

                <Button
                    variant="primary"
                    disabled={students.length === 0}
                    className="px-4"
                >
                    Submit Attendance
                </Button>

            </div>

        </Container>

    );
}

export default StudentsAttendance;