import { NavLink, useNavigate } from "react-router-dom";

import { ListGroup, Dropdown, Image } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap-icons/font/bootstrap-icons.css";

import logo from "../assets/logo.png";

import { useState, useEffect } from "react";

import axios from "axios";

function Sidebar() {

  let navigate = useNavigate();

  let [username, setUserName] = useState("");
  let [userRole, setUserRole] = useState("");

  // Added for live clock
  let [currentTime, setCurrentTime] = useState(new Date());

  const apiUrl = import.meta.env.VITE_API_URL;


  // ================= GET USER FROM BACKEND =================

  useEffect(() => {

    const getUserData = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          apiUrl + "/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {

          setUserName(res.data.data.name);

          setUserRole(res.data.data.userRole);

        }

      } catch (error) {

        console.log(
          "Error fetching user data:",
          error
        );

        if (error.response?.status === 401) {

          localStorage.removeItem("token");

          navigate("/");

        }

      }

    };

    getUserData();

  }, [apiUrl, navigate]);


  // ================= LIVE CLOCK =================

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentTime(new Date());

    }, 1000);

    return () => clearInterval(timer);

  }, []);


  // ================= LOGOUT =================

  function doLogout() {

    localStorage.removeItem("token");

    setUserName("");
    setUserRole("");

    navigate("/");

  }


  // ================= ROLE CHECK =================

  const isAdmin = userRole === "admin";

  const isFaculty = userRole === "faculty";

  const isStudent = userRole === "student";


  return (

    <>

      <div
        className="d-flex flex-column justify-content-between border-end sticky-top"
        style={{
          width: "18%",
          height: "100vh",
          borderRight: "1px solid #dee2e6",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)"
        }}
      >


        {/* ================= LOGO ================= */}

        <div className="p-3 border-bottom d-flex align-items-center">

          <Image
            src={logo}
            width={40}
            height={40}
            className="me-2"
          />

          <span
            style={{ color: "#1a3c6e" }}
            className="fw-bold d-none d-md-inline fs-2"
          >
            RDEC
          </span>

        </div>


        {/* ================= LIVE CLOCK ================= */}

        <div className="px-3 pt-3">

          <div
            className="p-3 rounded-3 shadow-sm"
            style={{
              background: "#eef6ff",
              border: "1px solid #d6e9ff"
            }}
          >

            <div className="d-flex align-items-center">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "45px",
                  height: "45px",
                  background: "#0d6efd",
                  color: "white"
                }}
              >

                <i className="bi bi-clock fs-4"></i>

              </div>


              <div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "20px",
                    color: "#174a8b"
                  }}
                >

                  {currentTime.toLocaleTimeString()}

                </div>


                <div
                  className="small"
                  style={{
                    color: "#3676b8"
                  }}
                >

                  {currentTime.toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }
                  )}

                </div>


                <div className="small text-success mt-1">

                  <i
                    className="bi bi-circle-fill me-1"
                    style={{
                      fontSize: "7px"
                    }}
                  ></i>

                  Live

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= SIDEBAR MENU ================= */}

        <div className="flex-grow-1 overflow-auto">

          <ListGroup
            variant="flush"
            className="pt-4 px-3 flex-grow-1 overflow-auto"
          >


            {/* ================= ADMIN ================= */}

            {isAdmin && (
              <>


                <ListGroup.Item
                  as={NavLink}
                  to="/courses"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-mortarboard-fill"></i>

                  <span className="d-none d-md-inline">
                    Courses
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/branches"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-building"></i>

                  <span className="d-none d-md-inline">
                    Branches
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/subjects"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-journal-bookmark"></i>

                  <span className="d-none d-md-inline">
                    Subjects
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/subjectsmap"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-diagram-2"></i>

                  <span className="d-none d-md-inline">
                    Subject Mapping
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/faculties"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-person-workspace"></i>

                  <span className="d-none d-md-inline">
                    Faculties
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/facultymapping"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-diagram-3"></i>

                  <span className="d-none d-md-inline">
                    Faculty Mapping
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/students"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-person"></i>

                  <span className="d-none d-md-inline">
                    Students
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/timeslots"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-clock"></i>

                  <span className="d-none d-md-inline">
                    TimeSlots
                  </span>

                </ListGroup.Item>

              </>
            )}


            {/* ================= FACULTY ================= */}

            {isFaculty && (
              <>


                <ListGroup.Item
                  as={NavLink}
                  to="/facultymapping"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-diagram-3"></i>

                  <span className="d-none d-md-inline">
                    My Faculty Mapping
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/subjects"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-journal-bookmark"></i>

                  <span className="d-none d-md-inline">
                    Subjects
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/timeslots"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-clock"></i>

                  <span className="d-none d-md-inline">
                    TimeSlots
                  </span>

                </ListGroup.Item>

              </>
            )}


            {/* ================= STUDENT ================= */}

            {isStudent && (
              <>


                <ListGroup.Item
                  as={NavLink}
                  to="/students"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-person"></i>

                  <span className="d-none d-md-inline">
                    My Profile
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/subjects"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-journal-bookmark"></i>

                  <span className="d-none d-md-inline">
                    Subjects
                  </span>

                </ListGroup.Item>


                <ListGroup.Item
                  as={NavLink}
                  to="/timeslots"
                  className="d-flex align-items-center gap-2"
                >

                  <i className="bi bi-clock"></i>

                  <span className="d-none d-md-inline">
                    TimeSlots
                  </span>

                </ListGroup.Item>

              </>
            )}

          </ListGroup>

        </div>


        {/* ================= PROFILE DROPDOWN ================= */}

        <div className="border-top p-3">

          <Dropdown drop="up">

            <Dropdown.Toggle
              variant="light"
              className="w-100 d-flex align-items-center justify-content-between"
            >

              <div className="d-none d-md-flex align-items-center">

                <div>

                  <h6 className="mb-0">

                    {username || "User"}

                    {" :- "}

                    <small className="text-muted text-capitalize">

                      {userRole || "User"}

                    </small>

                  </h6>

                </div>

              </div>

            </Dropdown.Toggle>


            <Dropdown.Menu className="w-100">

              <Dropdown.Item
                as={NavLink}
                to="/profile"
              >

                <i className="bi bi-person me-2"></i>

                Profile

              </Dropdown.Item>


              <Dropdown.Item
                as={NavLink}
                to="/settings"
              >

                <i className="bi bi-gear me-2"></i>

                Settings

              </Dropdown.Item>


              <Dropdown.Divider />


              <Dropdown.Item onClick={doLogout}>

                <i className="bi bi-box-arrow-right me-2"></i>

                Logout

              </Dropdown.Item>

            </Dropdown.Menu>

          </Dropdown>

        </div>

      </div>

    </>

  );
}

export default Sidebar;