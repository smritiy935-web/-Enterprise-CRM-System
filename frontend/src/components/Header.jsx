import { Bell, Search, User, LogOut, Settings, Activity, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
// const API_URL = import.meta.env.VITE_API_URL;

import { useSearch } from '../context/SearchContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };

  const notifications = [
    { id: 1, title: 'New target deployed', time: '2m ago' },
    { id: 2, title: 'Strategy sync scheduled', time: '1h ago' },
    { id: 3, title: 'Revenue milestone hit', time: '2h ago' }
  ];

  // Path logic for breadcrumbs
  const path = location.pathname.substring(1).toUpperCase() || 'DASHBOARD';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-card" style={{ 
      position: 'fixed',
      top: 0,
      left: 200,
      width: 'calc(100% - 200px)',
      margin: 0, 
      padding: '0.4rem 1.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      zIndex: 1000,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)', // Deeper blur
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        {/* Advanced Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1.5px' }}>
          <span style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>APEX CRM</span>
          <span style={{ color: 'var(--text-secondary)', opacity: 0.3 }}>/</span>
          <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 10px rgba(99, 102, 241, 0.3)' }}>{path}</span>
        </div>

        {/* Premium Search Bar */}
        <div className="search-container" style={{ position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'rgba(0,0,0,0.2)', 
            padding: '7px 14px', 
            borderRadius: '10px', 
            width: '320px', 
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.02)'
          }}
          className="search-input-wrapper"
          >
            <Search size={14} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search Intelligence Hub..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', marginLeft: '10px', outline: 'none', width: '100%', fontSize: '0.75rem', fontWeight: 500 }}
              onFocus={(e) => e.target.parentElement.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.parentElement.style.borderColor = 'var(--border-color)'}
            />
          </div>
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Industrial Status Pulse */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '5px 12px', 
          borderRadius: '50px', 
          background: 'rgba(16, 185, 129, 0.05)', 
          border: '1px solid rgba(16, 185, 129, 0.15)',
          position: 'relative'
        }}>
           <div className="status-dot-pulse" style={{ 
             width: '6px', 
             height: '6px', 
             background: '#10b981', 
             borderRadius: '50%',
             boxShadow: '0 0 8px #10b981',
             position: 'relative'
           }}>
             <div style={{
               position: 'absolute',
               top: 0,
               left: 0,
               width: '100%',
               height: '100%',
               background: '#10b981',
               borderRadius: '50%',
               animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
               opacity: 0.75
             }}></div>
           </div>
           <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#10b981', letterSpacing: '1px' }}>SYSTEM ONLINE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button onClick={toggleTheme} className="hover-trigger" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '8px', transition: 'background 0.2s' }}>
            {theme === 'dark' ? <Sun size={17} color="#fbbf24" fill="#fbbf24" /> : <Moon size={17} color="#000" fill="#fbbf24" strokeWidth={1} />}
          </button>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '5px' }}
            >
              <Bell size={17} color="var(--text-secondary)" />
              <span style={{ 
                position: 'absolute', 
                top: '4px', 
                right: '4px', 
                background: '#10b981', 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                border: '2px solid var(--bg-primary)',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
              }}
              className="notification-pulse"
              ></span>
            </button>

            {showNotifications && (
              <div className="glass-card animate-fade" style={{ position: 'absolute', top: '150%', right: -10, width: '260px', padding: '12px', zIndex: 1000, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <h4 style={{ fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px', color: 'var(--text-primary)' }}>Intelligence Feed</h4>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s', borderBottom: '1px solid var(--border-color)' }} onMouseEnter={(e) => e.currentTarget.style.background='var(--border-color)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '2px 5px', borderRadius: '6px', background: showDropdown ? 'var(--border-color)' : 'transparent' }}
            >
              <div className="hide-mobile md-block" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0] || 'User'}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{user?.role || 'Admin'}</div>
              </div>
              <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                {user?.avatar ? (
                  <img src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL.replace("/api", "")}${user.avatar}`} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
            </div>

            {showDropdown && (
              <div className="glass-card animate-fade" style={{ position: 'absolute', top: '130%', right: 0, width: '180px', padding: '6px', zIndex: 1000, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{user?.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                </div>
                <button 
                  onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                  className="btn"
                  style={{ width: '100%', gap: '8px', padding: '8px', background: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', justifyContent: 'flex-start' }}
                >
                  <Settings size={14} /> Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="btn"
                  style={{ width: '100%', gap: '8px', padding: '8px', background: 'none', color: '#ef4444', fontSize: '0.75rem', justifyContent: 'flex-start' }}
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
