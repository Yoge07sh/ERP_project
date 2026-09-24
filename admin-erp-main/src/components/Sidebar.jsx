import { NavLink, useNavigate } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserGraduate } from "react-icons/fa";

// ================= LIVE CLOCK =================
function SidebarClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "8px 2px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "1.2",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </div>

      <div
        style={{
          marginTop: "2px",
          fontSize: "11px",
          color: "#b9c8d8",
          lineHeight: "1.2",
        }}
      >
        {currentTime.toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </div>

      <div
        style={{
          marginTop: "2px",
          fontSize: "10px",
          color: "#22c55e",
          fontWeight: "600",
          lineHeight: "1.2",
        }}
      >
        <i
          className="bi bi-circle-fill"
          style={{
            fontSize: "5px",
            marginRight: "4px",
          }}
        ></i>
        Live
      </div>
    </div>
  );
}

// ================= SIDEBAR =================
function Sidebar() {
  let navigate = useNavigate();
  let [userRole, setUserRole] = useState("");

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
        {/* ================= CLOCK ================= */}
        <SidebarClock />

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
                  <span className="d-none d-md-inline">
                    Subject Mapping
                  </span>
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
                  <span className="d-none d-md-inline">
                    Faculty Mapping
                  </span>
                </ListGroup.Item>

                <ListGroup.Item
                  as={NavLink}
                  to="/students"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
                >
                  <FaUserGraduate />
                  <span className="d-none d-md-inline">Students</span>
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
                  className="sidebar-menu-item d-flex align-items-center gap-2"
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
                  to="/getstudents"
                  className="sidebar-menu-item d-flex align-items-center gap-2"
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
                  <i className="bi bi-person-circle"></i>
                  <span className="d-none d-md-inline">My Profile</span>
                </ListGroup.Item>
              </>
            )}
          </ListGroup>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
