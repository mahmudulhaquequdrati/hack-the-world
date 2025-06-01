import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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

    const result = await login(credentials);

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
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
                  placeholder="admin@hack-the-world.com"
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
              Email: admin@hack-the-world.com
            </p>
            <p className="text-xs text-gray-400">Password: admin123</p>
            <p className="text-xs text-yellow-400 mt-2">
              Note: Run 'pnpm seed:admin' in server directory to create admin
              user
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
