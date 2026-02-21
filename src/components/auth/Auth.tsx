import React, { useState } from "react";

export default function Auth() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    // Dummy login logik
    setTimeout(() => {
      if (email && password) setUser({ email });
      setLoading(false);
    }, 1000);
  };

  const logout = () => setUser(null);

  if (user) {
    return (
      <div>
        <p>Willkommen, {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 320, margin: 'auto', padding: 20, border: '1px solid #ccc', borderRadius: 6 }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <button onClick={login} disabled={loading} style={{ padding: 10, width: '100%', borderRadius: 4, backgroundColor: '#0070f3', color: 'white', border: 'none' }}>
        {loading ? "Lädt..." : "Login"}
      </button>
    </div>
  );
}
