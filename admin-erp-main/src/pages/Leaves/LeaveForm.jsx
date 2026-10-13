import { Col, Container, Row, Form, Button, Card } from "react-bootstrap";

import { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function LeaveForm() {
  const [applicantName, setApplicantName] = useState("");
  const [designation, setDesignation] = useState("");

  const [session, setSession] = useState("");
  const [leave_name, setLeave_name] = useState("");

  const [date, setDate] = useState("");
  const [half, setHalf] = useState("");
  const [toDate, setToDate] = useState("");

  const [numberOfLeaves, setNumberOfLeaves] = useState(0);

  const [purpose, setPurpose] = useState("");
  const [leaveAddress, setLeaveAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [facultyList, setFacultyList] = useState([]);

  const [arrangements, setArrangements] = useState([
    {
      date: "",
      time: "",
      subject: "",
      dutyPerson: "",
    },
  ]);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not found. Please login again.");
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      const userId = decodedToken._id;

      axios({
        url: apiUrl + "/faculty/for/leave/" + userId,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.data.success && res.data.data) {
            const faculty = res.data.data;

            setApplicantName(
              `${faculty.firstName} ${faculty.lastName || ""}`.trim(),
            );

            setDesignation(faculty.designation || "Faculty");
          }
        })
        .catch((err) => {
          alert(err);
        });
      axios({
        url: apiUrl + "/active/faculty",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.data.success && res.data.data) {
            setFacultyList(res.data.data);
          }
        })
        .catch((err) => {
          alert(err);
        });
    } catch (error) {
      alert(error);
    }
  }, []);

  function calculateLeaves(from, to) {
    if (!from || !to) {
      setNumberOfLeaves(0);
      return;
    }

    const start = new Date(from);
    const end = new Date(to);

    if (end < start) {
      setNumberOfLeaves(0);
      return;
    }

    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setNumberOfLeaves(days);
  }

  function handleFromDateChange(value) {
    setDate(value);

    if (leave_name === "Short Leave") {
      setToDate(value);
      setNumberOfLeaves(value ? 0.5 : 0);
    } else {
      calculateLeaves(value, toDate);
    }
  }

  function handleLeaveTypeChange(value) {
    setLeave_name(value);

    setHalf("");
    setDate("");
    setToDate("");
    setNumberOfLeaves(0);
  }

  function updateArrangement(index, field, value) {
    const updatedArrangements = [...arrangements];

    updatedArrangements[index] = {
      ...updatedArrangements[index],
      [field]: value,
    };

    setArrangements(updatedArrangements);
  }

  function addArrangement() {
    setArrangements([
      ...arrangements,
      {
        date: "",
        time: "",
        subject: "",
        dutyPerson: "",
      },
    ]);
  }

  function removeArrangement(index) {
    setArrangements(arrangements.filter((_, i) => i !== index));
  }

  async function applyLeave() {
    if (!termsAccepted) {
      alert(
        "Please accept the Terms and Conditions before applying for leave.",
      );

      return;
    }

    if (!session) {
      alert("Please select session.");
      return;
    }

    if (!leave_name) {
      alert("Please select type of leave.");
      return;
    }

    if (!date) {
      alert("Please select leave date.");
      return;
    }

    if (leave_name !== "Short Leave" && !toDate) {
      alert("Please select leave to date.");
      return;
    }

    if (!purpose.trim()) {
      alert("Please enter purpose of leave.");
      return;
    }

    if (!leaveAddress.trim()) {
      alert("Please enter address during leave.");
      return;
    }

    if (!contactNumber.trim()) {
      alert("Please enter contact number.");
      return;
    }

    for (const arrangement of arrangements) {
      if (
        !arrangement.date ||
        !arrangement.time ||
        !arrangement.subject ||
        !arrangement.dutyPerson
      ) {
        alert("Please complete all alternative arrangement details.");

        return;
      }
    }

    const dutyPersons = arrangements.map((item) => item.dutyPerson);

    const uniqueDutyPersons = new Set(dutyPersons);

    if (uniqueDutyPersons.size !== dutyPersons.length) {
      alert("The same arrangement faculty cannot be selected more than once.");

      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const data = {
        session,

        leave_name,

        from: date,

        toDate: leave_name === "Short Leave" ? date : toDate,

        half: leave_name === "Short Leave" ? half : "Full Day",

        numberOfLeaves: Number(numberOfLeaves),

        purpose,

        leaveAddress,

        contactNumber,

        alternativeArrangements: arrangements.map((item) => ({
          date: item.date,

          time: item.time,

          subject: item.subject,

          dutyPerson: item.dutyPerson,

          arrangementStatus: "Pending",
        })),
      };

      // ------------------------------------------
      // Submit leave
      // ------------------------------------------

      const res = await axios({
        url: apiUrl + "/leave/apply",

        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        data: data,
      });

      if (res.data.success || res.status === 201) {
        alert(
          "Leave application submitted successfully.\n\n" +
            "The selected arrangement faculty must accept the arrangement before the leave is sent to admin.",
        );

        // Reset form

        setSession("");
        setLeave_name("");
        setDate("");
        setHalf("");
        setToDate("");
        setNumberOfLeaves(0);

        setPurpose("");
        setLeaveAddress("");
        setContactNumber("");

        setArrangements([
          {
            date: "",
            time: "",
            subject: "",
            dutyPerson: "",
          },
        ]);

        setTermsAccepted(false);
      }
    } catch (err) {
      console.log("Leave application error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while applying for leave.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={9} md={11}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="text-center text-danger mb-4">APPLY FOR LEAVE</h3>

              {/* -------------------------------- */}
              {/* APPLICANT DETAILS */}
              {/* -------------------------------- */}

              <h5 className="mb-3">Applicant Details</h5>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Applicant Name</Form.Label>

                    <Form.Control
                      type="text"
                      value={applicantName}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Designation</Form.Label>

                    <Form.Control
                      type="text"
                      value={designation}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />

              {/* -------------------------------- */}
              {/* LEAVE DETAILS */}
              {/* -------------------------------- */}

              <h5 className="mb-3">Leave Details</h5>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Session</Form.Label>

                    <Form.Select
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                    >
                      <option value="">--- Select Session ---</option>

                      <option value="2025-26">2025-26</option>

                      <option value="2026-27">2026-27</option>

                      <option value="2027-28">2027-28</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Type of Leave</Form.Label>

                    <Form.Select
                      value={leave_name}
                      onChange={(e) => handleLeaveTypeChange(e.target.value)}
                    >
                      <option value="">--- Select Leave ---</option>

                      <option value="Casual Leave">Casual Leave</option>

                      <option value="Medical Leave">Medical Leave</option>

                      <option value="Earned Leave">Earned Leave</option>

                      <option value="Short Leave">Short Leave</option>

                      <option value="Emergency Leave">Emergency Leave</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Date</Form.Label>

                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => handleFromDateChange(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                {leave_name === "Short Leave" && (
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Select Half</Form.Label>

                      <div>
                        <Form.Check
                          type="radio"
                          label="1st Half"
                          name="half"
                          value="First Half"
                          checked={half === "First Half"}
                          onChange={(e) => setHalf(e.target.value)}
                          inline
                        />

                        <Form.Check
                          type="radio"
                          label="2nd Half"
                          name="half"
                          value="Second Half"
                          checked={half === "Second Half"}
                          onChange={(e) => setHalf(e.target.value)}
                          inline
                        />
                      </div>
                    </Form.Group>
                  </Col>
                )}
              </Row>

              {leave_name !== "" && leave_name !== "Short Leave" && (
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Leave To</Form.Label>

                      <Form.Control
                        type="date"
                        value={toDate}
                        min={date}
                        onChange={(e) => {
                          setToDate(e.target.value);

                          calculateLeaves(date, e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>No. of Leaves</Form.Label>

                      <Form.Control
                        type="number"
                        value={numberOfLeaves}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <hr />

              {/* -------------------------------- */}
              {/* ADDITIONAL DETAILS */}
              {/* -------------------------------- */}

              <h5 className="mb-3">Additional Details</h5>

              <Row>
                <Col className="mb-3">
                  <Form.Group>
                    <Form.Label>Purpose of Leave</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter purpose of leave"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="mb-3">
                  <Form.Group>
                    <Form.Label>Address During Leave</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Enter address where you will be staying during leave"
                      value={leaveAddress}
                      onChange={(e) => setLeaveAddress(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Contact Number During Leave</Form.Label>

                    <Form.Control
                      type="tel"
                      placeholder="Enter contact number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />

              {/* -------------------------------- */}
              {/* ALTERNATIVE ARRANGEMENT */}
              {/* -------------------------------- */}

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">Alternative Arrangement</h5>

                  <small className="text-muted">
                    The selected faculty member must accept the arrangement
                    before your leave is sent to admin.
                  </small>
                </div>
              </div>

              {arrangements.map((arrangement, index) => (
                <Card key={index} className="mb-3 border">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Arrangement {index + 1}</h6>

                      {arrangements.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeArrangement(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <Row>
                      {/* Date */}

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label>Date</Form.Label>

                          <Form.Control
                            type="date"
                            value={arrangement.date}
                            min={date || undefined}
                            max={toDate || date || undefined}
                            onChange={(e) =>
                              updateArrangement(index, "date", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>

                      {/* Time */}

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label>Time</Form.Label>

                          <Form.Control
                            type="time"
                            value={arrangement.time}
                            onChange={(e) =>
                              updateArrangement(index, "time", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>

                      {/* Faculty */}

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label>Arrangement Faculty</Form.Label>

                          <Form.Select
                            value={arrangement.dutyPerson}
                            onChange={(e) =>
                              updateArrangement(
                                index,
                                "dutyPerson",
                                e.target.value,
                              )
                            }
                          >
                            <option value="">--- Select Faculty ---</option>

                            {facultyList.map((faculty) => (
                              <option key={faculty._id} value={faculty._id}>
                                {faculty.firstName} {faculty.lastName || ""}
                                {" - "}
                                {faculty.collegeId}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Subject / Other Works</Form.Label>

                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter subject or other works"
                            value={arrangement.subject}
                            onChange={(e) =>
                              updateArrangement(
                                index,
                                "subject",
                                e.target.value,
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              <div className="mb-4">
                <Button variant="outline-primary" onClick={addArrangement}>
                  + Add More Arrangement
                </Button>
              </div>

              <hr />

              {/* -------------------------------- */}
              {/* TERMS */}
              {/* -------------------------------- */}

              <Row className="mt-4">
                <Col>
                  <Form.Check
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    label={
                      <span className="text-danger">
                        1. Leave Application must be submitted before 2 days
                        prior except any Emergency/Short Leave.
                        <br />
                        2. In emergency may be submitted within 2 days after
                        resuming his/her duty with proof of documents if any.
                        <br />
                        3. Short leave shall be allowed only after proper
                        arrangement of duty by faculty preferably from same
                        section teacher or subject teacher of any section.
                        <br />
                        4. Engaged concern person should be involved in same
                        activity.
                        <br />
                        5. Any Emergency Leave will be sanction by the Director
                        only.
                      </span>
                    }
                  />
                </Col>
              </Row>

              {/* -------------------------------- */}
              {/* SUBMIT */}
              {/* -------------------------------- */}

              <div className="text-center mt-3">
                <Button
                  variant="success"
                  className="px-5 apply-leave-btn"
                  onClick={applyLeave}
                  disabled={!termsAccepted || loading}
                >
                  {loading ? "Submitting..." : "Apply Leave"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LeaveForm;
