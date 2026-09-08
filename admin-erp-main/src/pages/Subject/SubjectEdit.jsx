import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";



function SubjectEdit() {

    let navigate = useNavigate();
    let params = useParams()
    let [subject, setSubject] = useState('');
    let [show, setShow] = useState(false)


    const handleClose = () => {
        setShow(false);
        navigate('/subjects')
    }

    function handleChange(e) {
        let name = e.target.name
        let value = e.target.value
        setSubject((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }


    function doEditSubject(id) {
        axios({
            url: 'http://localhost:3000/edit/subject/' + id,
            method: 'put',
            data: subject
        }).then((result) => {
            if (result.data.success) {
                setShow(true)
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        axios({
            url: 'http://localhost:3000/subject/' + params.id,
            method: 'get'
        }).then((result) => {
            setSubject(result.data.data)
        }).catch((err) => {

        })
    }, [params])




    return (
        <>
            <Container className="mt-5">

                <h3 className="text-center mb-4 text-primary fw-bold">UPDATE SUBJECT</h3>

                <Form >
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={subject.subjectCode}
                                    onChange={handleChange}
                                    name='subjectCode'
                                    placeholder="eg: BMC101"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={subject.subjectFullName}
                                    onChange={handleChange}
                                    name='subjectFullName'
                                    placeholder="eg: javaScript."
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject Nick Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={subject.subjectNickName}
                                    onChange={handleChange}
                                    name='subjectNickName'
                                    placeholder="eg: js"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject Categiory</Form.Label>
                                <Form.Select
                                    value={subject.subjectCategory}
                                    onChange={handleChange}
                                    name='subjectCategory'
                                >
                                    <option value="theory">Theory</option>
                                    <option value="practical">Practical</option>


                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject type</Form.Label>
                                <Form.Select
                                    value={subject.subjectType}
                                    onChange={handleChange}
                                    name='subjectType'
                                >
                                    <option value="regular">Regular</option>
                                    <option value="elective">Elective</option>
                                    <option value="combined">Combined</option>


                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cradit Score</Form.Label>
                                <Form.Select
                                    value={subject.creditScore}
                                    onChange={handleChange}
                                    name='creditScore'
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>

                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex gap-2 mt-4">
                        <Button onClick={() => navigate('/subjects')} variant="secondary" type="button">
                            Cancel
                        </Button>
                        <Button onClick={() => doEditSubject(subject._id)} variant="success">
                            Update
                        </Button>
                    </div>
                </Form>

            </Container>

            {/* {showSpinner && (<div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>)} */}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sucess</Modal.Title>
                </Modal.Header>
                <Modal.Body>Subject Updated successfully</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default SubjectEdit  