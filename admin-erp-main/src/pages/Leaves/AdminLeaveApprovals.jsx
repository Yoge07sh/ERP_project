import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Nav,
} from "react-bootstrap";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const TABS = ["Pending Admin", "Approved", "Rejected"];

const statusColor = {
  "Pending Admin": "info",
  Approved: "success",
  Rejected: "danger",
};

function AdminLeaveApprovals() {
  const [tab, setTab] = useState("Pending Admin");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  function load(status) {
    setLoading(true);
    axios
      .get(apiUrl + "/admin/leaves", { headers, params: { status } })
      .then((res) => setLeaves(res.data.data))
      .catch((err) =>
        alert(err.response?.data?.message || "Could not load leaves"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(tab);
  }, [tab]);

  function openReview(leave) {
    setSelected(leave);
    setRemark("");
  }

  async function decide(action) {
    if (action === "Rejected" && !remark.trim()) {
      alert("Please enter a reason for rejecting.");
      return;
    }
    try {
      setSaving(true);
      await axios.patch(
        `${apiUrl}/admin/leaves/${selected._id}/decision`,
        { action, remark },
        { headers },
      );
      setSelected(null);
      load(tab);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const fmt = (d) => new Date(d).toLocaleDateString();

  return (
    <Container fluid className="py-4 px-4">
      <h3 className="mb-3">Leave Approvals</h3>

      <Nav variant="pills" className="mb-3" activeKey={tab} onSelect={setTab}>
        {TABS.map((t) => (
          <Nav.Item key={t}>
            <Nav.Link eventKey={t}>
              {t === "Pending Admin" ? "Pending" : t}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : leaves.length === 0 ? (
            <p className="text-muted mb-0">No leaves found.</p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Applicant</th>
                  <th>Leave</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      {leave.applicantName}
                      <div className="small text-muted">
                        {leave.designation}
                        {leave.facultyId?.collegeId &&
                          ` · ${leave.facultyId.collegeId}`}
                      </div>
                    </td>
                    <td>{leave.leave_name}</td>
                    <td>
                      {fmt(leave.from)} – {fmt(leave.toDate)}
                    </td>
                    <td>{leave.numberOfLeaves}</td>
                    <td>
                      <Badge bg={statusColor[leave.status] || "secondary"}>
                        {leave.status === "Pending Admin"
                          ? "Pending"
                          : leave.status}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant={
                          leave.status === "Pending Admin"
                            ? "primary"
                            : "outline-secondary"
                        }
                        onClick={() => openReview(leave)}
                      >
                        {leave.status === "Pending Admin" ? "Review" : "View"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={!!selected}
        onHide={() => setSelected(null)}
        size="lg"
        centered
      >
        {selected && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                {selected.applicantName}
                <div className="fs-6 text-muted">{selected.designation}</div>
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p className="mb-1">
                <strong>{selected.leave_name}</strong> ({selected.session}) ·{" "}
                {fmt(selected.from)} – {fmt(selected.toDate)} ·{" "}
                {selected.numberOfLeaves} day(s)
                {selected.half !== "Full Day" && ` · ${selected.half}`}
              </p>
              <p className="mb-1">
                <strong>Purpose:</strong> {selected.purpose}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {selected.leaveAddress}
              </p>
              <p>
                <strong>Contact:</strong> {selected.contactNumber}
              </p>

              <h6 className="mt-3">Alternative Arrangements</h6>
              <Table size="sm" bordered>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Faculty</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.alternativeArrangements || []).map((a, i) => (
                    <tr key={i}>
                      <td>{fmt(a.date)}</td>
                      <td>{a.time}</td>
                      <td>{a.subject}</td>
                      <td>
                        {a.dutyPerson
                          ? `${a.dutyPerson.firstName} ${a.dutyPerson.lastName || ""}`
                          : "—"}
                      </td>
                      <td>{a.arrangementStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {selected.status === "Pending Admin" ? (
                <Form.Group className="mt-3">
                  <Form.Label>Remark (required if rejecting)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter remark"
                  />
                </Form.Group>
              ) : (
                <p className="mt-3 mb-0">
                  <strong>Admin remark:</strong> {selected.adminRemark || "—"}
                  {selected.reviewedAt && (
                    <span className="text-muted">
                      {" "}
                      ({fmt(selected.reviewedAt)})
                    </span>
                  )}
                </p>
              )}
            </Modal.Body>

            {selected.status === "Pending Admin" && (
              <Modal.Footer>
                <Button
                  variant="outline-danger"
                  disabled={saving}
                  onClick={() => decide("Rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  disabled={saving}
                  onClick={() => decide("Approved")}
                >
                  Approve
                </Button>
              </Modal.Footer>
            )}
          </>
        )}
      </Modal>
    </Container>
  );
}

export default AdminLeaveApprovals;
