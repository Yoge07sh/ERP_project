import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function EditTimeSlot() {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;
    const [show, setShow] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [TimeSlot, setTimeSlot] = useState({
        session: "",
        lectureNo: "",
        startTime: "",
        endTime: ""
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setTimeSlot((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        setShow(false);
    };

    const sessions = [
        "2026-27",
        "2027-28",
        "2028-29"
    ];

    const lectureNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

    const formatTime = (time) => {
        if (!time) return "";

        let [hours, minutes] = time.split(":");

        hours = Number(hours);

        let period = "AM";

        if (hours >= 12) {
            period = "PM";
        }

        if (hours > 12) {
            hours = hours - 12;
        }

        if (hours === 0) {
            hours = 12;
        }

        return `${hours}:${minutes} ${period} `;
    };

    const formatTimeSlot = (timeSlot) => {
        if (!timeSlot) return "";

        const [start, end] = timeSlot.split("-");

        return `${formatTime(start.trim())} - ${formatTime(end.trim())} `;
    };

    const timeSlot = `${TimeSlot.startTime}-${TimeSlot.endTime} `;

    const doEditTimeSlot = async (e) => {
        e.preventDefault();

        if (!TimeSlot.startTime || !TimeSlot.endTime) {
            alert("Please select both start time and end time.");
            return;
        }


        setButtonDisabled(true);

        try {
            const res = await axios.put(
                `http://localhost:3000/edit/timeslot/${id}`,
                {
                    session: TimeSlot.session,
                    lectureNo: Number(TimeSlot.lectureNo),
                    timeSlot: timeSlot
                }
            );

            console.log(res.data);

            setShow(true);
        } catch (err) {
            console.log(err.response?.data || err);
            alert("Failed to update time slot.");
        } finally {
            setButtonDisabled(false);
        }
    };

    useEffect(() => {

        axios({
            url: `http://localhost:3000/timeslot/${id}`,
            method: 'get'
        }).then((res) => {
            console.log(res.data);

            const data = res.data.data || res.data;

            const [startTime, endTime] = data.timeSlot.split("-");

            setTimeSlot({
                session: data.session,
                lectureNo: data.lectureNo,
                startTime: startTime.trim(),
                endTime: endTime.trim()
            });

        }).catch((err) => {
            alert(err);
        })

    }, [id]);

    return (
        <Container>
            <Form onSubmit={doEditTimeSlot}>
                <h3 className="text-center mb-4 py-2 text-primary fw-bold">
                    EDIT TIME SLOT
                </h3>

                <hr />

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="session">
                        <Form.Label>Session</Form.Label>

                        <Form.Select
                            name="session"
                            value={TimeSlot.session}
                            onChange={handleChange}
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

                    <Form.Group as={Col} controlId="lectureNo">
                        <Form.Label>Lecture No.</Form.Label>

                        <Form.Select
                            name="lectureNo"
                            value={TimeSlot.lectureNo}
                            onChange={handleChange}
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

                <Row className="mb-3">
                    <Form.Group
                        as={Col}
                        md={6}
                        controlId="startTime"
                    >
                        <Form.Label>Start Time</Form.Label>

                        <Form.Control
                            type="time"
                            name="startTime"
                            value={TimeSlot.startTime}
                            onChange={handleChange}
                            required
                        />

                        {TimeSlot.startTime && (
                            <Form.Text className="text-primary">
                                Selected: {formatTime(TimeSlot.startTime)}
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        md={6}
                        controlId="endTime"
                    >
                        <Form.Label>End Time</Form.Label>

                        <Form.Control
                            type="time"
                            name="endTime"
                            value={TimeSlot.endTime}
                            onChange={handleChange}
                            required
                        />

                        {TimeSlot.endTime && (
                            <Form.Text className="text-primary">
                                Selected: {formatTime(TimeSlot.endTime)}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Row>

                {TimeSlot.startTime && TimeSlot.endTime && (
                    <Row className="mb-3">
                        <Col>
                            <div className="alert alert-info">
                                <strong>Time Slot:</strong>

                                <span className="ms-2">
                                    {formatTimeSlot(timeSlot)}
                                </span>
                            </div>
                        </Col>
                    </Row>
                )}

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
                        {buttonDisabled
                            ? "Updating..."
                            : "Update Time Slot"}
                    </Button>
                </div>
            </Form>

            <Modal
                show={show}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Success
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Time Slot Updated successfully 👍
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleClose();
                            navigate("/timeslots");
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default EditTimeSlot;

