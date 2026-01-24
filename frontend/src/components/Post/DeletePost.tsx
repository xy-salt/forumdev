import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeletePost: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>();
    const { topic_id, post_id } = useParams<{ topic_id: string, post_id: string}>();

    const token = localStorage.getItem("token");
    if (!token) {
        return (
            <div>
                <h5>Only Post Creator or Topic Creator can delete post</h5>
                <h6>Login to verify your identity</h6>
            </div>
        )
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${post_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Post deletion failed");
            }
            alert("Post Deleted");
            navigate(`/topics/${topic_id}/posts`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "failed to delete post");
        }
    }
    
    return (
        <button onClick={handleDelete}>
            Delete Post
            {error && <p style={{ color: "red" }}>{error}</p>}
        </button>
    )
}

export default DeletePost;