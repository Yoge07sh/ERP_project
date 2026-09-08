import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'

import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


function StudentEdit() {


  let [student, setStudent] = useState({});
  let navigate = useNavigate();
  let params = useParams();
  let [show, setShow] = useState(false);
  const [sameAsLocal, setSameAsLocal] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(false);
  let [showSpinner, setShowSpinner] = useState(false);



  const handleClose = () => {
    setShow(false);
    navigate('/students')
  }

  function handleChange(e) {
    let name = e.target.name
    let value = e.target.value
    setStudent((prev) => {
      return {
        ...prev, [name]: value
      }
    })
  }

  function doEditStudent(id) {
    axios({
      url: 'http://localhost:3000/edit/student/' + id,
      method: 'put',
      data: student
    }).then((result) => {
      if (result.data.success) {
        setShow(true);
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    axios({
      url: 'http://localhost:3000/student/' + params.id,
      method: 'get'
    }).then((result) => {
      setStudent(result.data.data)
    }).catch((err) => {

    })
  }, [params])



  function handleSameAsLocal(e) {
    const checked = e.target.checked;
    setSameAsLocal(checked);

    if (checked) {
      setStudent(prev => ({
        ...prev,
        permanentAddressLine1: prev.localAddressLine1,
        permanentAddressLine2: prev.localAddressLine2,
        permanentCity: prev.localCity,
        permanentState: prev.localState,
        permanentPincode: prev.localPincode,
      }));
    } else {
      setStudent(prev => ({
        ...prev,
        permanentAddressLine1: "",
        permanentAddressLine2: "",
        permanentCity: "",
        permanentState: "",
        permanentPincode: "",
      }));
    }
  }





  return (
    <>
      <Container>
        <h4 className="text-center mb-4 py-2 text-primary fw-bold">ADD NEW STUDENT</h4>
        <Form onSubmit={doEditStudent}>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Enrollment Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter enrollment number"
                  value={student.enrollmentNumber}
                  onChange={handleChange}
                  name='enrollmentNumber'
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>File Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter file number"
                  value={student.fileNumber}
                  onChange={handleChange}
                  name='fileNumber'
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Roll Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter roll number"
                  value={student.rollNumber}
                  onChange={handleChange}
                  name='rollNumber'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={student.firstName}
                  onChange={handleChange}
                  name='firstName'
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={student.lastName}
                  onChange={handleChange}
                  name='lastName'
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={student.dob}
                  onChange={handleChange}
                  name='dob'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select value={student.gender} onChange={(handleChange)} name='gender' required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Father's Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter father's name"
                  value={student.fatherName}
                  onChange={handleChange}
                  name='fatherName'
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Mother's Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mother's name"
                  value={student.motherName}
                  onChange={handleChange}
                  name='motherName'
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Emails and Contact */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Personal Email</Form.Label>
                <Form.Control
                  type="email"
                  value={student.personalEmailId}
                  onChange={handleChange}
                  name='personalEmailId'
                  placeholder='example@gamil.com'

                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>College Email</Form.Label>
                <Form.Control
                  type="email"
                  value={student.collegeEmailId}
                  onChange={handleChange}
                  name='collegeEmailId'
                  placeholder='example@rdec.in'

                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  value={student.mobileNumber}
                  onChange={handleChange}
                  name='mobileNumber'
                  placeholder='Enter mobile number'
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Emergency Number</Form.Label>
                <Form.Control
                  type="text"
                  value={student.emergencyMobNumber}
                  onChange={handleChange}
                  name='emergencyMobNumber'
                  placeholder='Enter emergency mobile number'
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Admission Year</Form.Label>
                <Form.Control
                  type="number"
                  value={student.admissionYear}
                  onChange={handleChange}
                  name='admissionYear'

                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Current Session</Form.Label>
                <Form.Control
                  type="text"
                  value={student.currentSession}
                  onChange={handleChange}
                  name='currentSession'
                  placeholder='eg:2020'

                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Select
                  value={student.year}
                  onChange={handleChange}
                  name='year'

                >
                  <option value="">Select</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                  <option value="4">4th</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Semester</Form.Label>
                <Form.Select
                  value={student.semester}
                  onChange={handleChange}
                  name='semester'

                >
                  <option value="">Select</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                  <option value="4">4th</option>
                  <option value="5">5th</option>
                  <option value="6">6th</option>
                  <option value="7">7th</option>
                  <option value="8">8th</option>

                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Group</Form.Label>
                <Form.Select
                  value={student.group}
                  onChange={handleChange}
                  name='group'
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="All">All</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Local Address */}
          <div className="p-3 mb-4 border rounded">
            <h5 className="mt-4 text-primary">Local Address</h5>
            <Row>
              <Col md={4}>
                <Form.Control
                  name="localAddressLine1"
                  placeholder="Address Line 1"
                  value={student.localAddressLine1}
                  onChange={handleChange}

                />
              </Col>
              <Col md={4}>
                <Form.Control
                  name="localAddressLine2"
                  placeholder="Address Line 2"
                  value={student.localAddressLine2}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  name="localCity"
                  placeholder="City"
                  value={student.localCity}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Control
                  name="localState"
                  placeholder="State"
                  value={student.localState}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  name="localPincode"
                  placeholder="Pincode"
                  value={student.localPincode}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </div>

          {/* Checkbox for copying address */}
          <Form.Check
            type="checkbox"
            label="Permanent Address same as Local Address"
            checked={sameAsLocal}
            onChange={handleSameAsLocal}
          />

          {/* Permanent Address */}
          <div className="p-3 mb-4 border rounded">
            <h5 className="mt-4 text-primary">Permanent Address</h5>
            <Row>
              <Col md={4}>
                <Form.Control
                  name="permanentAddressLine1"
                  placeholder="Address Line 1"
                  value={student.permanentAddressLine1}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  name="permanentAddressLine2"
                  placeholder="Address Line 2"
                  value={student.permanentAddressLine2}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  name="permanentCity"
                  placeholder="City"
                  value={student.permanentCity}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Control
                  name="permanentState"
                  placeholder="State"
                  value={student.permanentState}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  name="permanentPincode"
                  placeholder="Pincode"
                  value={student.permanentPincode}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </div>


          {/* File Upload and Submit */}
          <Row className="mt-4">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Student Image</Form.Label>
                <Form.Control type="file" onChange={e => setFile(e.target.files[0])} />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-center gap-2 mt-4">
            <Button onClick={() => navigate('/students')} variant="secondary" type="button">
              Cancel
            </Button>
            <Button onClick={() => doEditStudent(student._id)} variant="primary">
              Update
            </Button>
          </div>
        </Form>


        {/* ******************************** */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton><Modal.Title>Success</Modal.Title></Modal.Header>
          <Modal.Body>Student has been Updated successfully 👍</Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={handleClose}>Close</Button></Modal.Footer>
        </Modal>

        {showSpinner && <Spinner animation="border" />}
      </Container>
    </>
  )
}

export default StudentEdit