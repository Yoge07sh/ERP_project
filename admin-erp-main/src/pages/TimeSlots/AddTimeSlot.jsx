import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AddTimeSlot() {
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [session, setSession] = useState("");
    const [lectureNo, setLectureNo] = useState("");
    const [timeSlot, setTimeSlot] = useState("");

    const handleClose = () => {
        setShow(false);
    };

    // Session options
    const sessions = [
        "2026-27",
        "2027-28",
        "2028-29",
    ];

    // Lecture options
    const lectureNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

    // Time slot options
    const timeSlots = [
        "9:10 to 10:00",
        "10:00 to 10:50",
        "11:00 to 11:50",
        "11:50 to 12:20",
        "12:50 to 1:10",
        "1:10 to 2:00",
        "2:00 to 2:50",
        "2:50 to 3:10",
        "3:10 to 4:00",
        "4:00 to 4:50",
    ];

    const doAddTimeSlot = async (e) => {
        e.preventDefault();

        setButtonDisabled(true);

        try {
            const res = await axios.post(
                "http://localhost:3000/add/timeslots",
                {
                    session,
                    lectureNo:Number(lectureNo),
                    timeSlot,
                }
            );

            console.log(res.data);

            setShow(true);

            // Reset form
            setSession("");
            setLectureNo("");
            setTimeSlot("");
            navigate('/timeslots')

        } catch (err) {
            console.log(err.response?.data || err);

            // You can add an alert here if required
            // alert("Failed to add time slot");
        } finally {
            setButtonDisabled(false);
        }
    };

    return (
        <Container>

            <Form onSubmit={doAddTimeSlot}>

                <h3 className="text-center mb-4 py-2 text-primary fw-bold">
                    ADD NEW TIME SLOT
                </h3>

                <hr />

                {/* Session */}
                <Row className="mb-3">

                    <Form.Group as={Col} controlId="session">
                        <Form.Label>Session</Form.Label>

                        <Form.Select
                            value={session}
                            onChange={(e) => setSession(e.target.value)}
                            required
                        >
                            <option value="">
                                -- Select Session --
                            </option>

                            {sessions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </Form.Select>

                    </Form.Group>

                    {/* Lecture Number */}
                    <Form.Group as={Col} controlId="lectureNo">
                        <Form.Label>Lecture No.</Form.Label>

                        <Form.Select
                            value={lectureNo}
                            onChange={(e) => setLectureNo(e.target.value)}
                            required
                        >
                            <option value="">
                                -- Select Lecture No. --
                            </option>

                            {lectureNumbers.map((number) => (
                                <option key={number} value={number}>
                                    Lecture {number}
                                </option>
                            ))}
                        </Form.Select>

                    </Form.Group>

                </Row>


                {/* Time Slot */}
                <Row className="mb-3">

                    <Form.Group as={Col} controlId="timeSlot">

                        <Form.Label>Time Slot</Form.Label>

                        <Form.Select
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            required
                        >

                            <option value="">
                                -- Select Time Slot --
                            </option>

                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}

                        </Form.Select>

                    </Form.Group>

                </Row>


                {/* Buttons */}
                <div className="d-flex justify-content-center gap-2 mt-4">

                    <Button
                        onClick={() => navigate("/timeslots")}
                        variant="secondary"
                        type="button"
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={buttonDisabled}
                        variant="primary"
                        type="submit"
                    >
                        Add Time Slot
                    </Button>

                </div>

            </Form>


            {/* Success Modal */}
            <Modal show={show} onHide={handleClose}>

                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Time Slot Added successfully 👍
                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="danger"
                        onClick={handleClose}
                    >
                        Close
                    </Button>

                </Modal.Footer>

            </Modal>

        </Container>
    );
}

export default AddTimeSlot;