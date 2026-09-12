function StudentList() {

}
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

                    {students.map((student, index) => (

                        <tr key={student.id}>

                            <td>
                                {index + 1}
                            </td>

                            <td>
                                {student.enrollmentNo}
                            </td>

                            <td>
                                {student.studentName}
                            </td>

                            <td>
                            <Button variant={student.status === 'Present'? 'success' : 'outline-success'} size="sm" className="me-2" onClick={() =>  markAttendance( student.id,'Present' ) }> P </Button>
                            <Button variant={ student.status === 'Absent' ? 'danger' : 'outline-danger' } size="sm" onClick={() => markAttendance(student.id,'Absent')}> A </Button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </Table>

        </Container>
    )





export default StudentList
