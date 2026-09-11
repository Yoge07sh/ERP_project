
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const apiUrl = import.meta.env.VITE_API_URL
import { FaEdit, FaTrash } from "react-icons/fa"


function SubjectMappingList() {


    let navigate = useNavigate();
    let [subjectsmap, setSubjectsmap] = useState([])
    const [show, setShow] = useState(false)
    let [isDelete, setIsDelete] = useState(false)
    let [searchByCourse, setSearchByCourse] = useState('')



    useEffect(() => {

        axios({
            //url: 'http://localhost:3000/subjectsMapped',
            url: apiUrl + '/subjectsMapped',
            method: 'get',
            params: {
                course: searchByCourse
            }
        }).then((result) => {
            if (result.data.success) {
                console.log(result.data.data);
                setSubjectsmap(result.data.data);

            }
        }).catch((error) => {
            console.log(error);

        })
    }, [isDelete, searchByCourse])


    const handleClose = () => {
        setShow(false)
        setIsDelete(true)
    }

    function goToEdit(id) {
        navigate('/edit/subjectMapping/'+ id)
    }

    function goToDelete(id) {
        axios({
            url: apiUrl + '/delete/subjectMapping/' + id,
            method: 'delete'

        }).then((result) => {
            if (result.data.success) {
                setShow(true)
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    return (
        <>
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">LIST OF SUBJECT MAPPING</h3>

            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control type="text" placeholder=" Type Subject Name to search" onChange={(e) => setSearchByCourse(e.target.value)} />
            </InputGroup>

            <button className="btn btn-success ms-3 mt-2 float-end" onClick={() => navigate('/add/subjectMapping')}>Map Subject +</button>


            <table className="table text-center table-hover mt-5">
                <thead>
                    <tr>
                        <th>Session</th>
                        <th>Subject</th>
                        <th>Course</th>
                        <th>Branch</th>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        subjectsmap.map((subject) =>
                            <tr>
                                <td>{subject.session}</td>
                                <td>{subject.subject}</td>
                                <td>{subject.course}</td>
                                <td>{subject.branch}</td>
                                <td>{subject.year}</td>
                                <td>{subject.semester}</td>
                                <td>
                                    {/* <i className="bi bi-pencil me-3 " onClick={() => goToEdit(subject._id)} ></i> */}
                                    <Button
                                    variant="warning"
                                    onClick={() => goToEdit(subject._id)}
                                    >
                                        <FaEdit></FaEdit>
                                    </Button>
                                    <Button
                                    variant="danger ms-2"
                                    onClick={() => goToDelete(subject._id)}
                                    >
                                        <FaTrash></FaTrash>
                                    </Button>

                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>


            {/* ---------Modal code ------------- */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Subject Mapping has been Deleted successfully👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )


}

export default SubjectMappingList