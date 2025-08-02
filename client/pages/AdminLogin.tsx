import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../src/assets/Logo.png';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.role === "house") {
        localStorage.setItem("role", "house");
        navigate("/admin");
      } else {
        setError("Unauthorized user");
      }
    } catch (err) {
      setError(`Login failed: ${err}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6 text-black">Welcome</h1>

        {/* Avatar Placeholder */}
        <div className="mx-auto mb-6 w-24 h-24 rounded overflow-hidden">
          <img
            src={logo}
            alt="App Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username Input */}
        <input
          className="w-full border-b border-gray-400 focus:outline-none focus:border-primary py-2 mb-6 text-sm text-gray-400"
          type="text"
          placeholder="UserName"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Placeholder Password Field */}
        <input
          className="w-full border-b border-gray-400 focus:outline-none focus:border-primary py-2 mb-6 text-sm text-gray-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-full text-white font-semibold bg-green-600 hover:bg-green-700 transition"
        >
          LOGIN
        </button>

        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;