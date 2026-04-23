// Used by: `App.jsx` on every route for main navigation.
// Su dung boi: `App.jsx` tren moi trang de dieu huong chinh.
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand>ProjectSecurity Demo</Navbar.Brand>
        <Navbar.Toggle aria-controls="security-nav" />
        <Navbar.Collapse id="security-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Home / Trang chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/auth">
              Auth / Đăng nhập
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              Profile / CSRF
            </Nav.Link>
            <Nav.Link as={NavLink} to="/blog">
              Blog / XSS
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
