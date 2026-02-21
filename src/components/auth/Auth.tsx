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
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login} disabled={loading}>
        {loading ? "Lädt..." : "Login"}
      </button>
    </div>
  );
}
