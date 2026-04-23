// Route: `/profile` (CSRF demo in profile settings page).
// Trang: `/profile` (demo CSRF trong trang cài đặt hồ sơ).
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Badge, Button, Card, Container, Form, Toast, ToastContainer } from 'react-bootstrap';
import { API_BASE } from '../utils/security';

function ProfileSecurityPage() {
  const [serverToken, setServerToken] = useState('csrf-demo-token-2026');
  const [submittedToken, setSubmittedToken] = useState('');
  const [status, setStatus] = useState('No request yet / Chưa có request');
  const [email, setEmail] = useState('old@mail.com');
  const [newEmail, setNewEmail] = useState('');
  const [isVulnerableMode, setIsVulnerableMode] = useState(true);
  const [apiNotice, setApiNotice] = useState('');
  const [toast, setToast] = useState({ show: false, variant: 'success', title: '', body: '' });

  useEffect(() => {
    axios
      .get(`${API_BASE}/csrfMeta/1`)
      .then((res) => {
        setServerToken(res.data.token);
        setApiNotice('');
      })
      .catch(() => {
        setApiNotice('API is offline, using fallback token. / API đang tắt, dùng token mặc định.');
      });
  }, []);

  const submit = () => {
    if (!newEmail) {
      setStatus('Blocked: new email is required / Chặn: cần nhập email mới');
      return;
    }
    if (!isVulnerableMode && submittedToken !== serverToken) {
      setStatus('Blocked: invalid CSRF token / Chặn: token CSRF không hợp lệ');
      setToast({
        show: true,
        variant: 'danger',
        title: '403 Forbidden / Bị chặn',
        body: 'CSRF Token không hợp lệ. Request từ trang ngoài sẽ bị chặn.'
      });
      return;
    }
    setEmail(newEmail);
    setStatus(
      !isVulnerableMode
        ? 'Accepted: token valid, email updated / Chấp nhận: token đúng, đã cập nhật email'
        : 'VULNERABLE: email updated without CSRF token / Lỗ hổng: đổi email không cần token'
    );
    setToast({
      show: true,
      variant: isVulnerableMode ? 'warning' : 'success',
      title: isVulnerableMode ? 'Attack succeeded / Tấn công thành công' : 'Success / Thành công',
      body: isVulnerableMode
        ? 'Email đã đổi dù không có CSRF token. Đây là nguy cơ CSRF.'
        : 'Email đã đổi và được bảo vệ bởi CSRF token.'
    });
    setNewEmail('');
  };

  const simulateAttacker = () => {
    // Simulates attacker.com auto-submitting a POST without CSRF token.
    setNewEmail('hacked@attacker.com');
    if (!isVulnerableMode) {
      setStatus('Blocked: invalid CSRF token / Chặn: token CSRF không hợp lệ');
      setToast({
        show: true,
        variant: 'danger',
        title: 'Attack blocked / Tấn công bị chặn',
        body: 'Request từ attacker.com không có token nên bị chặn.'
      });
      return;
    }
    setEmail('hacked@attacker.com');
    setStatus('VULNERABLE: email updated without CSRF token / Lỗ hổng: đổi email không cần token');
    setToast({
      show: true,
      variant: 'danger',
      title: 'Attack succeeded / Tấn công thành công',
      body: 'Trình duyệt tự gửi cookie/session nên server tưởng là bạn thao tác.'
    });
  };

  const variant = status.startsWith('Blocked') ? 'danger' : 'success';

  return (
    <Container className="py-4" style={{ maxWidth: 980 }}>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={4000}
          autohide
          bg={toast.variant === 'warning' ? 'warning' : toast.variant}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">{toast.title}</strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'warning' ? 'text-dark' : 'text-white'}>{toast.body}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div>
              <Card.Title className="mb-1">Page 2: Profile Settings / Cài đặt hồ sơ</Card.Title>
              <Card.Text className="mb-0 text-muted">CSRF demo (Token ON/OFF) / Demo CSRF (Bật/Tắt token)</Card.Text>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Badge bg={isVulnerableMode ? 'danger' : 'success'} style={{ fontSize: 14, padding: '8px 10px' }}>
                {isVulnerableMode ? 'Vulnerable Mode (CSRF: OFF)' : 'Fixed Mode (CSRF: ON)'}
              </Badge>
              <Form.Check
                type="switch"
                id="csrf-switch"
                label={isVulnerableMode ? 'Vulnerable / Lỗ hổng' : 'Fixed / An toàn'}
                checked={!isVulnerableMode}
                onChange={(e) => setIsVulnerableMode(!e.target.checked)}
              />
            </div>
          </div>
          <Card.Text>
            Demo "change email" request with and without CSRF validation.
            <br />
            Minh họa request "đổi email" có và không có xác thực CSRF.
          </Card.Text>
          {apiNotice ? (
            <Alert variant="warning" className="mb-3">
              {apiNotice}
            </Alert>
          ) : null}
          <Form.Label>Current email / Email hiện tại</Form.Label>
          <Form.Control className="mb-3" value={email} disabled />
          <Form.Label>New email / Email mới</Form.Label>
          <Form.Control className="mb-3" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />

          {!isVulnerableMode ? (
            <>
              <Form.Label>Server token / Token từ server</Form.Label>
              <Form.Control value={serverToken || 'loading...'} disabled />
              <Form.Label className="mt-3">Client submitted token / Token gửi lên</Form.Label>
              <Form.Control value={submittedToken} onChange={(e) => setSubmittedToken(e.target.value)} />
            </>
          ) : (
            <Alert variant="danger">
              CSRF Token: OFF / Tắt CSRF token. Form này có thể bị website khác gửi request thay bạn.
            </Alert>
          )}

          <div className="d-flex flex-wrap gap-2 mt-2">
            <Button onClick={submit}>Submit / Gửi</Button>
            <Button variant="outline-danger" onClick={simulateAttacker}>
              Simulate attacker.com / Giả lập Attacker.com
            </Button>
          </div>
          <Alert className="mt-3 mb-0" variant={variant}>
            {status}
          </Alert>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfileSecurityPage;
