import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL 

function LeaveDashboard() {
    let navigate = useNavigate();
    
    let [applicantName, setApplicantName] = useState('');
    let [designation, setDesignation] = useState('');

    useEffect(() => {
        let token = localStorage.getItem("token");
        
        if (!token) return;

        try {
            let decodedToken = JSON.parse(atob(token.split('.')[1]));
            let facultyId = decodedToken._id; 

            axios({
                url: apiUrl + '/faculty/for/leave/' + facultyId, 
                method: 'get'
            }).then((res) => {
                if(res.data.success && res.data.data) {
                    const faculty = res.data.data;
                    setApplicantName(`${faculty.firstName} ${faculty.lastName || ''}`.trim());
                    setDesignation(faculty.designation || 'Faculty');
                }
            }).catch((err) => {
                console.log("Error fetching faculty:", err);
            });
            
        } catch (error) {
            console.log("Token decode error:", error);
        }
    }, []);

    function goToLeaveForm() {
        navigate('/getLeaveForm');
    }
    function goToStatus() {
    navigate('/leaveStatus'); 
}
    return (
        <Container fluid className="py-4 px-4">
            <Row className="mb-4">
                <Col>
                    <div 
                        className="p-5 rounded-5 text-white shadow-lg position-relative overflow-hidden" 
                        style={{
                                background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
                                color: "white",
                            }}
                    >
                        <div className="position-relative z-1">
                            <span className="badge bg-white bg-opacity-25 px-3 py-2 rounded-pill mb-3 text-uppercase tracking-wider fs-7">
                                Faculty Portal
                            </span>
                            <h1 className="fw-bold display-6 mb-2">
                                Welcome Back, {applicantName || "Faculty"}! 👋
                            </h1>
                            <p className="text-white-50 fs-6 mb-4">
                                • Manage your leaves and track approvals seamlessly.
                            </p>
                           
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="g-4">
                <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="fw-bold text-dark mb-3">Apply For Leave</h4>
                                <Button variant="primary" className="rounded-pill px-4" onClick={goToLeaveForm}>
                                    Fill Form ➔
                                </Button>
                            </div>
                           
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 h-100 bg-white ">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="fw-bold text-dark mb-3">View Leave History</h4>
                                <Button variant="success" className="rounded-pill px-4 text-white" onClick={goToStatus}>
                                    Check Status ➔
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LeaveDashboard;