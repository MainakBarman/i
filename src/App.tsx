import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout, Home, Travel, Journal, Events, Gallery, Subscribe, PostDetail } from './components/PublicPages';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/travel" element={<MainLayout><Travel /></MainLayout>} />
        <Route path="/journal" element={<MainLayout><Journal /></MainLayout>} />
        <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
        <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
        <Route path="/subscribe" element={<MainLayout><Subscribe /></MainLayout>} />
        <Route path="/post/:id" element={<MainLayout><PostDetail /></MainLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
