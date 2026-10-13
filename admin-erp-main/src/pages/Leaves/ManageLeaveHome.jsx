import { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import AdminLeaveApprovals from "./AdminLeaveApprovals";
import ManageLeaves from "./ManageLeaves";

function ManageLeaveHome() {
  const [tab, setTab] = useState("approvals"); // approvals opens first

  return (
    <Container fluid className="pt-3 px-4">
      <Nav variant="tabs" activeKey={tab} onSelect={setTab}>
        <Nav.Item>
          <Nav.Link eventKey="approvals">Leave Approvals</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="types">Leave Types</Nav.Link>
        </Nav.Item>
      </Nav>

      {tab === "approvals" ? <AdminLeaveApprovals /> : <ManageLeaves />}
    </Container>
  );
}

export default ManageLeaveHome;