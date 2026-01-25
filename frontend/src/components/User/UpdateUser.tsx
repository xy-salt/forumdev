import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import "./auth-forms.css";
import "../Post/post-topic.css";
import "../utils/buttons.css";

interface UpdateUserProp {
    onClose: () => void
}

const UpdateUser: React.FC<UpdateUserProp> = ({ onClose }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const { user_id } = useParams<{ user_id: string }>();
    const { token } = useAuth();

    const handleSubmit = async () => {
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

            navigate(`/users/${user_id}`);
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to register");
            setPassword("");
        }
    };

    const handleUpdateClick = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    return (
        <div className="form-section">
            <h3 className="form-section-title">Update Your Account</h3>
            <form className="auth-form" onSubmit={handleUpdateClick}>
                <div className="form-group">
                    <label htmlFor="username">New Username (optional)</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Leave blank to keep current username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password (optional)</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                    />
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    <button className="action-button success" type="submit">
                        Update Account
                    </button>
                    <button className="action-button secondary" type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
            
            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Update</h3>
                        <p>Are you sure you want to update your account?</p>
                        <div className="modal-actions">
                            <button className="action-button success" onClick={() => { handleSubmit(); setShowConfirm(false); }}>
                                Update
                            </button>
                            <button className="action-button secondary" onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const UpdateUserButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button className="action-button secondary" onClick={() => setShow(true)}>
                Update Account
            </button>

            {show && (
                <div className="modal-overlay show" onClick={() => setShow(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShow(false)}>×</button>
                        <UpdateUser onClose={() => setShow(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdateUserButton;