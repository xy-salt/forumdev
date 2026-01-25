import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth-forms.css";

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                navigate("/login");
            } else {
                const text = await res.text();
                throw new Error(text || "Register failed");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to register");
            setPassword("");
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Join the Forum</h1>
            <p className="auth-subtitle">Create a new account to get started</p>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose a password"
                    />
                </div>
                {error && <p className="form-error">{error}</p>}

                <button className="form-submit" type="submit">
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default Register;