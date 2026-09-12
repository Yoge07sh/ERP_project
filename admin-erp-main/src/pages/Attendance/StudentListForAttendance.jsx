 import {Button,Table,Container} from 'react-bootstrap'
 import 'bootstrap/dist/css/bootstrap.min.css'

 function StudentListForAttendance() {
return (
        <Container className="mt-4">

            {/* Heading + Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="text-primary fw-bold">
                    Student Attendance
                </h3>

                <Button variant="primary">
                    Post Student
                </Button>

            </div>

            {/* Student Table */}
            <Table bordered hover responsive className="text-center">

                <thead>
                    <tr>
                        <th>Roll No.</th>
                        <th>Enrollment No.</th>
                        <th>Student Name</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    

                        <tr >

                            <td>
                            </td>

                            <td>
                            </td>

                            <td>
                            </td>

                            <td>
                            <Button variant='' size="sm"className="me-2" o> P </Button>
                            <Button variant= '' size="sm" > A </Button>
                            </td>

                        </tr>


                </tbody>

            </Table>

        </Container>
    )
}
export default StudentListForAttendance
