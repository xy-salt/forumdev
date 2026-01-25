import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import "./auth-forms.css";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Login failed");
            } else {
                const data = await res.json();
                login(data.token);
                navigate("/");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to login");
            setPassword("");
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your forum account</p>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div className="form-group">
                     <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    /> 
                </div>

                {error && <p className="form-error">{error}</p>}

                <button className="form-submit" type="submit">
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;