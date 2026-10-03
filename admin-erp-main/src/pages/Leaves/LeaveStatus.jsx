import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL

function LeaveStatus() {
    let navigate = useNavigate();
    let [leavesList, setLeavesList] = useState([]);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (!token) return;

        try {
            let decodedToken = JSON.parse(atob(token.split('.')[1]));
            let facultyId = decodedToken._id; 
            axios({
                url: apiUrl + '/leaves/faculty/' + facultyId,
                method: 'get',
            }).then((res)=> {
                setLeavesList(res.data.data)
                setLoading(false)
            }).catch((err)=> {
                consoe
                setLoading(false)
            })
        } catch (error) {
            console.log("Token error:", error);
            setLoading(false);
        }
    }, []);

    return (
        <Container fluid className="py-4 px-4">
            <Row className="mb-4">
                <Col className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="fw-bold text-dark">My Leave History</h2>
                        <p className="text-muted mb-0">Track the status of your submitted leave applications.</p>
                    </div>
                    <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => navigate('/getLeaveDashboard')}>
                        ← Back to Dashboard
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <Card.Body>
                            {loading ? (
                                <p className="text-center py-4">Loading your leaves...</p>
                            ) : leavesList.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted fs-5">No leave applications found.</p>
                                    <Button variant="primary" className="rounded-pill px-4" onClick={() => navigate('/getLeaveForm')}>
                                        Apply For Leave Now
                                    </Button>
                                </div>
                            ) : (
                                <Table hover className="align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Leave Type</th>
                                            <th>Session</th>
                                            <th>From Date</th>
                                            <th>To Date</th>
                                            <th>Days</th>
                                            <th>Purpose</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leavesList.map((leave) => (
                                            <tr key={leave._id}>
                                                <td className="fw-semibold text-primary">{leave.leave_name}</td>
                                                <td>{leave.session}</td>
                                                <td>{new Date(leave.from).toLocaleDateString()}</td>
                                                <td>{leave.toDate ? new Date(leave.toDate).toLocaleDateString() : 'N/A'}</td>
                                                <td>{leave.numberOfLeaves}</td>
                                                <td>{leave.purpose.substring(0, 30)}...</td>
                                                <td>
                                                    <Badge bg={
                                                        leave.status === 'Approved' ? 'success' : 
                                                        leave.status === 'Rejected' ? 'danger' : 'warning'
                                                    } className="px-3 py-2">
                                                        {leave.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LeaveStatus;