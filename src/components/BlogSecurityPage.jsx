// Route: `/blog` (stored XSS + sanitization + validation demo).
// Trang: `/blog` (demo Stored XSS + sanitize + validation).
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Table, Toast, ToastContainer } from 'react-bootstrap';
import { API_BASE, DEFAULT_XSS_PAYLOAD, escapeHtml } from '../utils/security';

function BlogSecurityPage() {
  const [author, setAuthor] = useState('student-demo');
  const [content, setContent] = useState(DEFAULT_XSS_PAYLOAD);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [apiDown, setApiDown] = useState(false);
  const [isVulnerableMode, setIsVulnerableMode] = useState(true);
  const [toast, setToast] = useState({ show: false, variant: 'success', title: '', body: '' });

  const renderMode = useMemo(() => (isVulnerableMode ? 'unsafe' : 'safe'), [isVulnerableMode]);

  const loadComments = () => {
    axios
      .get(`${API_BASE}/comments`)
      .then((res) => {
        setComments(res.data);
        setApiDown(false);
      })
      .catch(() => {
        setApiDown(true);
      });
  };

  useEffect(() => {
    loadComments();
  }, []);

  const submit = async () => {
    if (author.trim().length < 3) {
      setError('Author must have at least 3 characters. / Tên tác giả phải có ít nhất 3 ký tự.');
      return;
    }
    if (content.trim().length < 5 || content.length > 300) {
      setError('Comment length must be 5-300. / Độ dài bình luận phải trong khoảng 5-300.');
      return;
    }

    const newComment = {
      id: Date.now(),
      projectId: 1,
      author,
      rawContent: content,
      sanitizedContent: escapeHtml(content)
    };

    if (apiDown) {
      setComments((prev) => [newComment, ...prev]);
    } else {
      try {
        await axios.post(`${API_BASE}/comments`, newComment);
      } catch (postError) {
        setApiDown(true);
        setComments((prev) => [newComment, ...prev]);
      }
    }

    setError('');
    setContent('');
    loadComments();

    setToast({
      show: true,
      variant: isVulnerableMode ? 'danger' : 'success',
      title: isVulnerableMode ? 'Vulnerable Mode / Chế độ lỗ hổng' : 'Fixed Mode / Chế độ an toàn',
      body: isVulnerableMode
        ? 'Đã lưu bình luận. Nếu có mã độc (Stored XSS), nó có thể chạy khi người khác xem.'
        : 'Đã lưu bình luận. Nội dung đã được sanitize/escape nên hiển thị an toàn.'
    });
  };

  return (
    <Container className="py-4" style={{ maxWidth: 1140 }}>
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
          <Toast.Body className="text-white">{toast.body}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div>
              <Card.Title className="mb-1">Page 3: Blog Comments / Bình luận blog</Card.Title>
              <Card.Text className="mb-0 text-muted">
                Stored XSS demo + Sanitization fix / Demo Stored XSS + khắc phục Sanitization
              </Card.Text>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Badge bg={isVulnerableMode ? 'danger' : 'success'} style={{ fontSize: 14, padding: '8px 10px' }}>
                {isVulnerableMode ? 'Vulnerable Mode (Attack)' : 'Fixed Mode (Safe)'}
              </Badge>
              <Form.Check
                type="switch"
                id="xss-mode-switch"
                label={isVulnerableMode ? 'Vulnerable / Lỗ hổng' : 'Fixed / An toàn'}
                checked={!isVulnerableMode}
                onChange={(e) => setIsVulnerableMode(!e.target.checked)}
              />
            </div>
          </div>
          <Card.Text>
            <span className="text-muted">
              Tip: Dán payload như <code>{`<img src=x onerror="alert('XSS!')">`}</code> để thấy khác biệt.
            </span>
          </Card.Text>
          {apiDown ? (
            <Alert variant="warning">
              API is offline, saving data on UI only.
              <br />
              API đang tắt, dữ liệu chỉ lưu tạm trên giao diện.
            </Alert>
          ) : null}
          <Row>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Author / Tác giả</Form.Label>
                <Form.Control value={author} onChange={(e) => setAuthor(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comment / Bình luận</Form.Label>
                <Form.Control as="textarea" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
              </Form.Group>
              <Button onClick={submit}>Validate + Sanitize + Save / Kiểm tra + Làm sạch + Lưu</Button>
              {error ? (
                <Alert variant="danger" className="mt-3 mb-0">
                  {error}
                </Alert>
              ) : null}
            </Col>
            <Col md={7}>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Raw</th>
                    <th>Sanitized</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.author}</td>
                      <td>{renderMode === 'unsafe' ? <span dangerouslySetInnerHTML={{ __html: item.rawContent }} /> : item.rawContent}</td>
                      <td>{item.sanitizedContent}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BlogSecurityPage;
