import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { Calendar, Link as LinkIcon, Users, ArrowLeft } from 'lucide-react';

export default function Meeting() {
  const location = useLocation();
  const navigate = useNavigate();
  const preFilledLead = location.state?.lead;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [link, setLink] = useState('https://meet.google.com/xyz-abcd-123');
  const [toast, setToast] = useState(null);
  
  const handleSchedule = async (e) => {
    e.preventDefault();
    if (preFilledLead) {
      try {
        const formattedDate = new Date(`${date}T${time}`).toLocaleString();
        await api.post("/activities", {
          leadId: preFilledLead._id, 
          type: "Meeting", 
          description: `Strategy Sync: ${topic} \nLink: ${link} \nTime: ${formattedDate}`, 
          status: "Completed"
        });
        setToast("Meeting officially booked!");
        setTimeout(() => navigate(-1), 2000);
      } catch (err) {}
    } else {
      setToast("Meeting officially scheduled! (No lead attached)");
      setTimeout(() => navigate(-1), 2000);
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn" style={{ background: 'var(--bg-tertiary)', padding: '8px' }}>
           <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Schedule Meeting</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Lock in a strategy session</p>
        </div>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <form className="glass-card" style={{ padding: '2rem' }} onSubmit={handleSchedule}>
          {preFilledLead && (
            <div style={{ padding: '15px', background: 'rgba(99,102,241,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
               <Users size={24} color="var(--accent-primary)" />
               <div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PARTICIPANT</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{preFilledLead.firstName} {preFilledLead.lastName}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{preFilledLead.email}</div>
               </div>
            </div>
          )}

          <div className="input-group">
            <label>MEETING TOPIC</label>
            <input type="text" required placeholder="e.g. Q3 Pipeline Review" value={topic} onChange={e=>setTopic(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>DATE</label>
              <input type="date" required value={date} onChange={e=>setDate(e.target.value)} style={{ colorScheme: 'dark' }} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>TIME</label>
              <input type="time" required value={time} onChange={e=>setTime(e.target.value)} style={{ colorScheme: 'dark' }} />
            </div>
          </div>

          <div className="input-group">
            <label>MEETING LINK</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <LinkIcon size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)' }} />
              <input type="url" required value={link} onChange={e=>setLink(e.target.value)} style={{ paddingLeft: '32px' }} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '12px', background: '#f59e0b' }}>
            <Calendar size={16} /> Confirm Schedule
          </button>
        </form>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, padding: "10px 18px", borderRadius: 8, background: "#d1fae5", color: "#065f46", zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
