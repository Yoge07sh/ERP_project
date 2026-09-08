import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'

import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";




function BranchEdit() {

    let [course, setCourse] = useState([]);
    
    let navigate = useNavigate();
    let params = useParams();
    let [branch, setBranch] = useState({});
    let [show, setShow] = useState(false);


    const handleClose = () => {
        setShow(false);
        navigate('/branches')
    }

    function handleChange(e) {
        let name = e.target.name
        let value = e.target.value
        setCourse(e.target.value);
        setBranch((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }

    function doEditBranch(id) {
        axios({
            url: 'http://localhost:3000/edit/branch/' + id,
            method: 'put',
            data: branch
        }).then((result) => {
            if (result.data.success) {
                setShow(true);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        axios({
            url: 'http://localhost:3000/branch/' + params.id,
            method: 'get'
        }).then((result) => {
            setBranch(result.data.data)
        }).catch((err) => {

        })
    }, [params])




     useEffect(() => {
        axios.get("http://localhost:3000/courses/for/branch")
          .then((res) => {
            if (res.data.success) {
              setCourse(res.data.data);
            } else {
              alert("Failed to load Branch.");
            }
          })
          .catch((err) => {
            console.error("Error fetching Branches:", err);
          });
      }, []);
      function handleChange(e) {
        setCourse(e.target.value);
      }


    return (

        <Container className="">
            <Form>
                <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">EDIT BRANCH</h3>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Select Course</Form.Label>
                        <Form.Select
                            value={branch.course}
                            onChange={handleChange}
                            name='course'
                        >
                            {
                                courses.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>

                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Branch Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={branch.branchCode}
                            onChange={handleChange}
                            name='branchCode'
                            placeholder="eg: CSE101"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Branch Short Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={branch.branchShortName}
                            onChange={handleChange}
                            name='branchShortName'
                            placeholder="eg: CSE"
                        />
                    </Form.Group>
                </Row>


                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Branch Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={branch.branchFullName}
                            onChange={handleChange}
                            name='branchFullName'
                            placeholder="eg: Computer Science and Engineering"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Total Intake</Form.Label>
                        <Form.Control
                            type="number"
                            value={branch.branchIntake}
                            onChange={handleChange}
                            name='branchIntake'
                            placeholder="eg: 60"
                        />
                    </Form.Group>
                </Row>


                <div className="d-flex justify-content-center gap-2 mt-4">
                    <Button onClick={() => navigate('/branches')} variant="secondary" type="button">
                        Cancel
                    </Button>
                    <Button onClick={doEditBranch(branch._id)} variant="primary" >
                        Update
                    </Button>
                </div>
            </Form>


            {/* ---------Modal code ------------- */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Branch Added successfully👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default BranchEdit