import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TeamChat from './components/TeamChat';
import Dashboard from './pages/Dashboard';
import LeadsHub from './pages/LeadsHub';
import Activities from './pages/Activities';
import Login from './pages/Login';
import Register from './pages/Register';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Meeting from './pages/Meeting';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {user && <Sidebar />}
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {user && <Header />}
        <main style={{ padding: '2rem', flex: 1 }}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/leads" element={<PrivateRoute><LeadsHub /></PrivateRoute>} />
            <Route path="/activities" element={<PrivateRoute><Activities /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/meetings" element={<PrivateRoute><Meeting /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
      {user && <TeamChat />}
    </div>
  );
}

import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
