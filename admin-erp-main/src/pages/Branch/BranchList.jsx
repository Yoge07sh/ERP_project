import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import { Modal, Button, Form, Pagination, InputGroup, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'



function BranchList() {

    let navigate = useNavigate();
    let [branches, setBranches] = useState([])
    const [show, setShow] = useState(false)
    let [isDelete, setIsDelete] = useState(false)
    let [searchByBranchName, setSearchByBranchName] = useState('')
    let [nop, setNop] = useState(1);
    let [pageNo, setPageNo] = useState(1);
    let [totalBranches, setTotalBranches] = useState(0);
    let branchPerPage = 3;
    let items = [];
    for (let i = 1; i <= nop; i++) {
        items.push(
            <Pagination.Item key={i} onClick={() => setPageNo(i)} >{i}</Pagination.Item>
        )
    }


    useEffect(() => {

        axios({
            url: 'http://localhost:3000/branches',
            method: 'get',
            params: {
                branchFullName: searchByBranchName,
                pageNo: pageNo,
                limit: 3
            }
        }).then((result) => {
            if (result.data.success) {
                console.log(result.data.data);
                setBranches(result.data.data);
                setTotalBranches(result.data.totalCount)
                setNop(Math.ceil(result.data.totalCount / branchPerPage))

            }
        }).catch((error) => {
            console.log(error);

        })
    }, [isDelete, searchByBranchName, pageNo])


    function searchBranch(branchname) {
        setSearchByBranchName(branchname)
        axios({
            url: 'http://localhost:3000/branch/search/' + branchname,
            method: 'get',
            params: {
                branchFullName: setSearchByBranchName
            }
        }).then((result) => {
            if (result.data.success) {
                setBranches(result.data.data);
            }
        }).catch((error) => {
            console.log(error);
        })
    }



    const handleClose = () => {
        setShow(false)
        setIsDelete(true)
    }

    function goToAddBranchPage() {
        navigate('/add/branch')
    }

    function goToDelete(id) {
        axios({
            url: 'http://localhost:3000/delete/branch/' + id,
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
        // navigate('/edit/branch/' + id);
    }

    return (
        <>
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">LIST OF BRANCHES</h3>

            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control type="text" placeholder=" Type Branch Name to search" onChange={(e) => searchBranch(e.target.value)} />
            </InputGroup>

            <button className="btn btn-success ms-3 mt-2 float-end" onClick={goToAddBranchPage}>Add Branch +</button>


            <table className="table text-center table-hover mt-5">
                <thead>
                    <tr>
                        <th>Branch Code</th>
                        <th>Branch Name</th>
                        <th>Branch Short Name</th>
                        <th>Intake</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        branches.map((branch) =>
                            <tr>
                                <td>{branch.branchCode}</td>
                                <td>{branch.branchFullName}</td>
                                <td>{branch.branchShortName}</td>
                                <td>{branch.branchIntake}</td>
                                <td>
                                    <i className="bi bi-pencil me-3 " onClick={() => goToEdit(branch._id)} ></i>
                                    <i className="bi bi-trash" onClick={() => goToDelete(branch._id)}></i>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

            <div className="d-flex justify-content-center">
                {
                    totalBranches > branchPerPage ?
                        <Pagination>{items}</Pagination> : ''
                }
            </div>


            {/* ---------Modal code ------------- */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Branch has been Deleted successfully👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default BranchList   