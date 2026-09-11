import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Container, Form, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import  axios  from 'axios'
const apiUrl = import.meta.env.VITE_API_URL
function EditFacultyMapping() {

    const params = useParams();

    useEffect(() => {
        axios({
            url: apiUrl + '/facultyMapping/' + params.id,
            method: 'get'
        }).then((res) => {
            alert(res.success)
         })
            .catch((err) => { 
                alert(err)
            })
    }, [params.id])
    return (

        <Container>

            <h3 className="text-center mb-4 py-2 text-primary fw-bold">
                EDIT FACULTY MAPPING
            </h3>

            <hr />

            <Form>

                <Row className="mb-3">

                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Session <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Select
                                name="session"
                                required
                            >

                                <option value="">
                                    ---Select Session---
                                </option>

                                <option value="2026-27">
                                    2026-27
                                </option>

                                <option value="2025-26">
                                    2025-26
                                </option>

                                <option value="2024-25">
                                    2024-25
                                </option>

                            </Form.Select>

                        </Form.Group>

                    </Col>


                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Faculty <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Select
                                name="facultyId"
                                required
                            >

                                <option value="">
                                    ---Select Faculty---
                                </option>

                            </Form.Select>

                        </Form.Group>

                    </Col>


                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Course <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Select
                                name="course"
                                required
                            >

                                <option value="">
                                    ---Select Course---
                                </option>

                            </Form.Select>

                        </Form.Group>

                    </Col>

                </Row>


                <Row className="mb-3">

                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Branch <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Select
                                name="branch"
                                required
                            >

                                <option value="">
                                    ---Select Branch---
                                </option>

                            </Form.Select>

                        </Form.Group>

                    </Col>


                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Year <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Select
                                name="year"
                                required
                            >

                                <option value="">
                                    ---Select Year---
                                </option>

                                <option value="1">
                                    1st Year
                                </option>

                                <option value="2">
                                    2nd Year
                                </option>

                                <option value="3">
                                    3rd Year
                                </option>

                                <option value="4">
                                    4th Year
                                </option>

                            </Form.Select>

                        </Form.Group>

                    </Col>


                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Semester <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Select
                                name="semester"
                                required
                            >

                                <option value="">
                                    ---Select Semester---
                                </option>

                                <option value="1">
                                    Semester 1
                                </option>

                                <option value="2">
                                    Semester 2
                                </option>

                                <option value="3">
                                    Semester 3
                                </option>

                                <option value="4">
                                    Semester 4
                                </option>

                                <option value="5">
                                    Semester 5
                                </option>

                                <option value="6">
                                    Semester 6
                                </option>

                                <option value="7">
                                    Semester 7
                                </option>

                                <option value="8">
                                    Semester 8
                                </option>

                            </Form.Select>

                        </Form.Group>

                    </Col>

                </Row>


                <Row className="mb-3">

                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Section <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Select
                                name="section"
                                required
                            >

                                <option value="">
                                    ---Select Section---
                                </option>

                                <option value="A">
                                    Section A
                                </option>

                                <option value="B">
                                    Section B
                                </option>

                                <option value="C">
                                    Section C
                                </option>

                                <option value="D">
                                    Section D
                                </option>

                            </Form.Select>

                        </Form.Group>

                    </Col>


                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Subject <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Select
                                name="subjectId"
                                required
                            >

                                <option value="">
                                    ---Select Subject---
                                </option>

                            </Form.Select>

                        </Form.Group>

                    </Col>


                    <Col md={4}>

                        <Form.Group>

                            <Form.Label>
                                Load Per Week
                            </Form.Label>

                            <Form.Control
                                type="text"
                                name="loadPerWeek"
                                placeholder="Enter load per week"
                            />

                        </Form.Group>

                    </Col>

                </Row>


                <Button
                    className="mt-4"
                    type="button"
                >
                    Update Mapping
                </Button>

            </Form>

        </Container>

    )

}

export default EditFacultyMapping
