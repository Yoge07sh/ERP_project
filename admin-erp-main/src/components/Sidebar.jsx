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

        const res = await axios.get(apiUrl + "/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setUserName(res.data.data.name);

          setUserRole(res.data.data.userRole);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);

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
        className="sidebar d-flex flex-column justify-content-between border-end sticky-top"
        style={{
          height: "100vh",
          borderRight: "1px solid #dee2e6",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* ================= LOGO ================= */}

        <div className="p-1 d-flex align-items-center ">
          <Image src={logo} width={40} height={40} className="me-2" />

          <span
            style={{ color: "#ffffff" }}
            className="fw-bold d-none d-md-inline fs-2"
          >
            RDEC
          </span>
        </div>

        <div className="sidebar-clock-wrapper mt-1">
          <div className="sidebar-clock-box">
            <div className="sidebar-clock-icon">
              <i className="bi bi-watch"></i>
            </div>

            <div className="sidebar-clock-info">
              <div className="sidebar-clock-time">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>

              <div className="sidebar-clock-date">
                {currentTime.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
              </div>

              <div className="sidebar-clock-live">
                <i className="bi bi-circle-fill"></i> Live
              </div>
            </div>
          </div>
        </div>

        {/* ================= SIDEBAR MENU ================= */}

        <div className="flex-grow-1 border-top mt-3 overflow-auto">
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
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-mortarboard-fill"></i>

                  <span className="d-none d-md-inline">Courses</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/branches"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-building"></i>

                  <span className="d-none d-md-inline">Branches</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/subjects"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-journal-bookmark"></i>

                  <span className="d-none d-md-inline">Subjects</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/subjectsmap"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-diagram-2"></i>

                  <span className="d-none d-md-inline">Subject Mapping</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/faculties"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-person-workspace"></i>

                  <span className="d-none d-md-inline">Faculties</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/facultymapping"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-diagram-3"></i>

                  <span className="d-none d-md-inline">Faculty Mapping</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/students"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-person"></i>

                  <span className="d-none d-md-inline">Students</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/timeslots"
                  className="sidebar-menu-item sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-clock"></i>

                  <span className="d-none d-md-inline">TimeSlots</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/getstudents"
                  className="sidebar-menu-item sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-clipboard-check"></i>

                  <span className="d-none d-md-inline">Attendance</span>
                </ListGroup.Item>
              </>

            )}

            {/* ================= FACULTY ================= */}

            {isFaculty && (
              <>
                <ListGroup.Item
                  as={NavLink}
                  to="/facultymapping"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-diagram-3"></i>

                  <span className="d-none d-md-inline">My Faculty Mapping</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/subjects"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-journal-bookmark"></i>

                  <span className="d-none d-md-inline">Subjects</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/timeslots"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-clock"></i>

                  <span className="d-none d-md-inline">TimeSlots</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/getstudents"
                  className="sidebar-menu-item sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-clipboard-check"></i>

                  <span className="d-none d-md-inline">Attendance</span>
                </ListGroup.Item>

              </>
            )}

            {/* ================= STUDENT ================= */}

            {isStudent && (
              <>
                <ListGroup.Item
                  as={NavLink}
                  to="/students"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-person"></i>

                  <span className="d-none d-md-inline">My Profile</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/subjects"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-journal-bookmark"></i>

                  <span className="d-none d-md-inline">Subjects</span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/timeslots"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <i className="bi bi-clock"></i>

                  <span className="d-none d-md-inline">TimeSlots</span>
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
              <Dropdown.Item as={NavLink} to="/profile">
                <i className="bi bi-person me-2"></i>
                Profile
              </Dropdown.Item>

              <Dropdown.Item as={NavLink} to="/settings">
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
