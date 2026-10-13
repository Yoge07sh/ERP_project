import { useEffect, useState } from "react";
import { Container, Card, Table, Button } from "react-bootstrap";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function ArrangementRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  function load() {
    axios
      .get(apiUrl + "/arrangements/pending", { headers })
      .then((res) => setRequests(res.data.data))
      .catch((err) =>
        alert(err.response?.data?.message || "Could not load requests"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(leaveId, action) {
    let remark = "";
    if (action === "Rejected") {
      remark = window.prompt("Reason for rejecting:");
      if (!remark?.trim()) return;
    }
    try {
      setBusyId(leaveId);
      await axios.patch(
        `${apiUrl}/arrangements/${leaveId}/respond`,
        { action, remark },
        { headers },
      );
      load(); // refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Container className="py-4">
      <h3 className="mb-3">Arrangement Requests</h3>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted mb-0">No pending requests.</p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Applicant</th>
                  <th>Leave</th>
                  <th>Dates</th>
                  <th>Your duty</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      {leave.applicantName}
                      <div className="small text-muted">
                        {leave.designation}
                      </div>
                    </td>
                    <td>{leave.leave_name}</td>
                    <td>
                      {new Date(leave.from).toLocaleDateString()} –{" "}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td>
                      {leave.alternativeArrangements.map((a, i) => (
                        <div key={i} className="small">
                          {new Date(a.date).toLocaleDateString()} at {a.time}:{" "}
                          {a.subject}
                        </div>
                      ))}
                    </td>
                    <td className="text-nowrap">
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        disabled={busyId === leave._id}
                        onClick={() => respond(leave._id, "Accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={busyId === leave._id}
                        onClick={() => respond(leave._id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ArrangementRequests;
