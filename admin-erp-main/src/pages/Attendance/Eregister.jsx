import { Container, Button, Table, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import {
  FaClipboardCheck,
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";

function Eregister() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    formData = {},
    facultyMapId = "",
    timeSlotId = "",
    fromDate = "",
    toDate = "",
  } = location.state || {};

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const getERegister = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${apiUrl}/eregister`, {
        params: {
          mappingId: facultyMapId,
          timeSlotId: timeSlotId,
          fromDate: fromDate,
          toDate: toDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAttendanceRecords(response.data.data || []);
      }
    } catch (error) {
      console.error("E-Register error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch E-Attendance Register",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (facultyMapId && timeSlotId && fromDate && toDate) {
      getERegister();
    }
  }, [facultyMapId, timeSlotId, fromDate, toDate]);
  // Get all unique students
  // Get all unique students
  const students = [];

  attendanceRecords.forEach((record) => {
    record.students?.forEach((student) => {
      const studentData = student.studentId;

      if (!studentData) return;

      const exists = students.find(
        (item) => item.studentId === studentData._id,
      );

      if (!exists) {
        students.push({
          studentId: studentData._id,
          rollNumber: studentData.rollNumber,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
        });
      }
    });
  });
  // Find attendance for a student on a particular date/time slot
  // Calculate attendance percentage
  const getStudentStatus = (student, record) => {
    const attendance = record.students?.find(
      (item) => item.studentId?._id === student.studentId,
    );

    return attendance?.status || "-";
  };
  const getAttendancePercentage = (student) => {
    const total = attendanceRecords.length;

    if (total === 0) {
      return 0;
    }

    const present = attendanceRecords.filter(
      (record) => getStudentStatus(student, record) === "Present",
    ).length;

    return ((present / total) * 100).toFixed(1);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Container
      fluid
      className="pb-4"
      style={{
        marginTop: "-15px",
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        className="mb-4 p-4 rounded-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
          color: "white",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: "52px",
              height: "52px",
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          >
            <FaClipboardCheck size={25} />
          </div>

          <div>
            <h4 className="mb-1 fw-bold">E-Attendance Register</h4>

            <p
              className="mb-0"
              style={{
                color: "#cbd5e1",
                fontSize: "12px",
              }}
            >
              Date and time slot wise attendance register
            </p>
          </div>
        </div>
      </div>

      {/* Class Information */}
      <Card className="shadow-sm border-0 mb-3">
        <Card.Body className="p-2">
          <h6 className="fw-bold mb-2">Class Information</h6>

          <div className="border rounded p-2 bg-light">
            <Row className="g-0 text-center align-items-center">
              {/* Course */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">COURSE</small>
                <div className="fw-bold text-primary">
                  {formData.courseName || "-"}
                </div>
              </Col>

              {/* Branch */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">BRANCH</small>
                <div className="fw-bold">
                  {formData.branchName || "No Branch"}
                </div>
              </Col>

              {/* Session */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SESSION</small>
                <div className="fw-bold">{formData.session || "-"}</div>
              </Col>

              {/* Year */}
              <Col lg={1} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">YEAR</small>
                <div className="fw-bold">{formData.year || "-"}</div>
              </Col>

              {/* Semester */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SEMESTER</small>
                <div className="fw-bold">{formData.semester || "-"}</div>
              </Col>

              {/* Section */}
              <Col lg={1} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SECTION</small>
                <div className="fw-bold">{formData.section || "-"}</div>
              </Col>

              {/* Time Slot */}
              <Col lg={2} md={4} sm={6}>
                <small className="text-muted d-block">TIME SLOT</small>

                <div className="fw-bold text-primary d-flex align-items-center justify-content-center gap-1">
                  <FaClock size={13} />
                  <span>
                    {attendanceRecords[0]?.timeSlotId?.timeSlot ||
                      "Selected Time Slot"}
                  </span>
                </div>
              </Col>
            </Row>
          </div>

          {/* Date Range */}
          <Row className="mt-2 g-2">
            <Col md={6}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">
                  <FaCalendarAlt className="me-1 text-primary" />
                  FROM DATE
                </small>

                <div className="fw-bold">{formatDate(fromDate)}</div>
              </div>
            </Col>

            <Col md={6}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">
                  <FaCalendarAlt className="me-1 text-danger" />
                  TO DATE
                </small>

                <div className="fw-bold">{formatDate(toDate)}</div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* Attendance Register */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="p-3 border-bottom">
            <h5 className="fw-bold mb-1">Attendance Register</h5>

            <small className="text-muted">
              Attendance for selected time slot and date range
            </small>
          </div>

          <div className="table-responsive">
            <Table bordered hover className="mb-0 align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th
                    style={{
                      minWidth: "90px",
                    }}
                  >
                    S.No
                  </th>

                  <th
                    style={{
                      minWidth: "110px",
                    }}
                  >
                    Roll No.
                  </th>

                  <th
                    className="text-start"
                    style={{
                      minWidth: "180px",
                    }}
                  >
                    Student Name
                  </th>

                  {attendanceRecords.map((record, index) => (
                    <th
                      key={index}
                      style={{
                        minWidth: "140px",
                      }}
                    >
                      <div>{formatDate(record.date)}</div>

                      <small>{record.timeSlotId?.timeSlot || "-"}</small>
                    </th>
                  ))}

                  <th
                    style={{
                      minWidth: "110px",
                    }}
                  >
                    Attendance %
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => {
                  const percentage = getAttendancePercentage(student);

                  return (
                    <tr key={student.rollNumber}>
                      <td>{index + 1}</td>

                      <td className="fw-semibold">{student.rollNumber}</td>

                      <td className="text-start">
                        {student.firstName} {student.lastName}
                      </td>

                      {attendanceRecords.map((record, recordIndex) => {
                        const status = getStudentStatus(student, record);

                        return (
                          <td key={recordIndex}>
                            {status === "Present" && (
                              <span className="badge bg-success">P</span>
                            )}

                            {status === "Absent" && (
                              <span className="badge bg-danger">A</span>
                            )}

                            {status === "-" && (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        );
                      })}

                      <td>
                        <span
                          className={
                            percentage >= 75
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* No Records */}
          {attendanceRecords.length === 0 && (
            <div className="text-center text-muted py-5">
              No attendance records found.
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Back */}
      <div className="text-end mt-3">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="d-flex align-items-center gap-2 ms-auto"
        >
          <FaArrowLeft />
          Back
        </Button>
      </div>
    </Container>
  );
}

export default Eregister;
