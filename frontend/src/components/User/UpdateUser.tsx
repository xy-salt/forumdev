import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface UpdateUserProp {
    onClose: () => void
}

const UpdateUser: React.FC<UpdateUserProp> = ({ onClose }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { user_id } = useParams<{ user_id: string }>();

    const token = localStorage.getItem("token");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Register failed");
            }

            alert("user info updated");
            navigate(`/users/${user_id}`);
            onClose();
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
                    Update Account
                </button>
            </form>
        </div>
    );
}

const UpdateUserButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}>
                Update User
            </button>

            {show && <UpdateUser onClose={() => setShow(false)} />}
        </>
    );
}

export default UpdateUserButton;