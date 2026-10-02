import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react"
import { Col, Container, Form, Row, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
function AddLeave() {
    let [session , setSession] = useState('')
    let [ leave_Name, setLeave_Name] = useState('')
    let [ leave_ShortName, setLeave_ShortName] = useState('')
    let [ no_of_leaves, setNo_of_leaves] = useState('')
    let [ applicant, setApplicant] = useState('')
    let navigate = useNavigate()
    function addLeave() {
    let data = {
        session: session,
        leave_Name: leave_Name,
        leave_ShortName: leave_ShortName,
        no_of_leaves: no_of_leaves,
        applicant: applicant
    }

    axios({
        url: 'http://localhost:3000/add/leave',
        method: 'POST',
        data: data
    })
    .then((res) => {
        alert('Data successfully Added....')
        navigate('/leaves')
    })
    .catch((err) => {
        console.log(err)
    })

}
    return(
        <Container>
            <Form>
                <h3 className="text-center mb-4 py-2 text-primary fw-bold ">ADD NEW LEAVE</h3>
                <Row>
                     <Col>
                        <Form.Group>
                            <Form.Label>Session</Form.Label>
                            <Form.Select onChange={(e)=> setSession(e.target.value)} required>
                                <option>---SelectSession---</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2025-26">2025-26</option>
                                <option value="2026-27">2026-27</option>
                                <option value="2027-28">2027-28</option>
                            </Form.Select>
                        </Form.Group>
                     </Col>
                     <Row className="mt-2">
                        <Form.Group>
                        <Form.Label>Leave Name</Form.Label>
                            <Form.Control type="text" onChange={(e)=> setLeave_Name(e.target.value)}placeholder="eg. Casual Leave" required></Form.Control>
                       
                        </Form.Group>
                    </Row>
                    <Row className="mt-2">
                        <Form.Group>
                        <Form.Label>Leave Short Name</Form.Label>
                             <Form.Control type="text" onChange={(e)=> setLeave_ShortName(e.target.value)} placeholder="eg. Cl for Casual Leave" required></Form.Control>
                       
                        </Form.Group>
                    </Row>
                     <Row className="mt-2">
                    <Form.Group>
                        <Form.Label>Number Of leave</Form.Label>
                        <Form.Control type="number" onChange={(e)=> setNo_of_leaves(e.target.value)} placeholder="write no of leaves"></Form.Control>
                    </Form.Group>
                    </Row>
                    <Row className="mt-2">
                        <Form.Group>
                        <Form.Label>Applicant</Form.Label>
                        <Form.Select onChange={(e)=> setApplicant(e.target.value)} required>
                            <option>---SelectApplicant---</option>
                            <option value="Teaching Staff">Teaching Staff</option>
                            <option value="Non Teaching Staff">Non Teaching Staff</option>
                            <option value="Student">Student</option>
                            <option value="Others">Others</option>
                        </Form.Select>
                        </Form.Group>
                    
                    </Row>
                </Row>

            </Form>
            <Button className="mt-2" variant="success" onClick={addLeave}>Add Leave</Button>
        </Container>
    )
}
export default AddLeave