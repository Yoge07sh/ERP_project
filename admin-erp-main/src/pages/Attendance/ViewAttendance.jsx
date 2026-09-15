import { Container, Button, Table, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function ViewAttendance() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        formData = {},
        facultyMapId = ""
    } = location.state || {};

    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const getAttendance = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${apiUrl}/viewattendance`,
                {
                    params: {
                        mappingId: facultyMapId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setAttendanceRecords(response.data.data || []);
            }

        } catch (err) {

            console.error("View attendance error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to fetch attendance"
            );
        }
    };

    useEffect(() => {
        if (facultyMapId) {
            getAttendance();
        }
    }, [facultyMapId]);

    return (
        <Container className="py-3">

            <div className="text-center mb-3">
                <h3 className="text-primary fw-bold mb-1">
                    VIEW ATTENDANCE
                </h3>
            </div>

            <Card className="shadow-sm border-0 mb-3">
                <Card.Body className="py-3">

                    <h5 className="text-center fw-bold mb-0">

                        {formData.courseName}{" "}

                        {formData.branchName
                            ? `[${formData.branchName}]`
                            : ""}{" "}

                        <span className="text-muted">
                            ({formData.year} Year,
                            Semester {formData.semester},
                            Section {formData.section})
                        </span>

                    </h5>

                </Card.Body>
            </Card>

            {attendanceRecords.map((record) => (

                <Card
                    key={record._id}
                    className="shadow-sm border-0 mb-3"
                >

                    <Card.Body className="p-0">

                        <div className="p-2 text-center border-bottom">
                            <strong>
                                Date:{" "}
                                {new Date(record.date).toLocaleDateString("en-IN")}
                                {" | "}
                                Lecture:{" "}
                                {record.timeSlotId?.lectureNo}
                                {" | "}
                                {record.timeSlotId?.timeSlot}
                            </strong>
                        </div>

                        <Table
                            bordered
                            hover
                            responsive
                            className="mb-0 align-middle"
                        >

                            <thead className="table-primary">

                                <tr>
                                    <th className="text-center">
                                        S.No
                                    </th>

                                    <th className="text-center">
                                        Roll No.
                                    </th>

                                    <th>
                                        Student Name
                                    </th>

                                    <th className="text-center">
                                        Attendance
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {record.students?.map((student, index) => (

                                    <tr key={student._id}>

                                        <td className="text-center">
                                            {index + 1}
                                        </td>

                                        <td className="text-center">
                                            {student.studentId?.rollNumber}
                                        </td>

                                        <td>
                                            {student.studentId?.firstName}{" "}
                                            {student.studentId?.lastName}
                                        </td>

                                        <td className="text-center">

                                            <span
                                                className={
                                                    student.status === "Present"
                                                        ? "badge bg-success"
                                                        : "badge bg-danger"
                                                }
                                            >
                                                {student.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </Table>

                    </Card.Body>

                </Card>

            ))}

            {attendanceRecords.length === 0 && (

                <div className="text-center text-muted py-4">
                    No attendance records found.
                </div>

            )}

            <div className="text-end mt-3">

                <Button
                    variant="secondary"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

            </div>

        </Container>
    );
}

export default ViewAttendance;