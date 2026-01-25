import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import "./user-profile.css";
import "../utils/buttons.css";

const DeleteUser: React.FC = () => {
    const [error, setError] = useState<string>("");
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const { user_id } = useParams<{ user_id: string}>();
    const { token, logout  } = useAuth();

    if (!token) {
        return null;
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            if (!res.ok) {
                const text = await res.json();
                throw new Error(text || "User deletion failed");
            }
            navigate(`/users`);
            logout();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "failed to delete user");
        } 
    }

    return (
        <>
            <button className="action-button danger" onClick={() => setShowConfirm(true)}>
                Delete Account
            </button>
            {error && <p className="form-error">{error}</p>}
            
            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Delete Account</h3>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="action-button danger" onClick={() => { handleDelete(); setShowConfirm(false); }}>
                                Delete Account
                            </button>
                            <button className="action-button secondary" onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeleteUser;