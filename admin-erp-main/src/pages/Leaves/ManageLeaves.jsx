import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Change these if your backend paths differ
const API = {
  list: "/leave-types",
  create: "/leave-types",
  update: (id) => `/leave-types/${id}`,
  remove: (id) => `/leave-types/${id}`,
};

const SESSIONS = ["2024-25", "2025-26", "2026-27", "2027-28"];
const APPLICANTS = [
  "Teaching Staff",
  "Non Teaching Staff",
  "Student",
  "Others",
];

const emptyForm = {
  session: "",
  leave_Name: "",
  leave_ShortName: "",
  no_of_leaves: "",
  applicant: "",
};

function ManageLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterSession, setFilterSession] = useState("");
  const [filterApplicant, setFilterApplicant] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  function load() {
    setLoading(true);
    setError("");
    axios
      .get(apiUrl + API.list, { headers })
      .then((res) => setLeaves(res.data.data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load leaves"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const visible = leaves.filter(
    (l) =>
      (!filterSession || l.session === filterSession) &&
      (!filterApplicant || l.applicant === filterApplicant),
  );

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function openAdd() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      session: filterSession,
      applicant: filterApplicant,
    });
    setFormError("");
    setShowModal(true);
  }

  function openEdit(leave) {
    setEditingId(leave._id);
    setForm({
      session: leave.session,
      leave_Name: leave.leave_Name,
      leave_ShortName: leave.leave_ShortName,
      no_of_leaves: leave.no_of_leaves,
      applicant: leave.applicant,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError("");

    const payload = {
      ...form,
      leave_Name: form.leave_Name.trim(),
      leave_ShortName: form.leave_ShortName.trim(),
      no_of_leaves: Number(form.no_of_leaves),
    };

    if (payload.no_of_leaves < 0 || Number.isNaN(payload.no_of_leaves)) {
      setFormError("Number of leaves must be 0 or more.");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await axios.put(apiUrl + API.update(editingId), payload, { headers });
      } else {
        await axios.post(apiUrl + API.create, payload, { headers });
      }
      setShowModal(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save leave.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      await axios.delete(apiUrl + API.remove(deleteTarget._id), { headers });
      setDeleteTarget(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete leave.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Container fluid className="py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Manage Leaves</h3>
          <small className="text-muted">
            Define how many leaves each applicant type gets per session.
          </small>
        </div>
        <Button variant="primary" onClick={openAdd}>
          + Add Leave
        </Button>
      </div>

      <Row className="g-2 mb-3">
        <Col md={3}>
          <Form.Select
            value={filterSession}
            onChange={(e) => setFilterSession(e.target.value)}
          >
            <option value="">All sessions</option>
            {SESSIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterApplicant}
            onChange={(e) => setFilterApplicant(e.target.value)}
          >
            <option value="">All applicants</option>
            {APPLICANTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Form.Select>
        </Col>
        {(filterSession || filterApplicant) && (
          <Col md="auto">
            <Button
              variant="outline-secondary"
              onClick={() => {
                setFilterSession("");
                setFilterApplicant("");
              }}
            >
              Clear
            </Button>
          </Col>
        )}
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <p className="mb-0">Loading...</p>
          ) : visible.length === 0 ? (
            <p className="text-muted mb-0">No leaves found.</p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Session</th>
                  <th>Leave Name</th>
                  <th>Short Name</th>
                  <th>No. of Leaves</th>
                  <th>Applicant</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((leave, i) => (
                  <tr key={leave._id}>
                    <td>{i + 1}</td>
                    <td>{leave.session}</td>
                    <td className="fw-semibold">{leave.leave_Name}</td>
                    <td>
                      <Badge bg="secondary">{leave.leave_ShortName}</Badge>
                    </td>
                    <td>{leave.no_of_leaves}</td>
                    <td>{leave.applicant}</td>
                    <td className="text-end text-nowrap">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEdit(leave)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => setDeleteTarget(leave)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add / Edit modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingId ? "Edit Leave" : "Add New Leave"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Session</Form.Label>
              <Form.Select
                name="session"
                value={form.session}
                onChange={handleChange}
                required
              >
                <option value="">--- Select Session ---</option>
                {SESSIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Leave Name</Form.Label>
              <Form.Control
                name="leave_Name"
                value={form.leave_Name}
                onChange={handleChange}
                placeholder="e.g. Casual Leave"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Leave Short Name</Form.Label>
              <Form.Control
                name="leave_ShortName"
                value={form.leave_ShortName}
                onChange={handleChange}
                placeholder="e.g. CL"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Leaves</Form.Label>
              <Form.Control
                type="number"
                name="no_of_leaves"
                min="0"
                step="0.5"
                value={form.no_of_leaves}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Applicant</Form.Label>
              <Form.Select
                name="applicant"
                value={form.applicant}
                onChange={handleChange}
                required
              >
                <option value="">--- Select Applicant ---</option>
                {APPLICANTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Add Leave"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Delete <strong>{deleteTarget?.leave_Name}</strong> (
          {deleteTarget?.session}, {deleteTarget?.applicant})? This cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" disabled={deleting} onClick={confirmDelete}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ManageLeaves;
