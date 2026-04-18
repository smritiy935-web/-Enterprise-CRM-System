import { Bell, Search, User, LogOut, Settings, Activity, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

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
      margin: 0, 
      padding: '0.4rem 1.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>CORE</span>
          <span style={{ opacity: 0.2 }}>/</span>
          <span style={{ color: 'var(--accent-primary)' }}>{path}</span>
        </div>

        <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '6px', width: '280px', border: '1px solid var(--border-color)' }}>
          <Search size={14} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', marginLeft: '8px', outline: 'none', width: '100%', fontSize: '0.75rem' }}
          />
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
           <Activity size={12} color="#10b981" />
           <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.5px' }}>SYNC ACTIVE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {theme === 'dark' ? <Sun size={17} color="var(--text-secondary)" /> : <Moon size={17} color="var(--text-secondary)" />}
          </button>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex' }}
            >
              <Bell size={16} color="var(--text-secondary)" />
              <span style={{ position: 'absolute', top: '-1px', right: '-1px', background: 'var(--accent-primary)', width: '6px', height: '6px', borderRadius: '50%' }}></span>
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
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{user?.role || 'REP'}</div>
              </div>
              <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
