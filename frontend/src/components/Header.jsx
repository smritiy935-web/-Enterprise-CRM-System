import { Bell, Search, User, LogOut, Settings, Activity } from 'lucide-react';
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
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
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
            style={{ background: 'transparent', border: 'none', color: 'white', marginLeft: '8px', outline: 'none', width: '100%', fontSize: '0.75rem' }}
          />
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
           <Activity size={12} color="#10b981" />
           <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.5px' }}>SYNC ACTIVE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex' }}>
            <Bell size={16} color="var(--text-secondary)" />
            <span style={{ position: 'absolute', top: '-1px', right: '-1px', background: 'var(--accent-primary)', width: '6px', height: '6px', borderRadius: '50%' }}></span>
          </button>

          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '2px 5px', borderRadius: '6px', background: showDropdown ? 'rgba(255,255,255,0.05)' : 'transparent' }}
            >
              <div className="hide-mobile md-block" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{user?.name?.split(' ')[0] || 'User'}</div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{user?.role || 'REP'}</div>
              </div>
              <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
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
                  <LogOut size={14} /> End Session
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
