import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { User, Lock, Bell, Trash2, Save, AlertTriangle, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      animation: 'fadeIn 0.3s'
    }}>
      {message}
    </div>
  );
};

// --- Helper for Strength ---
const strengthInfo = (val) => {
  if (!val) return null;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^a-zA-Z0-9]/.test(val)) score++;
  const levels = [
    { label: "Weak", color: "#ef4444", width: "25%" },
    { label: "Fair", color: "#f97316", width: "50%" },
    { label: "Good", color: "#eab308", width: "75%" },
    { label: "Strong", color: "#22c55e", width: "100%" },
  ];
  return levels[score - 1] || levels[0];
};

export default function Settings() {
  const { user, updateProfile, logout, updateAvatarState } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Member",
    phone: user?.phone || "+1 (555) 000-0000",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifs, setNotifs] = useState({
    newLeads: true,
    dealStatus: true,
    weeklyReport: false,
    aiScore: true,
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const initials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return showToast("File too large. Max 5MB.", "error");

    const form = new FormData();
    form.append('avatar', file);

    try {
      const res = await api.post('/api/auth/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateAvatarState(res.data.avatar);
      showToast("Profile identity updated successfully!");
    } catch (err) {
      showToast("Secure upload failed.", "error");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(formData);
      showToast("System profile updated.");
    } catch (err) {
      showToast("Update failed.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return showToast("Passwords do not match!", "error");
    if (passwordData.newPassword.length < 6) return showToast("Min 6 characters required.", "error");

    setChangingPass(true);
    try {
      await api.put('/api/auth/change-password', 
        { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword }
      );
      showToast("Security credentials updated.");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Password update error", "error");
    } finally {
      setChangingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/api/auth/delete-account');
      logout();
      navigate('/login');
    } catch (err) {
      showToast("Account termination failed.", "error");
    }
  };

  const strength = strengthInfo(passwordData.newPassword);

  const cardStyle = {
    background: "var(--bg-secondary, #1e293b)",
    border: "1px solid var(--border-color, #334155)",
    borderRadius: 12, padding: "1.5rem", marginBottom: 20,
  };

  const inputStyle = {
    width: "100%", background: "var(--bg-primary, #0f172a)",
    border: "1px solid var(--border-color, #334155)", borderRadius: 8,
    padding: "8px 12px", color: "inherit", fontSize: 13, outline: "none",
  };

  const labelStyle = { fontSize: 11, fontWeight: 700, color: "var(--text-secondary, #94a3b8)", marginBottom: 4, display: "block", textTransform: 'uppercase' };

  return (
    <div className="animate-fade" style={{ padding: "0 10px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 4 }}>System Settings</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Advanced Environment Configuration & Security Hub</p>
      </div>

      {/* ── Profile ── */}
      <form onSubmit={handleSaveProfile}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <User size={16} color="#6366f1" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>PROFILE INTELLIGENCE</span>
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingProfile} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
              <Save size={14} /> {savingProfile ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: 10, padding: 15, marginBottom: "1.5rem" }}>
            <div style={{ width: 70, height: 70, borderRadius: 10, border: "2px solid #6366f1", overflow: "hidden", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700, color: "#6366f1", cursor: "pointer" }} onClick={() => avatarInputRef.current.click()}>
              {user?.avatar ? <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials(user?.name)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>Profile Photo</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 8 }}>JPG, PNG or WebP — Max 5MB</div>
              <button type="button" className="btn" style={{ fontSize: 11, padding: "4px 10px", gap: 5 }} onClick={() => avatarInputRef.current.click()}>
                <Upload size={12} /> Sync Photo
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15 }}>
            <div><label style={labelStyle}>Full Name</label><input type="text" style={inputStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><label style={labelStyle}>Email Address</label><input type="email" style={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div><label style={labelStyle}>Role / Title</label><input type="text" style={inputStyle} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} /></div>
            <div><label style={labelStyle}>Secure Phone</label><input type="text" style={inputStyle} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
          </div>
        </div>
      </form>

      {/* ── Security ── */}
      <form onSubmit={handlePasswordChange}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={16} color="#fbbf24" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>SECURITY PROTOCOLS</span>
            </div>
            <button type="submit" className="btn" disabled={changingPass} style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'var(--bg-tertiary)' }}>
              {changingPass ? "UPDATING..." : "UPDATE CREDENTIALS"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 15 }}>
            <div><label style={labelStyle}>Current Password</label><input type="password" style={inputStyle} placeholder="••••••••" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} /></div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input type="password" style={inputStyle} placeholder="••••••••" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
              {strength && <div style={{ marginTop: 6 }}><div style={{ height: 2, borderRadius: 1, background: strength.color, width: strength.width, transition: "width 0.3s" }} /><span style={{ fontSize: 10, color: strength.color, marginTop: 4, display: "block" }}>STRENGTH: {strength.label.toUpperCase()}</span></div>}
            </div>
            <div><label style={labelStyle}>Confirm Change</label><input type="password" style={inputStyle} placeholder="••••••••" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} /></div>
          </div>
        </div>
      </form>

      {/* ── Notifications ── */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
          <Bell size={16} color="#10b981" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>NOTIFICATION</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[{ key: "newLeads", label: "Real-time Lead Ingestion Alerts" }, { key: "dealStatus", label: "Pipeline Status Sync Notifications" }, { key: "weeklyReport", label: "Industrial Performance Audit" }].map(({ key, label }) => (
            <label key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: 13 }}>
              <span>{label}</span>
              <input type="checkbox" checked={notifs[key]} onChange={() => setNotifs({ ...notifs, [key]: !notifs[key] })} style={{ width: 14, height: 14, cursor: "pointer" }} />
            </label>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop: "1.25rem", fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => showToast("Preferences Synchronized!")}>Save Cluster Settings</button>
      </div>

      {/* ── Danger ── */}
      <div style={{ ...cardStyle, borderColor: "rgba(239, 68, 68, 0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
          <Trash2 size={16} color="#ef4444" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: "#ef4444" }}>DANGER ZONE</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 15 }}>
          <div style={{ maxWidth: 450 }}>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 5 }}>Terminate Master Account</p>
            <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Warning: This action is permanent. All industrial intelligence and records will be purged.</p>
          </div>
          <button className="btn" style={{ background: "rgba(239,68,68,0.05)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", fontSize: '0.75rem' }} onClick={() => setShowDeleteConfirm(true)}>Deactivate Account</button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(5px)" }}>
          <div className="glass-card animate-fade" style={{ width: 350, padding: "2rem", textAlign: "center" }}>
            <AlertTriangle size={40} color="#ef4444" style={{ marginBottom: 15 }} />
            <h2 style={{ fontSize: '1.2rem', marginBottom: 8 }}>Absolute Confirmation?</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: "2rem" }}>Records cannot be recovered after termination.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(false)}>Abort</button>
              <button className="btn" style={{ flex: 1, background: "#ef4444", color: "white" }} onClick={handleDeleteAccount}>Confirm Deletion</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
