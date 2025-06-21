import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Login attempt with:", { email: credentials.email });

    try {
      const result = await login(credentials);
      console.log("Login result:", result);

      if (result && result.success) {
        console.log("Login successful, navigating to dashboard");
        // Navigate to dashboard on successful login
        navigate("/dashboard");
      } else {
        console.log("Login failed:", result?.error);
        // Ensure error is always a string for React rendering
        const errorMessage = typeof result?.error === 'string' ? result.error : "Login failed";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Login error caught:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="terminal-window">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyber-green mb-2">
              [ADMIN PORTAL]
            </h1>
            <p className="text-green-400">
              Hack The World - Administrative Access
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-green-400 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field w-full"
                  placeholder="admin@hacktheworld.dev"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-green-400 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field w-full"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "ACCESSING..." : "ACCESS SYSTEM"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-green-400">
                Need admin access?{" "}
                <Link
                  to="/register"
                  className="text-cyber-green hover:text-cyber-green-light underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-800/50 rounded border border-gray-600">
            <p className="text-xs text-green-400 mb-2">
              Default Admin Credentials:
            </p>
            <p className="text-xs text-gray-400">
              Email: admin@hacktheworld.dev
            </p>
            <p className="text-xs text-gray-400">Password: SecureAdmin123!</p>
            <p className="text-xs text-yellow-400 mt-2">
              Note: Run 'npm run seed:users' in server directory to create admin
              user
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
