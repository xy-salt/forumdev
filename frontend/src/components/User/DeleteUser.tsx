import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeleteUser: React.FC = () => {
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { user_id } = useParams<{ user_id: string}>();

    const token = localStorage.getItem("token");
    if (!token) {
        return (
            <div>
                <h5>Only User can delete their account</h5>
                <h6>Login to verify your identity</h6>
            </div>
        )
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
            alert("User Deleted");
            navigate(`/users`);
            localStorage.removeItem("token");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "failed to delete user");
        } 
    }

    return (
        <button onClick={handleDelete}>
            Delete Account
            {error && <p style={{ color: "red" }}>{error}</p>}
        </button>
    )
}

export default DeleteUser;