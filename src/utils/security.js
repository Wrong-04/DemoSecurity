// Shared by: `AuthPage.jsx`, `ProfileSecurityPage.jsx`, `BlogSecurityPage.jsx`.
// Dung chung cho: `AuthPage.jsx`, `ProfileSecurityPage.jsx`, `BlogSecurityPage.jsx`.
export const API_BASE = 'http://localhost:9999';

export const DEFAULT_XSS_PAYLOAD = '<img src=x onerror="alert(`XSS`)"><b>Hello</b>';

export function escapeHtml(raw) {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
