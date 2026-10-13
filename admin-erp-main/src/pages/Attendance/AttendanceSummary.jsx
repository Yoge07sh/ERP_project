import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function AttendanceSummary() {
  const navigate = useNavigate();

  const [date, setDate] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // Format Date
  // --------------------------------
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "";

  // --------------------------------
  // Fetch Attendance Summary
  // --------------------------------
  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/attendance/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch attendance summary");
        }

        setDate(data.date || null);
        setLectures(data.data || []);
      } catch (error) {
        console.error("Attendance Summary Error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, []);

  // --------------------------------
  // Statistics
  // --------------------------------
  const totalLectures = lectures.length;

  const markedLectures = lectures.filter(
    (lecture) => lecture.status === "Marked",
  ).length;

  const notMarkedLectures = lectures.filter(
    (lecture) => lecture.status === "Not Marked",
  ).length;

  // --------------------------------
  // Attendance Percentage
  // --------------------------------
  const attendancePercentage =
    totalLectures > 0 ? Math.round((markedLectures / totalLectures) * 100) : 0;

  // --------------------------------
  // Edit Attendance
  // --------------------------------
  const handleEdit = (lecture) => {
    navigate("/edit/attendance", {
      state: {
        attendanceId: lecture.attendanceId,
        facultyMapId: lecture.facultyMapId,
        timeSlotId: lecture.timeSlotId,
        date: date
          ? new Date(date).toLocaleDateString("en-CA", {
              timeZone: "Asia/Kolkata",
            })
          : "",
      },
    });
  };

  // --------------------------------
  // View Attendance
  // --------------------------------
  const handleView = (lecture) => {
    navigate("/viewattendance", {
      state: {
        facultyMapId: lecture.facultyMapId,
        SingletimeSlot: lecture.timeSlotId,
        selectedDate: date
          ? new Date(date).toLocaleDateString("en-CA", {
              timeZone: "Asia/Kolkata",
            })
          : "",
      },
    });
  };

  // --------------------------------
  // Mark Attendance
  // --------------------------------
  const handleMark = (lecture) => {
    navigate("/studentsattendance", {
      state: {
        facultyMapId: lecture.facultyMapId,
        timeSlotId: lecture.timeSlotId,
      },
    });
  };

  return (
    <Container fluid className="py-4 px-3 px-md-4">
      {/* =========================
          DASHBOARD HEADER
      ========================== */}
      <Card
        className="border-0 shadow-sm mb-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
          borderRadius: "16px",
        }}
      >
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <div className="text-white">
                <div
                  className="small fw-semibold mb-2"
                  style={{ opacity: 0.8 }}
                >
                  FACULTY PORTAL
                </div>

                <h2 className="fw-bold mb-2">Attendance Dashboard</h2>

                <p className="mb-0" style={{ opacity: 0.85 }}>
                  Monitor and manage today's lecture attendance
                </p>
              </div>
            </Col>

            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div
                className="d-inline-block bg-white rounded-3 px-4 py-3 shadow-sm"
                style={{ minWidth: "190px" }}
              >
                <div className="text-muted small mb-1">ATTENDANCE DATE</div>

                <div className="fw-bold text-primary">
                  {loading ? "Loading..." : formattedDate || "-"}
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* =========================
          STATISTICS
      ========================== */}
      <Row className="g-3 mb-4">
        {/* Total */}
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small fw-semibold">
                    TOTAL LECTURES
                  </div>

                  <h2 className="fw-bold mt-2 mb-0">{totalLectures}</h2>

                  <small className="text-muted">Scheduled today</small>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
                  style={{
                    width: "46px",
                    height: "46px",
                    fontSize: "20px",
                  }}
                >
                  📚
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Marked */}
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small fw-semibold">MARKED</div>

                  <h2 className="fw-bold text-success mt-2 mb-0">
                    {markedLectures}
                  </h2>

                  <small className="text-muted">Attendance completed</small>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success"
                  style={{
                    width: "46px",
                    height: "46px",
                    fontSize: "20px",
                  }}
                >
                  ✓
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Pending */}
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small fw-semibold">PENDING</div>

                  <h2 className="fw-bold text-danger mt-2 mb-0">
                    {notMarkedLectures}
                  </h2>

                  <small className="text-muted">Awaiting attendance</small>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger"
                  style={{
                    width: "46px",
                    height: "46px",
                    fontSize: "20px",
                  }}
                >
                  !
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Completion */}
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small fw-semibold">COMPLETION</div>

                  <h2 className="fw-bold text-primary mt-2 mb-0">
                    {attendancePercentage}%
                  </h2>

                  <small className="text-muted">Today's progress</small>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
                  style={{
                    width: "46px",
                    height: "46px",
                    fontSize: "20px",
                  }}
                >
                  %
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* =========================
          PROGRESS BAR
      ========================== */}
      {!loading && !error && totalLectures > 0 && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className="fw-bold mb-1">Today's Attendance Progress</h6>

                <small className="text-muted">
                  {markedLectures} of {totalLectures} lectures completed
                </small>
              </div>

              <span className="fw-bold text-primary">
                {attendancePercentage}%
              </span>
            </div>

            <div
              className="progress"
              style={{ height: "8px", borderRadius: "10px" }}
            >
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
          </Card.Body>
        </Card>
      )}

      {/* =========================
          LECTURE TABLE
      ========================== */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="p-4 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">Lecture Attendance</h5>

                <small className="text-muted">
                  Manage attendance lecture by lecture
                </small>
              </div>

              {!loading && (
                <Badge bg="light" text="dark" className="border px-3 py-2">
                  {totalLectures} Lectures
                </Badge>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />

              <div className="mt-3 text-muted">
                Loading attendance summary...
              </div>
            </div>
          ) : error ? (
            <div className="p-4">
              <div className="alert alert-danger mb-0">{error}</div>
            </div>
          ) : lectures.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="mx-auto mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  fontSize: "26px",
                }}
              >
                📅
              </div>

              <h6 className="fw-bold">No Lecture Data</h6>

              <p className="text-muted mb-0">
                There are no lectures scheduled for today.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Subject</th>
                    <th>Lecture</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th className="text-center pe-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {lectures.map((lecture) => (
                    <tr key={`${lecture.facultyMapId}-${lecture.timeSlotId}`}>
                      {/* Subject */}
                      <td className="ps-4">
                        <div className="fw-semibold">
                          {lecture.subject || "—"}
                        </div>
                      </td>

                      {/* Lecture */}
                      <td>
                        <Badge bg="light" text="dark" className="border">
                          L{lecture.lectureNo}
                        </Badge>
                      </td>

                      {/* Time */}
                      <td>
                        <span className="text-muted">
                          {lecture.timeSlot || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        {lecture.status === "Marked" ? (
                          <Badge bg="success" className="px-3 py-2">
                            ✓ Marked
                          </Badge>
                        ) : (
                          <Badge bg="danger" className="px-3 py-2">
                            ✕ Not Marked
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="text-center pe-4">
                        {lecture.status === "Marked" ? (
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleView(lecture)}
                            >
                              View
                            </Button>

                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(lecture)}
                            >
                              Edit
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleMark(lecture)}
                          >
                            Mark Attendance
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
