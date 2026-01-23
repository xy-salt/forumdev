import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default Register;