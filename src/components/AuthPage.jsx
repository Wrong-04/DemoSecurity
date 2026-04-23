// Route: `/auth` (login/logout and JWT/OAuth demo).
// Trang: `/auth` (demo đăng nhập/đăng xuất và JWT/OAuth).
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Alert, Badge, Button, Card, Container, Form, ListGroup, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { API_BASE } from '../utils/security';

function AuthPage() {
  const [policy, setPolicy] = useState(null);
  const [username, setUsername] = useState('student1');
  const [isVulnerableMode, setIsVulnerableMode] = useState(true);
  const [tokenStore, setTokenStore] = useState('No token / Chưa có token');
  const [jwtView, setJwtView] = useState('Click button to show / Bấm nút để hiển thị');
  const [oauthView, setOauthView] = useState('Click button to show / Bấm nút để hiển thị');
  const [apiNotice, setApiNotice] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);
  const [toast, setToast] = useState({ show: false, variant: 'success', title: '', body: '' });

  useEffect(() => {
    axios
      .get(`${API_BASE}/authMeta/1`)
      .then((res) => {
        setPolicy(res.data);
        setApiNotice('');
      })
      .catch(() => {
        setApiNotice('API is offline, using fallback policy. / API đang tắt, dùng chính sách mặc định.');
        setPolicy({
          jwtPolicy: 'RS256 only, validate exp/iss/aud, short token lifetime',
          oauthPolicy: 'Authorization Code + PKCE + state + strict redirect_uri'
        });
      });
  }, []);

  const jwtChecklist = useMemo(
    () => 'Verify signature, whitelist RS256/ES256, validate exp/iss/aud/nbf, short expiry, HttpOnly cookie.',
    []
  );

  const login = () => {
    const fakeToken = `fake-jwt-for-${username}`;
    if (isVulnerableMode) {
      localStorage.setItem('demo_token', fakeToken);
      setTokenStore('RỦI RO CAO: JWT lưu trong localStorage (có thể bị XSS đọc và đánh cắp).');
      setToast({
        show: true,
        variant: 'danger',
        title: 'Vulnerable Mode / Chế độ lỗ hổng',
        body: `Token demo: ${fakeToken}`
      });
    } else {
      localStorage.removeItem('demo_token');
      setTokenStore('AN TOÀN: Token nên lưu trong HttpOnly + Secure + SameSite Cookie (mô phỏng). JS không đọc được.');
      setToast({
        show: true,
        variant: 'success',
        title: 'Fixed Mode / Chế độ an toàn',
        body: 'Token không truy cập được bằng JavaScript (HttpOnly).'
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('demo_token');
    setTokenStore('No token / Chưa có token');
    setToast({ show: true, variant: 'secondary', title: 'Logout / Đăng xuất', body: 'Đã xóa token demo.' });
  };

  return (
    <Container className="py-4" style={{ maxWidth: 980 }}>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={3500}
          autohide
          bg={toast.variant}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">{toast.title}</strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'secondary' ? 'text-white' : 'text-white'}>{toast.body}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div>
              <Card.Title className="mb-1">Page 1: Auth / Đăng nhập</Card.Title>
              <Card.Text className="mb-0 text-muted">JWT storage: localStorage vs HttpOnly Cookie (simulated)</Card.Text>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Badge bg={isVulnerableMode ? 'danger' : 'success'} style={{ fontSize: 14, padding: '8px 10px' }}>
                {isVulnerableMode ? 'Vulnerable Mode (Storage: localStorage)' : 'Fixed Mode (Storage: HttpOnly Cookie)'}
              </Badge>
              <Form.Check
                type="switch"
                id="jwt-mode-switch"
                label={isVulnerableMode ? 'Vulnerable / Lỗ hổng' : 'Fixed / An toàn'}
                checked={!isVulnerableMode}
                onChange={(e) => setIsVulnerableMode(!e.target.checked)}
              />
              <Badge bg="secondary">JWT + OAuth/OIDC</Badge>
            </div>
          </div>
          {apiNotice ? <p className="text-warning mb-2">{apiNotice}</p> : null}

          <Form.Group className="mb-3">
            <Form.Label>Username / Tên đăng nhập</Form.Label>
            <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Alert variant={isVulnerableMode ? 'danger' : 'success'} className="mt-2">
            {isVulnerableMode ? (
              <>
                <b>RỦI RO:</b> Nếu XSS xảy ra, JavaScript có thể đọc token từ <code>localStorage</code>.
              </>
            ) : (
              <>
                <b>AN TOÀN:</b> Token trong <code>HttpOnly</code> cookie không thể bị JavaScript đọc (giảm rủi ro bị XSS lấy token).
              </>
            )}
          </Alert>

          <div className="mt-3">
            <Button variant="primary" className="me-2" onClick={login}>
              Login / Đăng nhập
            </Button>
            <Button variant="outline-secondary" onClick={logout}>
              Logout / Đăng xuất
            </Button>
          </div>

          <Alert className="mt-3 mb-3" variant={isVulnerableMode ? 'danger' : 'success'}>
            {tokenStore}
          </Alert>

          <div className="d-flex flex-wrap gap-2">
            <Button variant="outline-primary" onClick={() => setJwtView(jwtChecklist)}>
              Xem JWT checklist / JWT checklist
            </Button>
            <Button variant="outline-success" onClick={() => setOauthView('Authorization Code + PKCE + state + strict redirect_uri')}>
              Xem OAuth flow / OAuth flow
            </Button>
            <Button variant="dark" onClick={() => setShowChecklist(true)}>
              Xem checklist đầy đủ / Open modal
            </Button>
          </div>

          <ListGroup className="mt-3">
            <ListGroup.Item>
              <b>JWT:</b> {jwtView}
            </ListGroup.Item>
            <ListGroup.Item>
              <b>OAuth:</b> {oauthView}
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Policy from API / Chính sách từ API:</b> {policy ? `${policy.jwtPolicy} | ${policy.oauthPolicy}` : 'loading...'}
            </ListGroup.Item>
          </ListGroup>

          <Modal show={showChecklist} onHide={() => setShowChecklist(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Checklist Bảo mật / Security Checklist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h6>JWT (3 ý chính)</h6>
              <ul>
                <li>Verify signature, không cho phép <code>alg=none</code></li>
                <li>Whitelist thuật toán (ưu tiên RS256/ES256)</li>
                <li>Validate claims: <code>exp</code>, <code>iss</code>, <code>aud</code>, <code>nbf</code></li>
              </ul>
              <h6>OAuth/OIDC (3 ý chính)</h6>
              <ul>
                <li>Authorization Code Flow + PKCE</li>
                <li>Dùng <code>state</code> chống CSRF</li>
                <li>Redirect URI strict + token lifetime ngắn</li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowChecklist(false)}>
                Close / Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AuthPage;
