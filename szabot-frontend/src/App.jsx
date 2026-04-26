import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000/api';

// --- ADMIN COMPONENT ---
const AdminDashboard = ({ token, logout, username }) => {
  const [view, setView] = useState('stats');
  const [stats, setStats] = useState({ users: 0, docs: 0, sessions: 0 });
  const [documents, setDocuments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (view === 'stats') fetchStats();
    if (view === 'upload') fetchDocs();
    if (view === 'logs') fetchLogs();
  }, [view]);

  const fetchStats = async () => {
    try { const res = await axios.get(`${API}/admin/stats`, { headers: { Authorization: token } }); setStats(res.data); } catch (e) {
      /* empty */
     }
  };
  const fetchDocs = async () => {
    try { const res = await axios.get(`${API}/admin/documents`, { headers: { Authorization: token } }); setDocuments(res.data); } catch (e) { /* empty */ }
  };
  const fetchLogs = async () => {
    try { const res = await axios.get(`${API}/admin/logs`, { headers: { Authorization: token } }); setLogs(res.data); } catch (e) { /* empty */ }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${API}/admin/upload`, formData, { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } });
      alert("Success! File is now searchable."); setFile(null); fetchDocs();
    } catch (e) { alert("Upload Failed"); }
    setUploading(false);
  };

  const deleteDoc = async (id) => {
    if (window.confirm("Delete this file?")) {
      await axios.delete(`${API}/admin/documents/${id}`, { headers: { Authorization: token } });
      fetchDocs();
    }
  };

  return (
    <div className="layout">
      {isSidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="brand">SZABOT Admin</div>
        <div className={`nav-item ${view === 'stats' ? 'active' : ''}`} onClick={() => { setView('stats'); setIsSidebarOpen(false); }}>📊 Dashboard</div>
        <div className={`nav-item ${view === 'upload' ? 'active' : ''}`} onClick={() => { setView('upload'); setIsSidebarOpen(false); }}>📂 Uploads</div>
        <div className={`nav-item ${view === 'logs' ? 'active' : ''}`} onClick={() => { setView('logs'); setIsSidebarOpen(false); }}>💬 Chat Logs</div>
        <div style={{ flex: 1 }}></div>
        <div className="user-info">Admin: {username}</div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      <div className="main-content">
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <span style={{ fontWeight: 'bold' }}>Admin Panel</span>
        </div>

        <div className="dashboard-panel">
          {view === 'stats' && (
            <div className="stats-grid">
              <div className="stat-card"><span className="stat-num">{stats.users}</span><span className="stat-label">Users</span></div>
              <div className="stat-card"><span className="stat-num">{stats.docs}</span><span className="stat-label">Files Uploaded</span></div>
              <div className="stat-card"><span className="stat-num">{stats.sessions}</span><span className="stat-label">Chat Sessions</span></div>
            </div>
          )}

          {view === 'upload' && (
            <div className="upload-card">
              <h3>Upload Timetable (PDF/Excel)</h3>
              <form onSubmit={handleUpload} style={{ marginTop: 15, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input type="file" onChange={e => setFile(e.target.files[0])} accept=".pdf,.xlsx,.xls" required />
                <button type="submit" disabled={uploading} style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 4, cursor: 'pointer' }}>
                  {uploading ? "Parsing..." : "Upload"}
                </button>
              </form>
              <div style={{ marginTop: 20 }}>
                {documents.map(doc => (
                  <div key={doc._id} className="file-item">
                    <span>📄 {doc.filename}</span>
                    <button onClick={() => deleteDoc(doc._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'logs' && (
            <div className="log-container">
              <h3>Recent Student Chats</h3>
              {logs.map(log => (
                <div key={log.id} style={{ marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                  <div className="log-header">User: {log.username} | {log.title}</div>
                  <div style={{ maxHeight: 100, overflowY: 'auto', background: '#f9f9f9', padding: 10, borderRadius: 4 }}>
                    {log.messages.map((m, i) => (
                      <div key={i} className="log-text"><strong>{m.sender === 'user' ? 'U' : 'AI'}:</strong> {m.text}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [password, setPassword] = useState('');

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // FIXED: Start with empty array, greeting added dynamically
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(r => r, e => { if (e.response?.status === 401) logout(); return Promise.reject(e); });
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => { if (token && role === 'student') fetchSessions(); }, [token]);

  // Load messages when session ID changes
  useEffect(() => {
    if (token && currentSessionId) {
      fetchMessages(currentSessionId);
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
    }
  }, [currentSessionId]);

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setToken(res.data.token);
      setRole(res.data.role);
      setUsername(res.data.username);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
    } catch (e) { alert("Login Failed"); }
  };

  const logout = () => {
    setToken(null); localStorage.clear(); setSessions([]); setMessages([]); setCurrentSessionId(null);
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API}/sessions`, { headers: { Authorization: token } });
      setSessions(res.data);
      // Auto-select most recent or create new
      if (res.data.length > 0) {
        if (!currentSessionId) setCurrentSessionId(res.data[0]._id);
      } else {
        createNewSession();
      }
    } catch (e) {
        alert("Error fetching sessions");
     }
  };

  const createNewSession = async () => {
    try {
      const res = await axios.post(`${API}/sessions`, {}, { headers: { Authorization: token } });
      setSessions([res.data, ...sessions]);
      setCurrentSessionId(res.data._id);

      // IMPORTANT: Set messages to empty array, do NOT add the greeting here.
      setMessages([]);

      if (window.innerWidth <= 768) setIsSidebarOpen(false);
    } catch (e) { alert("Error creating chat"); }
  };


  const deleteSession = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete?")) return;
    await axios.delete(`${API}/sessions/${id}`, { headers: { Authorization: token } });
    const rem = sessions.filter(s => s._id !== id);
    setSessions(rem);
    if (currentSessionId === id) {
      if (rem.length > 0) setCurrentSessionId(rem[0]._id);
      else createNewSession();
    }
  };

  // FIXED: Greeting Logic Here
  const fetchMessages = async (id) => {
    try {
      const res = await axios.get(`${API}/history/${id}`, { headers: { Authorization: token } });

      if (res.data.length === 0) {
        setMessages([]); // Keep it empty for new chats!
      } else {
        setMessages(res.data);
      }
    } catch (e) { console.error("Error history"); }
  };
  const sendMessage = async () => {
    if (!input.trim() || !currentSessionId) return;
    const txt = input; setInput('');

    // Add user message to UI immediately
    setMessages(prev => [...prev, { sender: 'user', text: txt }]);

    try {
      const res = await axios.post(`${API}/chat`, { message: txt, sessionId: currentSessionId }, { headers: { Authorization: token } });

      // Add bot response
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);

      // Refresh session list (to update title if needed)
      if (messages.length < 2) fetchSessions();
    } catch (e) { setMessages(prev => [...prev, { sender: 'bot', text: "Error connecting to server." }]); }
  };

  const renderLinks = (text) => {
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g);
      return (
        <span key={lineIdx}>
          {parts.map((part, i) => {
            if (part.match(/^\*\*[^*]+\*\*$/)) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            } else if (part.match(/^https?:\/\//)) {
              return <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
            }
            return part;
          })}
          {lineIdx < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  if (!token) return (
    <div className="login-bg">
      <div className="login-box">
        <h2>SZABOT Login</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
        <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>Student: student/123456 <br /> Admin: admin/admin123</div>
      </div>
    </div>
  );

  if (role === 'admin') return <AdminDashboard token={token} logout={logout} username={username} />;

  return (
    <div className="layout">
      {isSidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setIsSidebarOpen(false)}></div>}

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="brand">SZABOT</div>
        <button className="new-chat-btn" onClick={createNewSession}><span>+</span> New Chat</button>
        <div className="session-list">
          {sessions.map(s => (
            <div key={s._id} className={`session-item ${currentSessionId === s._id ? 'active' : ''}`} onClick={() => { setCurrentSessionId(s._id); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 10 }}>{s.title}</span>
              <button className="delete-btn" onClick={(e) => deleteSession(e, s._id)}>🗑️</button>
            </div>
          ))}
        </div>
        <div className="user-info">{username}</div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="main-content">
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <span style={{ fontWeight: 'bold' }}>SZABOT</span>
        </div>
        <div className="chat-wrapper">
          <div className="chat-box">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender}`}>
                <div className="bubble">{renderLinks(m.text)}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="input-row">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Ask about Class, Exams, or Faculty..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;