import React from 'react'
import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import {  Form, InputGroup, Container,Button,Modal,Pagination } from 'react-bootstrap'
function FacultyList() {
 const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  let [showSpinner, setShowSpinner] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(false);
 
  let [file, setFile] = useState("");
  let[nop,setNop]=useState(1)
  let[pageNo,setPageNo]=useState(1)
  let[totalFaculties,setTotalFaculties]=useState(0)
  let facultyPerPage=5
  let items=[]
  for(let i=1;i<=nop;i++){
    items.push(
      <Pagination.Item key={i} onClick={()=>setPageNo(i)}>{i}</Pagination.Item>
    )
  }

  let navigate =useNavigate()


  let [faculties, setFaculties] = useState([])
    let [searchByFacultyName, setSearchByFacultyName] = useState('')



    useEffect(() => {

        axios({
            url: 'http://localhost:3000/faculties',
            method: 'get',
            params: {
                firstName: searchByFacultyName,
                pageNo:pageNo,
                limit:facultyPerPage
            }
        }).then((result) => {
            if (result.data.success) {
                console.log(result.data.data);
                setTotalFaculties(result.data.totalCount)
                setNop(Math.ceil((result.data.totalCount)/facultyPerPage))
                setFaculties(result.data.data);

            }
        }).catch((error) => {
            console.log(error);

        })
    }, [searchByFacultyName,facultyPerPage,pageNo])



    function searchFacutly(firstName) {
        setSearchByFacultyName(firstName)
        axios({
            // url: 'http://localhost:3000',
            url: 'http://localhost:3000/faculty/search/' + firstName,
            method: 'get',
            params: {
                firstName: searchByFacultyName
            }

        }).then((result) => {

            if (result.data.success) {
                setFaculties(result.data.data);
                // setCourses(result.data.data || []); 
            }

        }).catch((error) => {
            console.log(error);
        })
    }


    function doUploadCsv() {
    setShowModal(true)
  }
      function doAddFaculties() {
    setButtonDisabled(true);
    let formData = new FormData();
    formData.append("facultyData", file);
    formData.append("fileName", file.name);
    axios({
      url: "http://localhost:3000/add/faculties",
      method: "post",
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((result) => {
        if (result.data.success) setButtonDisabled(false);
        setShow(true);
        setShowSpinner(false);
      })
      .catch((err) => {
        setShowSpinner(false);
        setButtonDisabled(false);
        alert(err);
      });
  }

  const handleClose = () => {
    setShow(false);
    setShowModal(false)
    navigate("/faculties");
  };




  function goToAddFacultyPage() {
        navigate('/add/faculty')
    }
     function goToEdit(id) {
        navigate('/edit/faculty/' + id);
    }

  return (
         <>
            <h3 className="text-center mb-4 py-2 text-primary fw-bold">List Of Faculty</h3>

            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control type="text" placeholder=" Type Faculty Name to search" onChange={(e) => searchFacutly(e.target.value)} />
            </InputGroup>
            <div className=' d-flex align-content-center gap-2 ms-3 mt-2 float-end'>
              <button className="btn btn-sm btn-success" onClick={goToAddFacultyPage}>Add Faculty +</button>
              <p>Or upload via csv</p>
               <button
                            className="btn btn-success btn-sm "
                            variant="success"
                            disabled={buttonDisabled}
                            onClick={doUploadCsv}
                          >
                            upload Csv
                          </button>

            </div>

            <table className="table text-center table-hover mt-5">
                <thead>
                    <tr>
                        <th>Faculty Image</th>
                        <th>FacultyName</th>
                        <th>Designation</th>
                        <th>Highest Qualification</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        faculties.map((faculty) =>
                            <tr>
                                <td><img src={faculty.facultyImage} height='50px'width='50px' alt="" /></td>
                                <td>{faculty.firstName}{faculty.lastName}</td>
                                <td>{faculty.designation}</td>
                                <td>{faculty.highestQualification}</td>
                                <td>
                                    <i className="bi bi-pencil me-3 " onClick={() => goToEdit(faculty._id)} ></i>
                                    {/* <i className="bi bi-trash" onClick={() => goToDelete(faculty._id)}></i> */}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
                    <div className='d-flex justify-content-center'>
      {totalFaculties > facultyPerPage&&
      <Pagination>{items}</Pagination>}
      </div>

            {showSpinner && (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>Faculty added successfully</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

             <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add faculties</Modal.Title>
          </Modal.Header>
          <Modal.Body>
  <input
    type="file"
    name="facultyData"
    accept=".csv"
    onChange={(e) => {
      if (e.target.files.length > 0) {
        setFile(e.target.files[0]);
      }
    }}
  />

  <Button variant="success btn-md mt-2" disabled={buttonDisabled} onClick={doAddFaculties}>
    Upload CSV
  </Button>
  <div className='mt-3'>
          <p>Click below to download a <b>sample CSV file</b> for reference:</p>
          <a href="/demo.csv" download>
            <Button variant="success">⬇ Download Demo CSV</Button>
          </a>
  </div>
</Modal.Body>
          <Modal.Footer>
            
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </>
  )
}

export default FacultyList