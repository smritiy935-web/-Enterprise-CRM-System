import { useState, useEffect, useCallback } from "react";
import api, { API_URL } from "../utils/api";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Filter,
  Mail,
  Phone,
  Building2,
  Trash2,
  Download,
  Calendar,
  X
} from "lucide-react";

// --- Socket Sync ---
const socket = window.io
  ? window.io(API_URL)
  : { on: () => {}, emit: () => {}, off: () => {} };

// --- Theme Config ---
const STATUS_COLORS = {
  "New": { bg: "#e0e7ff", color: "#3730a3" },
  "Contacted": { bg: "#ede9fe", color: "#5b21b6" },
  "Qualified": { bg: "#fef3c7", color: "#92400e" },
  "Proposal": { bg: "#fef9c3", color: "#854d0e" },
  "Negotiation": { bg: "#ede9fe", color: "#4c1d95" },
  "Closed Won": { bg: "#d1fae5", color: "#065f46" },
  "Closed Lost": { bg: "#fee2e2", color: "#7f1d1d" }
};

// --- Components ---
const Toast = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, padding: "10px 18px", borderRadius: 8,
      fontSize: 13, fontWeight: 500, zIndex: 99999,
      background: type === "error" ? "#fee2e2" : "#d1fae5",
      color: type === "error" ? "#7f1d1d" : "#065f46",
      border: `1px solid ${type === "error" ? "#fca5a5" : "#6ee7b7"}`,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      animation: 'fadeIn 0.3s'
    }}>
      {message}
    </div>
  );
};

import { useSearch } from "../context/SearchContext";

export default function LeadsHub() {
  const location = useLocation();
  const { searchTerm } = useSearch();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const filteredLeads = leads.filter(l => {
    const term = searchTerm.toLowerCase();
    return (
      l.firstName?.toLowerCase().includes(term) ||
      l.lastName?.toLowerCase().includes(term) ||
      l.company?.toLowerCase().includes(term) ||
      l.email?.toLowerCase().includes(term)
    );
  });

  const [showModal, setShowModal] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [toast, setToast] = useState(null);
  const [msgText, setMsgText] = useState("");

  const showToast = (message, type = "success") => setToast({ message, type });

  // --- Real Backend Synchronization ---
  const fetchLeads = useCallback(async () => {
    try {
      const res = await api.get("/api/leads");
      setLeads(res.data || []);
    } catch (err) { setLeads([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchLeads();
    socket.on("lead_added", fetchLeads);
    socket.on("lead_updated", fetchLeads);
    return () => socket.off();
  }, [fetchLeads]);

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    let interval;
    if (activeCall) {
      interval = setInterval(() => setCallTimer((p) => p + 1), 1000);
    } else { setCallTimer(0); }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleCreateLead = async (e) => {
    e.preventDefault();
    const leadData = {
      firstName: e.target.nFirst.value,
      lastName: e.target.nLast.value,
      email: e.target.nEmail.value,
      company: e.target.nCompany.value,
      status: e.target.nStatus.value,
      value: Number(e.target.nValue.value) || 0,
      aiScore: Math.floor(Math.random() * 60) + 30
    };

    try {
      await api.post("/api/leads", leadData);
      setShowModal(false);
      showToast(`Lead "${leadData.firstName}" deployed.`);
      fetchLeads();
    } catch (err) { showToast("Sync Error", "error"); }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Terminate this lead?")) return;
    try {
      await api.delete(`/api/leads/${id}`);
      showToast("Target removed.");
      fetchLeads();
    } catch (err) { showToast("Delete failed", "error"); }
  };

  const handleLogActivity = async (leadId, type, description) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/activities", {
        leadId, type, description, status: "Completed"
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) { }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    handleLogActivity(activeMessage._id, "Email", `Intelligence Brief: ${msgText.substring(0, 30)}...`);
    showToast(`Email dispatched to ${activeMessage.firstName}`);
    setActiveMessage(null);
    setMsgText("");
  };

  const handleEndCall = () => {
    handleLogActivity(activeCall._id, "Call", `Outbound: ${Math.floor(callTimer / 60)}m Session`);
    showToast(`Session ended with ${activeCall.firstName}`);
    setActiveCall(null);
  };

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Company", "Status", "Value"];
    const rows = leads.map(l => [l.firstName, l.lastName, l.email, l.company, l.status, l.value]);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = encodeURI(csv); a.download = "leads_audit.csv"; a.click();
  };

  const pad = (n) => String(n).padStart(2, "0");
  const initials = (f, l) => `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();
  const getStatusStyle = (status) => STATUS_COLORS[status] || { bg: "#f3f4f6", color: "#374151" };

  if (loading) return <div style={{ color: 'white', padding: '15px' }}>Accessing Vault...</div>;

  return (
    <div className="animate-fade" style={{ padding: "0 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 4 }}>Leads Intelligence</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Manage and track your industrial sales pipeline</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" style={{ fontSize: '0.7rem', padding: '6px 12px' }} onClick={exportToCSV}><Download size={14} /> EXPORT</button>
          <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '7px 14px' }} onClick={() => setShowModal(true)}><Plus size={14} /> NEW LEAD</button>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.01)", borderRadius: 16, border: "1px dashed var(--border-color)" }}>
          <div style={{ width: 64, height: 64, margin: "0 auto 1rem", background: "rgba(99,102,241,0.1)", color: "#6366f1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 size={32} />
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>No Leads in Pipeline</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>Your intelligence repository is empty. Add a lead manually or run the seed script to populate.</p>
          <button className="btn btn-primary" style={{ padding: "10px 20px" }} onClick={() => setShowModal(true)}>
            <Plus size={16} /> FIRST LEAD DEPLOYMENT
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filteredLeads.map((lead) => {
            const sc = getStatusStyle(lead.status);
            return (
              <div key={lead._id} className="glass-card" style={{ padding: "1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 900, background: sc.bg, color: sc.color }}>{lead.status.toUpperCase()}</span>
                  <span style={{ fontSize: 11, fontWeight: 900, color: lead.aiScore > 70 ? "#059669" : "#d97706" }}>AI {lead.aiScore}%</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.8rem" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(99,102,241,0.1)", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>
                    {initials(lead.firstName, lead.lastName)}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "0.9rem" }}>{lead.firstName} {lead.lastName}</h3>
                    <p style={{ color: "var(--accent-primary)", fontWeight: 900, fontSize: "0.95rem" }}>${lead.value?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Building2 size={13} /> {lead.company}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={13} /> {lead.email}</div>
                </div>

                <div style={{ display: "flex", gap: 6, marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid var(--border-color)" }}>
                  <button className="btn" style={{ padding: "6px", background: "rgba(99,102,241,0.05)", color: "#6366f1", border: "none" }} onClick={() => setActiveCall(lead)}><Phone size={14} /></button>
                  <button className="btn" style={{ padding: "6px", background: "rgba(16,185,129,0.05)", color: "#10b981", border: "none" }} onClick={() => setActiveMessage(lead)}><Mail size={14} /></button>
                  <button className="btn" style={{ padding: "6px", background: "rgba(239,68,68,0.05)", color: "#ef4444", border: "none", marginLeft: "auto" }} onClick={() => handleDeleteLead(lead._id)}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Call Modal ── */}
      {activeCall && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 15, 28, 0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, backdropFilter: "blur(10px)" }}>
          <div className="glass-card animate-fade" style={{ width: 280, padding: "2rem 1.5rem", textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(99,102,241,0.1)", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 900, margin: "0 auto 1rem" }}>{initials(activeCall.firstName, activeCall.lastName)}</div>
            <h4 style={{ marginBottom: 4 }}>{activeCall.firstName} {activeCall.lastName}</h4>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#6366f1", margin: "1rem 0" }}>{pad(Math.floor(callTimer / 60))}:{pad(callTimer % 60)}</div>
            <button className="btn" style={{ width: "100%", justifyContent: "center", background: "#ef4444", color: "white" }} onClick={handleEndCall}>TERMINATE</button>
          </div>
        </div>
      )}

      {/* ── Email Modal ── */}
      {activeMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 15, 28, 0.98)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, backdropFilter: "blur(10px)" }}>
          <form className="glass-card animate-fade" style={{ width: 450, padding: "1.5rem" }} onSubmit={handleSendMessage}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11 }}>{initials(activeMessage.firstName, activeMessage.lastName)}</div>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>{activeMessage.firstName} {activeMessage.lastName}</div><div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{activeMessage.email}</div></div>
            </div>
            <textarea autoFocus required value={msgText} onChange={(e) => setMsgText(e.target.value)} placeholder="Type intelligence brief..." style={{ width: "100%", height: 120, background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 8, padding: 12, color: "inherit", fontSize: 13, resize: "none", outline: "none", marginBottom: "1rem" }} />
            <div style={{ display: "flex", gap: 10 }}><button type="button" className="btn" style={{ flex: 1 }} onClick={() => setActiveMessage(null)}>Abort</button><button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: "center" }}>Dispatch</button></div>
          </form>
        </div>
      )}

      {/* ── New Lead Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 15, 28, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10001, backdropFilter: "blur(8px)" }}>
          <form className="glass-card animate-fade" style={{ width: 420, padding: "2rem", background: "var(--bg-secondary)", border: "1px solid var(--accent-primary)", boxShadow: "0 0 40px rgba(99,102,241,0.2)" }} onSubmit={handleCreateLead}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Deploy Intelligence</h2>
               <X size={20} cursor="pointer" onClick={() => setShowModal(false)} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
               <div className="input-group">
                 <label style={{fontSize:'11px', fontWeight: 700, color: 'var(--text-secondary)'}}>FIRST NAME *</label>
                 <input type="text" name="nFirst" required style={{fontSize:'13px', padding:'10px', background: 'rgba(0,0,0,0.2)'}}/>
               </div>
               <div className="input-group">
                 <label style={{fontSize:'11px', fontWeight: 700, color: 'var(--text-secondary)'}}>LAST NAME *</label>
                 <input type="text" name="nLast" required style={{fontSize:'13px', padding:'10px', background: 'rgba(0,0,0,0.2)'}}/>
               </div>
            </div>

            <div className="input-group" style={{marginTop: '15px'}}>
              <label style={{fontSize:'11px', fontWeight: 700, color: 'var(--text-secondary)'}}>SECURE EMAIL *</label>
              <input type="email" name="nEmail" required style={{fontSize:'13px', padding:'10px', background: 'rgba(0,0,0,0.2)'}}/>
            </div>

            <div className="input-group" style={{marginTop: '15px'}}>
              <label style={{fontSize:'11px', fontWeight: 700, color: 'var(--text-secondary)'}}>ENTITY (COMPANY)</label>
              <input type="text" name="nCompany" style={{fontSize:'13px', padding:'10px', background: 'rgba(0,0,0,0.2)'}}/>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 15, marginTop: '15px' }}>
               <div className="input-group">
                 <label style={{fontSize:'11px', fontWeight: 700, color: 'var(--text-secondary)'}}>PIPELINE STATUS</label>
                 <select name="nStatus" style={{fontSize:'13px', padding:'10px', background: 'rgba(0,0,0,0.2)'}}>
                   {Object.keys(STATUS_COLORS).map(s=><option key={s}>{s}</option>)}
                 </select>
               </div>
               <div className="input-group">
                 <label style={{fontSize:'11px', fontWeight: 700, color: 'var(--text-secondary)'}}>VALUE ($)</label>
                 <input type="number" name="nValue" style={{fontSize:'13px', padding:'10px', background: 'rgba(0,0,0,0.2)'}}/>
               </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: "2rem" }}>
              <button type="button" className="btn" style={{ flex: 1, padding: '12px' }} onClick={() => setShowModal(false)}>ABORT</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: "center", padding: '12px' }}>SYNC TARGET</button>
            </div>
          </form>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
