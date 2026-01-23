import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getValidUserID from "../utils/Auth";

interface CreatePostProp {
    onClose: () => void;
}

const CreatePost: React.FC<CreatePostProp> = ({ onClose }) => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { topic_id } = useParams<{ topic_id: string}>();
    const navigate = useNavigate();

    const user_id = getValidUserID();
    if (!user_id) {
        return (
            <div>
                <h4>Login or create an account to create a post</h4>
            </div>
        );
    }

    const token = localStorage.getItem("token");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id, title, content }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Post Creation failed");
            }
            alert("Post Created");
            setTitle("");
            setContent("");
            onClose();
            navigate("");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "post creation failed");
        }
    };

    
    return (
        <div>
            <form onSubmit={handleCreate}>
                <label>Post:</label>
                <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}    
                />
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Create Post</button>
            </form>
        </div>
    )
}

const CreatePostButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}>
                Create Post
            </button>

            {show && <CreatePost onClose={() => setShow(false)} />}
        </>
    )
}

export default CreatePostButton;