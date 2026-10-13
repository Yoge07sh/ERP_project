import {
  Container,
  Button,
  Table,
  Card,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";

import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import axios from "axios";

import {
  FaClipboardCheck,
  FaCalendarAlt,
  FaArrowLeft,
  FaEye,
} from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

// Convert a Date into YYYY-MM-DD according to IST
const getDateIST = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
};

function Eregister() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    formData = {},
    classData = {},
    fromDate = "",
    toDate = "",
  } = location.state || {};

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected student/date for lecture details
  const [selectedDetails, setSelectedDetails] = useState(null);

  // Get E-Attendance Register
  const getERegister = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${apiUrl}/eregister`, {
        params: {
          session: classData.session,
          course: classData.course,
          branch: classData.branch,
          year: classData.year,
          semester: classData.semester,
          section: classData.section,
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
    if (
      classData.session &&
      classData.course &&
      classData.branch &&
      classData.year &&
      classData.semester &&
      classData.section &&
      fromDate &&
      toDate
    ) {
      getERegister();
    } else {
      setLoading(false);
    }
  }, [classData, fromDate, toDate]);

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

  // Get all unique dates in IST
  const dates = [
    ...new Set(
      attendanceRecords
        .map((record) => getDateIST(record.date))
        .filter(Boolean),
    ),
  ].sort();

  // Get attendance records for a student on a particular date
  const getStudentDateAttendance = (student, date) => {
    return attendanceRecords.filter((record) => {
      const recordDate = getDateIST(record.date);

      return (
        recordDate === date &&
        record.students?.some(
          (item) => item.studentId?._id === student.studentId,
        )
      );
    });
  };

  // Get daily summary
  const getStudentDateSummary = (student, date) => {
    const dateRecords = getStudentDateAttendance(student, date);

    let present = 0;
    let absent = 0;

    dateRecords.forEach((record) => {
      const attendance = record.students?.find(
        (item) => item.studentId?._id === student.studentId,
      );

      if (attendance?.status === "Present") {
        present++;
      }

      if (attendance?.status === "Absent") {
        absent++;
      }
    });

    return {
      total: present + absent,
      present,
      absent,
    };
  };

  // Get overall attendance summary
  const getStudentOverallSummary = (student) => {
    let totalLectures = 0;
    let presentLectures = 0;
    let absentLectures = 0;

    attendanceRecords.forEach((record) => {
      const attendance = record.students?.find(
        (item) => item.studentId?._id === student.studentId,
      );

      if (!attendance) return;

      totalLectures++;

      if (attendance.status === "Present") {
        presentLectures++;
      }

      if (attendance.status === "Absent") {
        absentLectures++;
      }
    });

    const percentage =
      totalLectures === 0
        ? "0.0"
        : ((presentLectures / totalLectures) * 100).toFixed(1);

    return {
      totalLectures,
      presentLectures,
      absentLectures,
      percentage,
    };
  };

  // Open lecture details
  const handleDateClick = (student, date) => {
    const dateRecords = getStudentDateAttendance(student, date);

    if (dateRecords.length === 0) {
      return;
    }

    setSelectedDetails({
      student,
      date,
      records: dateRecords,
    });
  };

  // Display date in Indian format
  const formatDate = (date) => {
    if (!date) return "-";

    // If already YYYY-MM-DD, convert it safely as an IST calendar date
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split("-");

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return new Date(date).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const generatePDF = () => {
    if (attendanceRecords.length === 0) {
      alert("No attendance records available to generate PDF.");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // -----------------------------
    // College Header
    // -----------------------------

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("R.D. Engineering College", 148, 15, {
      align: "center",
    });

    doc.setFontSize(13);
    doc.text("E-Attendance Register", 148, 23, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // -----------------------------
    // Class Information
    // -----------------------------

    const classInfo = [
      ["Session", formData.session || "-"],
      ["Course", formData.courseName || "-"],
      ["Branch", formData.branchName || "No Branch"],
      ["Year", formData.year || "-"],
      ["Semester", formData.semester || "-"],
      ["Section", formData.section || "-"],
      ["From Date", formatDate(fromDate)],
      ["To Date", formatDate(toDate)],
    ];

    autoTable(doc, {
      startY: 30,
      body: classInfo,
      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 2,
      },

      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 35,
        },
        1: {
          cellWidth: 55,
        },
      },

      margin: {
        left: 14,
      },
    });

    // -----------------------------
    // Attendance Summary
    // -----------------------------

    const summaryStartY = doc.lastAutoTable.finalY + 8;

    const tableHead = [
      [
        "S.No",
        "Roll No.",
        "Student Name",
        ...dates.map((date) => formatDate(date)),
        "Total Lectures",
        "Present",
        "Absent",
        "Attendance %",
      ],
    ];

    const tableBody = students.map((student, index) => {
      const summary = getStudentOverallSummary(student);

      const dailyAttendance = dates.map((date) => {
        const dailySummary = getStudentDateSummary(student, date);

        if (dailySummary.total === 0) {
          return "-";
        }

        return `${dailySummary.present}/${dailySummary.total}`;
      });

      return [
        index + 1,
        student.rollNumber || "-",
        `${student.firstName || ""} ${student.lastName || ""}`.trim(),
        ...dailyAttendance,
        summary.totalLectures,
        summary.presentLectures,
        summary.absentLectures,
        `${summary.percentage}%`,
      ];
    });

    autoTable(doc, {
      startY: summaryStartY,
      head: tableHead,
      body: tableBody,

      theme: "grid",

      styles: {
        fontSize: 6.5,
        cellPadding: 1.5,
        halign: "center",
        valign: "middle",
      },

      headStyles: {
        fontStyle: "bold",
      },

      columnStyles: {
        0: {
          cellWidth: 10,
        },

        1: {
          cellWidth: 18,
        },

        2: {
          cellWidth: 35,
          halign: "left",
        },
      },

      margin: {
        left: 10,
        right: 10,
      },

      didParseCell: (data) => {
        // Keep student name left aligned
        if (data.section === "body" && data.column.index === 2) {
          data.cell.styles.halign = "left";
        }
      },
    });

    // -----------------------------
    // Footer
    // -----------------------------

    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      const pageHeight = doc.internal.pageSize.height;

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Generated on: ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}`,
        10,
        pageHeight - 8,
      );

      doc.text(`Page ${i} of ${pageCount}`, 287, pageHeight - 8, {
        align: "right",
      });
    }

    // -----------------------------
    // File Name
    // -----------------------------

    const fileName = `E-Attendance_${formData.courseName || "Class"}_${
      formData.section || ""
    }_${fromDate}_${toDate}.pdf`;

    doc.save(fileName);
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

          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">E-Attendance Register</h4>

              <p
                className="mb-0"
                style={{
                  color: "#cbd5e1",
                  fontSize: "12px",
                }}
              >
                Date and Lecture wise attendance register
              </p>
            </div>
            <Button
              variant="danger"
              onClick={generatePDF}
              disabled={loading || attendanceRecords.length === 0}
              className="d-flex ms-2 gap-2"
            >
              <FaClipboardCheck />
              Generate PDF Report
            </Button>
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
              Click any daily attendance summary to view lecture-wise details
            </small>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>

              <div className="mt-2 text-muted">Loading attendance...</div>
            </div>
          ) : (
            <>
              {/* Table */}
              {attendanceRecords.length > 0 && (
                <div className="table-responsive">
                  <Table
                    bordered
                    hover
                    className="mb-0 align-middle text-center"
                    style={{
                      minWidth: `${650 + dates.length * 95}px`,
                    }}
                  >
                    <thead className="table-primary">
                      <tr>
                        <th
                          style={{
                            minWidth: "55px",
                            position: "sticky",
                            left: 0,
                            zIndex: 3,
                            backgroundColor: "#cfe2ff",
                          }}
                        >
                          S.No
                        </th>

                        <th
                          style={{
                            minWidth: "100px",
                            position: "sticky",
                            left: "55px",
                            zIndex: 3,
                            backgroundColor: "#cfe2ff",
                          }}
                        >
                          Roll No.
                        </th>

                        <th
                          className="text-start"
                          style={{
                            minWidth: "170px",
                            position: "sticky",
                            left: "155px",
                            zIndex: 3,
                            backgroundColor: "#cfe2ff",
                          }}
                        >
                          Student Name
                        </th>

                        {dates.map((date) => (
                          <th
                            key={date}
                            style={{
                              minWidth: "95px",
                            }}
                          >
                            {formatDate(date)}
                          </th>
                        ))}

                        <th
                          style={{
                            minWidth: "95px",
                            backgroundColor: "#e2e3e5",
                          }}
                        >
                          Total Lectures
                        </th>

                        <th
                          style={{
                            minWidth: "80px",
                            backgroundColor: "#d1e7dd",
                          }}
                        >
                          Present
                        </th>

                        <th
                          style={{
                            minWidth: "80px",
                            backgroundColor: "#f8d7da",
                          }}
                        >
                          Absent
                        </th>

                        <th
                          style={{
                            minWidth: "90px",
                            backgroundColor: "#e2e3e5",
                          }}
                        >
                          Attendance %
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student, index) => {
                        const summary = getStudentOverallSummary(student);

                        return (
                          <tr key={student.studentId}>
                            {/* S.No */}
                            <td
                              style={{
                                position: "sticky",
                                left: 0,
                                zIndex: 2,
                                backgroundColor: "white",
                              }}
                            >
                              {index + 1}
                            </td>

                            {/* Roll No */}
                            <td
                              className="fw-semibold"
                              style={{
                                position: "sticky",
                                left: "55px",
                                zIndex: 2,
                                backgroundColor: "white",
                              }}
                            >
                              {student.rollNumber}
                            </td>

                            {/* Student Name */}
                            <td
                              className="text-start fw-semibold"
                              style={{
                                position: "sticky",
                                left: "155px",
                                zIndex: 2,
                                backgroundColor: "white",
                              }}
                            >
                              {student.firstName} {student.lastName}
                            </td>

                            {/* Dates */}
                            {dates.map((date) => {
                              const dailySummary = getStudentDateSummary(
                                student,
                                date,
                              );

                              const hasAttendance = dailySummary.total > 0;

                              return (
                                <td
                                  key={date}
                                  onClick={() => handleDateClick(student, date)}
                                  style={{
                                    minWidth: "95px",
                                    padding: "6px",
                                    cursor: hasAttendance
                                      ? "pointer"
                                      : "default",
                                  }}
                                  title={
                                    hasAttendance
                                      ? "Click to view lecture details"
                                      : "No attendance"
                                  }
                                >
                                  {!hasAttendance ? (
                                    <span className="text-muted">-</span>
                                  ) : (
                                    <div
                                      className="d-flex flex-column align-items-center"
                                      style={{
                                        lineHeight: "1.2",
                                      }}
                                    >
                                      <span
                                        className={
                                          dailySummary.present ===
                                          dailySummary.total
                                            ? "text-success fw-bold"
                                            : dailySummary.present === 0
                                              ? "text-danger fw-bold"
                                              : "text-primary fw-bold"
                                        }
                                        style={{
                                          fontSize: "14px",
                                        }}
                                      >
                                        {dailySummary.present}/
                                        {dailySummary.total} P
                                      </span>

                                      <small
                                        className="text-muted"
                                        style={{
                                          fontSize: "10px",
                                        }}
                                      >
                                        <FaEye size={9} className="me-1" />
                                        Details
                                      </small>
                                    </div>
                                  )}
                                </td>
                              );
                            })}

                            {/* Total Lectures */}
                            <td className="fw-bold">{summary.totalLectures}</td>

                            {/* Present */}
                            <td>
                              <span className="badge bg-success">
                                {summary.presentLectures}
                              </span>
                            </td>

                            {/* Absent */}
                            <td>
                              <span className="badge bg-danger">
                                {summary.absentLectures}
                              </span>
                            </td>

                            {/* Percentage */}
                            <td>
                              <span
                                className={
                                  Number(summary.percentage) >= 75
                                    ? "badge bg-success"
                                    : "badge bg-danger"
                                }
                              >
                                {summary.percentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}

              {/* No Records */}
              {attendanceRecords.length === 0 && (
                <div className="text-center text-muted py-5">
                  No attendance records found.
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Lecture Details Modal */}
      <Modal
        show={Boolean(selectedDetails)}
        onHide={() => setSelectedDetails(null)}
        centered
        size="lg"
      >
        {selectedDetails && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Lecture Attendance</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {/* Student information */}
              <div className="border rounded p-3 bg-light mb-3">
                <Row className="g-2">
                  <Col md={6}>
                    <small className="text-muted d-block">STUDENT</small>

                    <div className="fw-bold">
                      {selectedDetails.student.firstName}{" "}
                      {selectedDetails.student.lastName}
                    </div>
                  </Col>

                  <Col md={3}>
                    <small className="text-muted d-block">ROLL NO.</small>

                    <div className="fw-bold">
                      {selectedDetails.student.rollNumber}
                    </div>
                  </Col>

                  <Col md={3}>
                    <small className="text-muted d-block">DATE</small>

                    <div className="fw-bold">
                      {formatDate(selectedDetails.date)}
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Lecture table */}
              <div className="table-responsive">
                <Table
                  bordered
                  hover
                  responsive
                  className="align-middle text-center mb-0"
                >
                  <thead className="table-primary">
                    <tr>
                      <th>Lecture</th>
                      <th className="text-start">Subject</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...selectedDetails.records]
                      .sort(
                        (a, b) =>
                          (a.timeSlotId?.lectureNo ?? 999) -
                          (b.timeSlotId?.lectureNo ?? 999),
                      )
                      .map((record) => {
                        const attendance = record.students?.find(
                          (item) =>
                            item.studentId?._id ===
                            selectedDetails.student.studentId,
                        );

                        const subjectName =
                          record.facultyMapId?.subjectId?.subjectFullName ||
                          record.facultyMapId?.subjectId?.fullName ||
                          record.facultyMapId?.subjectId?.subjectName ||
                          "Subject";

                        const lectureNo = record.timeSlotId?.lectureNo;

                        const timeSlot = record.timeSlotId?.timeSlot || "-";

                        const status = attendance?.status;

                        return (
                          <tr key={record._id}>
                            <td className="fw-bold">L{lectureNo ?? "-"}</td>

                            <td className="text-start fw-semibold">
                              {subjectName}
                            </td>

                            <td>{timeSlot}</td>

                            <td>
                              {status === "Present" ? (
                                <span className="badge bg-success">
                                  Present
                                </span>
                              ) : status === "Absent" ? (
                                <span className="badge bg-danger">Absent</span>
                              ) : (
                                <span className="badge bg-secondary">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>

              {/* Daily summary */}
              {(() => {
                let present = 0;
                let absent = 0;

                selectedDetails.records.forEach((record) => {
                  const attendance = record.students?.find(
                    (item) =>
                      item.studentId?._id === selectedDetails.student.studentId,
                  );

                  if (attendance?.status === "Present") {
                    present++;
                  }

                  if (attendance?.status === "Absent") {
                    absent++;
                  }
                });

                const total = present + absent;

                return (
                  <div className="mt-3 border rounded p-3 bg-light">
                    <Row className="text-center">
                      <Col>
                        <small className="text-muted d-block">
                          TOTAL LECTURES
                        </small>

                        <strong>{total}</strong>
                      </Col>

                      <Col>
                        <small className="text-muted d-block">PRESENT</small>

                        <strong className="text-success">{present}</strong>
                      </Col>

                      <Col>
                        <small className="text-muted d-block">ABSENT</small>

                        <strong className="text-danger">{absent}</strong>
                      </Col>
                    </Row>
                  </div>
                );
              })()}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setSelectedDetails(null)}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

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
