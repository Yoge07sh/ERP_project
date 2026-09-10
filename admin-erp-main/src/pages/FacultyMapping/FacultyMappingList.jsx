import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import {Button,Form,InputGroup,Container,Pagination} from 'react-bootstrap'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

function FacultyMappingList() {

    const navigate = useNavigate();

    const handleAdd = () => {
        navigate('/add/facultymapping')
    }

    const [facultyMapping, setFacultyMapping] = useState([]);

    // Search state
    const [search, setSearch] = useState('');
    const [searchBy, setSearchBy] = useState('facultyName');

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Loading state
    const [loading, setLoading] = useState(false);


    // Get faculty mapping data
    const getFacultyMapping = async () => {

        try {

            setLoading(true);

            const res = await axios({
                url: apiUrl + '/get/facultymapping',
                method: 'get',
                params: {
                    page: page,
                    limit: limit,
                    search: search,
                    searchBy: searchBy
                }
            });

            setFacultyMapping(res.data.data);

            // Total pages returned from backend
            setTotalPages(res.data.totalPages);

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                'Something went wrong'
            );

        } finally {

            setLoading(false);

        }
    }


    // Get data whenever page, search or search type changes
    useEffect(() => {

        getFacultyMapping();

    }, [page, search, searchBy]);


    // Handle search text
    const handleSearch = (e) => {

        setSearch(e.target.value);

        // Reset pagination when searching
        setPage(1);

    }


    // Handle search type
    const handleSearchByChange = (e) => {

        setSearchBy(e.target.value);

        // Reset pagination when changing search type
        setPage(1);

    }


    return (

        <Container>


            <h3 className="text-center mb-4 py-2 text-primary fw-bold">
                LIST OF FACULTY MAPPING
            </h3>



            <div className="row mb-3">


                <div className="col-md-3">

                    <Form.Select
                        value={searchBy}
                        onChange={handleSearchByChange}
                    >

                        <option value="facultyName">
                            Faculty Name 
                        </option>

                        <option value="session">
                            Session
                        </option>

                    </Form.Select>

                </div>



                <div className="col-md-6">

                    <InputGroup>

                        <InputGroup.Text>
                            <i className="bi bi-search"></i>
                        </InputGroup.Text>

                        <Form.Control
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder={
                                searchBy === 'facultyName'
                                    ? 'Type Faculty Name to search'
                                    : 'Type Session to search'
                            }
                        />

                    </InputGroup>

                </div>



                <div className="col-md-3">

                    <Button
                        className="btn btn-success float-end"
                        onClick={handleAdd}
                    >
                        Add Faculty +
                    </Button>

                </div>

            </div>



            <div className="table-responsive">

                <table className="table text-center table-hover mt-5">

                    <thead>

                        <tr>
                            <th>Session</th>
                            <th>Faculty Name</th>
                            <th>Course</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>Section</th>
                            <th>Subject</th>
                            <th>LoadPerWeek</th>
                            <th>Action</th>
                        </tr>

                    </thead>


                    <tbody>


                        {loading ? (

                            <tr>

                                <td colSpan="10">
                                    Loading...
                                </td>

                            </tr>

                        ) : facultyMapping.length > 0 ? (


                            facultyMapping.map((mapping) => (

                                <tr key={mapping._id}>

                                    <td>
                                        {mapping.session}
                                    </td>

                                    <td>
                                        {mapping.facultyId?.firstName}{' '}
                                        {mapping.facultyId?.lastName}
                                    </td>

                                    <td>
                                        {mapping.course?.courseShortName}
                                    </td>

                                    <td>
                                        {mapping.branch?.branchShortName}
                                    </td>

                                    <td>
                                        {mapping.year}
                                    </td>

                                    <td>
                                        {mapping.semester}
                                    </td>

                                    <td>
                                        {mapping.section}
                                    </td>

                                    <td>
                                        {mapping.subjectId?.subjectNickName}
                                    </td>

                                    <td>
                                        {mapping.loadPerWeek}
                                    </td>

                                    <td>


                                        <i
                                            className="bi bi-pencil me-3"
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        ></i>



                                        <i
                                            className="bi bi-trash"
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        ></i>

                                    </td>

                                </tr>

                            ))

                        ) : (


                            <tr>

                                <td colSpan="10">
                                    No records found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>



            {totalPages > 1 && (

                <div className="d-flex justify-content-center mt-4">

                    <Pagination>


                        <Pagination.First
                            disabled={page === 1}
                            onClick={() => setPage(1)}
                        />



                        <Pagination.Prev
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        />



                        {[...Array(totalPages)].map((_, index) => {

                            const pageNumber = index + 1;

                            return (

                                <Pagination.Item
                                    key={pageNumber}
                                    active={pageNumber === page}
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </Pagination.Item>

                            )

                        })}



                        <Pagination.Next
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        />


                        // Last page

                        <Pagination.Last
                            disabled={page === totalPages}
                            onClick={() => setPage(totalPages)}
                        />

                    </Pagination>

                </div>

            )}

        </Container>
    )
}

export default FacultyMappingList;
