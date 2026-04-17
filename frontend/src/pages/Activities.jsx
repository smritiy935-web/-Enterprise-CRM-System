import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Calendar, StickyNote, User, AlertCircle } from 'lucide-react';

const socket = window.io
  ? window.io("http://localhost:5000")
  : { on: () => {}, emit: () => {}, off: () => {} };

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/activities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(res.data);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();

    socket.emit('join_dashboard');
    socket.on('activity_added', (newAct) => {
      setActivities(prev => [newAct, ...prev]);
    });

    return () => socket.off('activity_added');
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'Email': return <Mail size={18} color="#6366f1" />;
      case 'Call': return <Phone size={18} color="#4ade80" />;
      case 'Meeting': return <Calendar size={18} color="#f59e0b" />;
      default: return <StickyNote size={18} color="#94a3b8" />;
    }
  };

  const filteredActivities = activities.filter(act => {
    const matchesFilter = filter === 'All' || act.type === filter;
    const searchStr = `${act.type} ${act.description} ${act.lead?.firstName} ${act.lead?.lastName}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    
    // Date Filtering Logic
    const actDate = new Date(act.createdAt).getTime();
    const start = dateRange.start ? new Date(dateRange.start).setHours(0,0,0,0) : null;
    const end = dateRange.end ? new Date(dateRange.end).setHours(23,59,59,999) : null;
    
    const matchesStartDate = start ? actDate >= start : true;
    const matchesEndDate = end ? actDate <= end : true;

    return matchesFilter && matchesSearch && matchesStartDate && matchesEndDate;
  });

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>Analyzing Timeline...</div>;

  return (
    <div className="activities-container animate-fade" style={{ padding: '10px' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Activity Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Real-time audit and historical intelligence tracking</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '10px', background: 'var(--bg-tertiary)', padding: '5px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            {['All', 'Call', 'Email', 'Meeting'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filter === type ? 'var(--accent-primary)' : 'transparent',
                  color: filter === type ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {type}{type !== 'All' ? 's' : ''}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>FROM</span>
                <input 
                  type="date" 
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', outline: 'none' }} 
                />
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>TO</span>
                <input 
                  type="date" 
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', outline: 'none' }} 
                />
             </div>
             {(dateRange.start || dateRange.end) && (
               <button 
                 onClick={() => setDateRange({ start: '', end: '' })}
                 style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
               >
                 RESET
               </button>
             )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input 
          type="text"
          placeholder="Search by lead name, company or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '0.95rem',
            outline: 'none focus:border-var(--accent-primary)'
          }}
        />
      </div>

      {filteredActivities.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed var(--border-color)' }}>
           <StickyNote size={48} color="var(--text-secondary)" style={{ opacity: 0.2, marginBottom: '20px' }} />
           <p style={{ color: 'var(--text-secondary)' }}>No matching activities found for this query.</p>
        </div>
      ) : (
        <div className="timeline" style={{ position: 'relative', paddingLeft: '40px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)', opacity: 0.3 }}></div>
          
          {filteredActivities.map((act) => (
            <div key={act._id} className="glass-card" style={{ marginBottom: '24px', padding: '1.75rem', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-36px', 
                top: '25px', 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%', 
                background: 'var(--bg-primary)', 
                border: '3px solid var(--accent-primary)',
                zIndex: 2,
                boxShadow: `0 0 15px ${act.type === 'Call' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`
              }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                    {getIcon(act.type)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>{act.type} interaction</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(act.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={{ padding: '6px 14px', background: 'var(--bg-tertiary)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={14} color="var(--accent-primary)" /> {act.lead ? `${act.lead.firstName} ${act.lead.lastName}` : 'System'}
                </div>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>
                {act.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;
