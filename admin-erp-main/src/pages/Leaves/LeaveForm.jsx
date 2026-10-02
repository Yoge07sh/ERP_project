import { Col, Container, Row, Form, Button, Card } from 'react-bootstrap';
import { useState, useEffect } from "react"; 
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function LeaveForm() {
    let [applicantName, setApplicantName] = useState('');
    let [designation, setDesignation] = useState('');
    let [loggedInFacultyId, setLoggedInFacultyId] = useState('');

    let [session, setSession] = useState('');
    let [leave_name, setLeave_name] = useState('');
    let [date, setDate] = useState(''); 
    let [half, setHalf] = useState('');
    let [toDate, setToDate] = useState('');
    let [numberOfLeaves, setNumberOfLeaves] = useState(0);
    let [purpose, setPurpose] = useState('');
    let [leaveAddress, setLeaveAddress] = useState('');
    let [contactNumber, setContactNumber] = useState('');
    let [arrangements, setArrangements] = useState([{ date: '', time: '', subject: '', dutyPerson: '' }]);
    let [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem("token");
        
        if (!token) {
            console.log("Token nahi mila. Kya aap login hain?");
            return;
        }

        try {
            let decodedToken = JSON.parse(atob(token.split('.')[1]));
            let facultyId = decodedToken._id; 
            
            setLoggedInFacultyId(facultyId);

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
            console.log("Token decode karne mein error aaya:", error);
        }
    }, []);

    function calculateLeaves(from, to) {
        if (!from || !to) { setNumberOfLeaves(0); return; }
        const start = new Date(from);
        const end = new Date(to);
        if (end < start) { setNumberOfLeaves(0); return; }
        setNumberOfLeaves(Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1);
    }

    function updateArrangement(index, field, value) {
        let updatedArrangements = [...arrangements];
        updatedArrangements[index][field] = value;
        setArrangements(updatedArrangements);
    }

    function addArrangement() {
        setArrangements([...arrangements, { date: '', time: '', subject: '', dutyPerson: '' }]);
    }

    function removeArrangement(index) {
        setArrangements(arrangements.filter((_, i) => i !== index));
    }

    function applyLeave() {
        if (!loggedInFacultyId) {
            alert("Error: Faculty ID not found. Please login again.");
            return;
        }
        if (!termsAccepted) {
            alert("Please accept the Terms and Conditions before applying for leave.");
            return;
        }

        let data = { 
            facultyId: loggedInFacultyId, 
            applicantName, 
            designation, 
            session, 
            leave_name, 
            from: date || undefined,           
            half: half || undefined,           
            toDate: toDate || undefined,       
            numberOfLeaves: Number(numberOfLeaves), 
            purpose, 
            leaveAddress, 
            contactNumber, 
            alternativeArrangements: arrangements.map(item => ({
                date: item.date || undefined,
                time: item.time || undefined,
                subject: item.subject || undefined,
                dutyPerson: item.dutyPerson || undefined
            }))
        };

        axios({ 
            url: apiUrl + '/add/leave', 
            method: 'POST', 
            data: data
        }).then(() => {
            alert("Leave applied successfully");
        }).catch((err) => { 
            console.log("Frontend Error:", err.response?.data || err); 
            alert("Something went wrong"); 
        });
    }

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={9} md={11}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <h3 className="text-center text-danger mb-4">APPLY FOR LEAVE</h3>
                            
                            <h5 className="mb-3">Applicant Details</h5>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Applicant Name</Form.Label>
                                        <Form.Control type="text" value={applicantName} readOnly className="bg-light" />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Designation</Form.Label>
                                        <Form.Control type="text" value={designation} readOnly className="bg-light" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                            
                            <h5 className="mb-3">Leave Details</h5>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group><Form.Label>Session</Form.Label>
                                        <Form.Select value={session} onChange={(e) => setSession(e.target.value)}>
                                            <option value="">--- Select Session ---</option>
                                            <option value="2025-26">2025-26</option>
                                            <option value="2026-27">2026-27</option>
                                            <option value="2027-28">2027-28</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group><Form.Label>Type of Leave</Form.Label>
                                        <Form.Select value={leave_name} onChange={(e) => { setLeave_name(e.target.value); setHalf(''); setToDate(''); setNumberOfLeaves(0); }}>
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
                                        <Form.Control type="date" value={date} onChange={(e) => { setDate(e.target.value); calculateLeaves(e.target.value, toDate); }} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            {leave_name === "Short Leave" && (
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group><Form.Label>Select Half</Form.Label>
                                            <div>
                                                <Form.Check type="radio" label="1st Half" name="half" value="1st half" checked={half === "1st half"} onChange={(e) => setHalf(e.target.value)} inline />
                                                <Form.Check type="radio" label="2nd Half" name="half" value="2nd half" checked={half === "2nd half"} onChange={(e) => setHalf(e.target.value)} inline />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            {leave_name !== "" && leave_name !== "Short Leave" && (
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Leave To</Form.Label>
                                            <Form.Control type="date" value={toDate} min={date} onChange={(e) => { setToDate(e.target.value); calculateLeaves(date, e.target.value); }} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>No. of Leaves</Form.Label>
                                            <Form.Control type="number" value={numberOfLeaves} readOnly />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            <hr />
                            <h5 className="mb-3">Additional Details</h5>
                            <Row>
                                <Col className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Purpose of Leave</Form.Label>
                                        <Form.Control as="textarea" rows={3} placeholder="Enter purpose of leave" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Address During Leave</Form.Label>
                                        <Form.Control as="textarea" rows={2} placeholder="Enter address where you will be staying during leave" value={leaveAddress} onChange={(e) => setLeaveAddress(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Contact Number During Leave</Form.Label>
                                        <Form.Control type="tel" placeholder="Enter contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Alternative Arrangement</h5>
                            </div>
                            {arrangements.map((arrangement, index) => (
                                <Card key={index} className="mb-3 border">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Arrangement {index + 1}</h6>
                                            {arrangements.length > 1 && (
                                                <Button variant="outline-danger" size="sm" onClick={() => removeArrangement(index)}>Remove</Button>
                                            )}
                                        </div>
                                        <Row>
                                            <Col md={4} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Date</Form.Label>
                                                    <Form.Control type="date" value={arrangement.date} onChange={(e) => updateArrangement(index, 'date', e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Time</Form.Label>
                                                    <Form.Control type="time" value={arrangement.time} onChange={(e) => updateArrangement(index, 'time', e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Duty Engaged By Concern Person</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter person's name" value={arrangement.dutyPerson} onChange={(e) => updateArrangement(index, 'dutyPerson', e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>Subject / Other Works</Form.Label>
                                                    <Form.Control as="textarea" rows={2} placeholder="Enter subject or other works" value={arrangement.subject} onChange={(e) => updateArrangement(index, 'subject', e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                            <div className="mb-4">
                                <Button variant="outline-primary" onClick={addArrangement}>+ Add More Arrangement</Button>
                            </div>
                            <hr />
                            <Row className="mt-4">
                                <Col>
                                    <Form.Check 
                                        type="checkbox" 
                                        id="terms" 
                                        checked={termsAccepted} 
                                        onChange={(e) => setTermsAccepted(e.target.checked)} 
                                        label={
                                            <span className="text-danger">
                                                1. Leave Application must be submitted before 2 days prior except any Emergency/Short Leave.<br />
                                                2. In emergency may be submitted within 2 days after resuming his/her duty with proof of documents if any.<br />
                                                3. Short leave shall be allowed only after proper arrangement of duty by faculty preferably from same section teacher or subject teacher of any section.<br />
                                                4. Engaged concern person should be involved in same activity.<br />
                                                5. Any Emergency Leave will be sanction by the Director only.
                                            </span>
                                        } 
                                    />
                                </Col>
                            </Row>
                            <div className="text-center mt-3">
                                <Button variant="success" className="px-5 apply-leave-btn" onClick={applyLeave} disabled={!termsAccepted}>Apply Leave</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LeaveForm;