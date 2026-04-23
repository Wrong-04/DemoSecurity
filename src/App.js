// App router: maps demo pages to routes.
// Bo dinh tuyen: anh xa cac trang demo vao route.
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import AuthPage from './components/AuthPage';
import BlogSecurityPage from './components/BlogSecurityPage';
import HomePage from './components/HomePage';
import ProfileSecurityPage from './components/ProfileSecurityPage';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfileSecurityPage />} />
        <Route path="/blog" element={<BlogSecurityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
