import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import { Modal, Button, Form, InputGroup, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'



function StudentList() {

    let navigate = useNavigate();
    let [students, setStudents] = useState([])
    const [show, setShow] = useState(false)
    let [isDelete, setIsDelete] = useState(false)
    let [searchByFirstName, setSearchByFirstName] = useState('')
    let [searchByLastName, setSearchByLastName] = useState('')
    let [searchByEnrollment, setSearchByEnrollment] = useState('')
    let [searchByRollno, setSearchByRollno] = useState('')
    let [searchByFileno, setSearchByFileno] = useState('')


    useEffect(() => {

        axios({
            url: 'http://localhost:3000/students',
            method: 'get',
            params: {
                firstName: searchByFirstName,
                lastName: searchByLastName,
                enrollmentNumber: searchByEnrollment,
                rollNumber: searchByRollno,
                fileNumber: searchByFileno
            }
        }).then((result) => {
            if (result.data.success) {
                console.log(result.data.data);
                setStudents(result.data.data);

            }
        }).catch((error) => {
            console.log(error);

        })
    }, [isDelete, searchByFirstName, searchByLastName, searchByEnrollment, searchByRollno, searchByFileno])



    const handleClose = () => {
        setShow(false)
        setIsDelete(prev => !prev)
    }

    function goToAddStudentPage() {
        navigate('/add/student')
    }


    function goToDelete(id) {
        axios({
            url: 'http://localhost:3000/delete/student/' + id,
            method: 'delete'

        }).then((result) => {
            if (result.data.success) {
                setShow(true)
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }


    function goToEdit(id) {
        navigate('/edit/student/' + id);
    }

    function goToView(id) {
        navigate('/student/profile/' + id)
    }



    return (
        <>
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">LIST OF STUDENTS</h3>

            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control type="text" placeholder=" Type Student Name to search" onChange={(e) => setSearchByFirstName(e.target.value)} />
            </InputGroup>

            <button className="btn btn-success ms-3 mt-2 float-end" onClick={goToAddStudentPage}>Add Student +</button>



            <table className="table text-center table-hover mt-5">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Enrollment No.</th>
                        <th>Name</th>
                        <th>Roll No.</th>
                        <th>Year</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        students.map((student) =>
                            <tr>
                                <td><img src={student.image} width="60px" height="80px" alt="pic" /></td>
                                <td>{student.enrollmentNumber}</td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.rollNumber}</td>
                                <td>{student.year}</td>
                                <td>
                                    {student.permanentAddressLine1
                                        ? `${student.permanentAddressLine1 || ''}, ${student.permanentCity || ''
                                        }, ${student.permanentState || ''} - ${student.permanentPincode || ''
                                        }`
                                        : `${student.localAddressLine1 || ''}, ${student.localCity || ''
                                        }, ${student.localState || ''} - ${student.localPincode || ''
                                        }`}
                                </td>

                                <td>
                                    <i className="bi bi-eye me-3" onClick={() => goToView(student._id)}></i>
                                    <i className="bi bi-pencil me-3 " onClick={() => goToEdit(student._id)} ></i>
                                    <i className="bi bi-trash" onClick={() => goToDelete(student._id)}></i>
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
                <Modal.Body>Student has been Deleted successfully👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default StudentList  