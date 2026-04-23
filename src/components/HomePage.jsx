// Route: `/` (home landing page for the demo flow).
// Trang: `/` (trang tổng quan để chọn kịch bản demo).
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Container className="py-4" style={{ maxWidth: 1180 }}>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Card.Title>Security Demo Website / Trang demo bảo mật</Card.Title>
          <Card.Text className="text-muted">
            Three-page flow: Auth, Profile/CSRF, Blog/XSS+Sanitization.
            <br />
            Luồng 3 trang: Đăng nhập, Hồ sơ/CSRF, Blog/XSS+Sanitization.
          </Card.Text>
          <Row className="g-3">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Page 1: Auth / Đăng nhập</Card.Title>
                  <Card.Text>JWT storage risk vs secure cookie approach.</Card.Text>
                  <Card.Text>Rủi ro lưu JWT và cách an toàn bằng cookie.</Card.Text>
                  <Link to="/auth" className="mt-auto">
                    Open / Mở trang
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Page 2: Profile / Hồ sơ</Card.Title>
                  <Card.Text>Change email with and without CSRF token validation.</Card.Text>
                  <Card.Text>Đổi email có/không có xác thực CSRF token.</Card.Text>
                  <Link to="/profile" className="mt-auto">
                    Open / Mở trang
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Page 3: Blog / Bình luận</Card.Title>
                  <Card.Text>Stored XSS demonstration and sanitization fix.</Card.Text>
                  <Card.Text>Minh họa Stored XSS và cách khắc phục bằng sanitize.</Card.Text>
                  <Link to="/blog" className="mt-auto">
                    Open / Mở trang
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HomePage;
