import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Button, Form, InputGroup, Container } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL
function FacultyMappingList() {
    const navigate = useNavigate();
    const handleAdd = () => {
        navigate('/add/facultymapping')
    }
    const [facultyMapping, setFacultyMapping] = useState([]);
    useEffect(() => {
        axios({
            url: apiUrl + '/get/facultymapping',
            method: 'get'
        }).then((res) => {
            setFacultyMapping(res.data.data);
        }).catch((err) => {
            alert(err);
        })
    }, [])

    return (
        <Container>
            <>
                <h3 className="text-center mb-4 py-2 text-primary fw-bold">LIST OF STUDENTS</h3>

                <InputGroup className="mb-3">
                    <InputGroup.Text>
                        <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control type="text" placeholder=" Type Faculty Name to search" />
                </InputGroup>

                <Button className="btn btn-success ms-3 mt-2 float-end" onClick={handleAdd} >Add Faculty +</Button>



                <table className="table text-center table-hover mt-5">
                    <thead>
                        <tr>
                            <th>Session</th>
                            <th>Faculty Name</th>
                            <th>Course</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>Section</th>
                            <th>Subject</th>
                            <th>LoadPerWeek</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facultyMapping.map((mapping) => (
                            <tr key={mapping._id}>
                                <td>{mapping.session}</td>
                                <td>{mapping.facultyId?.firstName} {mapping.facultyId?.lastName}
                                </td>
                                <td>{mapping.course?.courseFullName}</td>
                                <td>{mapping.branch?.branchFullName}
                                </td>
                                <td>{mapping.year}</td>
                                <td>{mapping.semester}</td>
                                <td>{mapping.section}</td>
                                <td>{mapping.subjectId?.subjectFullName}
                                </td>
                                <td>{mapping.loadPerWeek}</td>

                                <td>
                                    <i
                                        className="bi bi-pencil me-3"
                                        style={{ cursor: "pointer" }}
                                    ></i>

                                    <i
                                        className="bi bi-trash"
                                        style={{ cursor: "pointer" }}
                                    ></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                {/* ---------Modal code ------------- 
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Faculty has been Deleted successfully👍</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                */}

            </>

        </Container>
    )
}

export default FacultyMappingList;