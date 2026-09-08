import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


import { Container, Form, Button, Row, Col, Card, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";



function AddBranch() {

  let navigate = useNavigate()
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  }

  let [courses, setCourses] = useState([]);
  let [buttonDisabled, setButtonDisabled] = useState(false);

  let [course, setCourse] = useState('');
  let [branchCode, setBranchCode] = useState('');
  let [branchShortName, setBranchShortName] = useState('');
  let [branchFullName, setBranchFullName] = useState('');
  let [branchIntake, setBranchIntake] = useState(60);


  useEffect(() => {
    axios.get("http://localhost:3000/courses/for/branch")
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.data);
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


  const doAddBranch = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);


    try {
      const res = await axios.post('http://localhost:3000/add/branch', {
        course,
        branchCode,
        branchShortName,
        branchFullName,
        branchIntake: Number(branchIntake)
      });

      console.log(res.data);
      setShow(true)

      // reset form
      setCourse('');
      setBranchCode('');
      setBranchShortName('');
      setBranchFullName('');
      setBranchIntake('');


    } catch (err) {
      console.log(err.response?.data || err);
      alert('Failed to add course');
    } finally {
      setButtonDisabled(false);
    }
  }


  return (
    <Container className="">
      <Form>
        <h3 className="text-center mb-4 py-2 text-primary fw-bold">ADD NEW COURSE</h3>
        <br />
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Select Course</Form.Label>
            <Form.Select
              value={course}
              onChange={handleChange}
              required
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
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              placeholder="eg: CSE101"
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Branch Short Name</Form.Label>
            <Form.Control
              type="text"
              value={branchShortName}
              onChange={(e) => setBranchShortName(e.target.value)}
              placeholder="eg: CSE"
              required
            />
          </Form.Group>
        </Row>


        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Branch Full Name</Form.Label>
            <Form.Control
              type="text"
              value={branchFullName}
              onChange={(e) => setBranchFullName(e.target.value)}
              placeholder="eg: Computer Science and Engineering"
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Total Intake</Form.Label>
            <Form.Control
              type="number"
              value={branchIntake}
              onChange={(e) => setBranchIntake(e.target.value)}
              placeholder="eg: 60"
              required
            />
          </Form.Group>
        </Row>


        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button onClick={() => navigate('/branches')} variant="secondary" type="button">
            Cancel
          </Button>
          <Button onClick={doAddBranch} disabled={buttonDisabled} variant="primary" type="submit">
            Add Branch
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

export default AddBranch