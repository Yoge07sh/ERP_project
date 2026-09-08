import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import { Modal, Button, Form, InputGroup, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'


function SubjectList() {


    let navigate = useNavigate();
    let [subjects, setSubjects] = useState([])
    const [show, setShow] = useState(false)
    let [isDelete, setIsDelete] = useState(false)
    let [searchBySubjectName, setSearchBySubjectName] = useState('')



    useEffect(() => {

        axios({
            url: 'http://localhost:3000/subjects',
            method: 'get',
            params: {
                subjectFullName: searchBySubjectName
            }
        }).then((result) => {
            if (result.data.success) {
                console.log(result.data.data);
                setSubjects(result.data.data);

            }
        }).catch((error) => {
            console.log(error);

        })
    }, [isDelete, searchBySubjectName])



    function searchSubject(subjectFullName) {
        setSearchBySubjectName(subjectFullName)
        axios({
            // url: 'http://localhost:3000',
            url: 'http://localhost:3000/subject/search/' + subjectFullName,
            method: 'get',
            params: {
                courseFullName: searchBySubjectName
            }

        }).then((result) => {

            if (result.data.success) {
                setSubjects(result.data.data);
                // setCourses(result.data.data || []); 
            }

        }).catch((error) => {
            console.log(error);
        })
    }


    const handleClose = () => {
        setShow(false)
        setIsDelete(true)
    }

    function goToEdit(id) {
        console.log("Navigating to edit subject with ID:", id);
        navigate('/edit/subject/' + id)
    }

    function goToAddSubjectPage() {
        navigate('/add/subject')
    }

    function goToDelete(id) {
        axios({
            url: 'http://localhost:3000/delete/course/' + id,
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
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">LIST OF SUBJECTS</h3>

            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control type="text" placeholder=" Type Subject Name to search" onChange={(e) => searchSubject(e.target.value)} />
            </InputGroup>

            <button className="btn btn-success ms-3 mt-2 float-end" onClick={goToAddSubjectPage}>Add Subject +</button>


            <table className="table text-center table-hover mt-5">
                <thead>
                    <tr>
                        <th>Subject Code</th>
                        <th>Subject Full Name</th>
                        <th>Subject Short Name</th>
                        <th>Subject Category</th>
                        <th>Subject Type</th>
                        <th>Cradit Score</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        subjects.map((subject) =>
                            <tr>
                                <td>{subject.subjectCode}</td>
                                <td>{subject.subjectFullName}</td>
                                <td>{subject.subjectNickName}</td>
                                <td>{subject.subjectCategory}</td>
                                <td>{subject.subjectType}</td>
                                <td>{subject.creditScore}</td>
                                <td>
                                    <i className="bi bi-pencil me-3 " onClick={() => goToEdit(subject._id)} ></i>
                                    <i className="bi bi-trash" onClick={() => goToDelete(subject._id)}></i>
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
                <Modal.Body>Course has been Deleted successfully👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )


}

export default SubjectList
