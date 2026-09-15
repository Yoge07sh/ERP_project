import { Container, Button, Table, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function StudentsAttendance() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        students = [],
        formData = {},
        facultyMapId = "",
        timeSlotId = "",
    } = location.state || {};

    const [attendance, setAttendance] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!facultyMapId) {
            alert("Mapping information is missing.");
            return;
        }

        if (!timeSlotId) {
            alert("Time slot is missing.");
            return;
        }

        if (students.length === 0) {
            alert("No students found.");
            return;
        }

        try {
            setSubmitting(true);

            const token = localStorage.getItem("token");

            const attendanceData = students.map((student) => ({
                studentId: student._id,
                status: attendance[student._id] || "Present"
            }));

            const response = await axios.post(
                `${apiUrl}/attendance`,
                {
                    facultyMapId: facultyMapId,
                    timeSlotId: timeSlotId,
                    students: attendanceData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                alert("Attendance submitted successfully!");
                navigate('/getstudents')
            }

        } catch (err) {
            console.error("Attendance submission error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to submit attendance"
            );
        } finally {
            setSubmitting(false);
        }
    };
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
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={
                                                        (attendance[student._id] || "Present") === "Present"
                                                            ? "success"
                                                            : "outline-success"
                                                    }
                                                    onClick={() =>
                                                        setAttendance({
                                                            ...attendance,
                                                            [student._id]: "Present"
                                                        })
                                                    }
                                                >
                                                    Present
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant={
                                                        (attendance[student._id] || "Present") === "Absent"
                                                            ? "danger"
                                                            : "outline-danger"
                                                    }
                                                    onClick={() =>
                                                        setAttendance({
                                                            ...attendance,
                                                            [student._id]: "Absent"
                                                        })
                                                    }
                                                >
                                                    Absent
                                                </Button>
                                            </div>
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
                    disabled={students.length === 0 || submitting}
                    className="px-4"
                    onClick={handleSubmit}
                >
                    {submitting ? "Submitting..." : "Submit Attendance"}
                </Button>
            </div>

        </Container>

    );
}

export default StudentsAttendance;