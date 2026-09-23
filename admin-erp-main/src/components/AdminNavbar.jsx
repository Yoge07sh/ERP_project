import { Navbar, Container, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";

function AdminNavbar() {
  const username = localStorage.getItem("name") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  return (
    <Navbar
      sticky="top"
      style={{
        height: "70px",
        backgroundColor: "#0b2d52",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        zIndex: 1030,
      }}
    >
      <Container fluid className="px-4">
        {/* LOGO + BRAND */}
        <Navbar.Brand
          href="#home"
          className="d-flex align-items-center"
          style={{
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "18px",
            textDecoration: "none",
          }}
        >
          <img
            alt="RDEC"
            src={logo}
            width="45"
            height="45"
            style={{
              objectFit: "contain",
              marginRight: "10px",
            }}
          />

          <span>RDEC ERP</span>
        </Navbar.Brand>

        {/* USER + LOGOUT */}
        <div className="ms-auto d-flex align-items-center gap-3">
          {/* USERNAME */}
          <div
            className="d-flex align-items-center"
            style={{
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <i
              className="bi bi-person-circle"
              style={{
                fontSize: "20px",
                marginRight: "8px",
              }}
            ></i>
            Welcome, {username}
          </div>

          {/* LOGOUT BUTTON */}
          <Button
            onClick={handleLogout}
            variant="outline-light"
            className="d-flex align-items-center"
            style={{
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            <i
              className="bi bi-box-arrow-right"
              style={{
                marginRight: "6px",
              }}
            ></i>
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
