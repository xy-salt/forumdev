import { useNavigate } from "react-router-dom";
import { getValidUserID, useAuth } from "./Auth";
import { useState } from "react";
import "./buttons.css"

export function TopicListButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/topics")}>
            Topics
        </button>
    );
}

export function HomeButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/")}>
            ForumDev
        </button>
    )
}

export function LoginButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/login")}>
            Login
        </button>
    )
}

export function RegisterButton() {
    const navigate = useNavigate();

    return <button onClick={() => navigate("/register")}>
        Register
    </button>
}

export function UserListButton() {
    const navigate = useNavigate();

    return <button onClick={() => navigate("/users")}>
        Users
    </button>
}

export function LogOutButton() {
    const { logout } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    }

    return (
        <>
            <button onClick={() => setShowConfirm(true)}>
                Logout
            </button>
            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to logout?</p>
                        <div className="modal-actions">
                            <button className="action-button danger" onClick={handleLogout}>
                                Logout
                            </button>
                            <button className="action-button secondary" onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export function ProfileButton() {
    const navigate = useNavigate();
    const id = getValidUserID();

    return (
        <div className="profile-button-container">
            <button className="profile-avatar-btn" onClick={() => navigate(`/users/${id}`)}>
                U
            </button>
        </div>
    )
}