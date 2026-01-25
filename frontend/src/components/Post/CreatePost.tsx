import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getValidUserID, useAuth } from "../utils/Auth";
import "./post-topic.css";

interface CreatePostProp {
    onClose: () => void;
}

const CreatePost: React.FC<CreatePostProp> = ({ onClose }) => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { topic_id } = useParams<{ topic_id: string}>();
    const navigate = useNavigate();
    const { token } = useAuth();

    const user_id = getValidUserID();
    if (!user_id) {
        return (
            <div className="empty-state">
                <h3 className="empty-state-title">Login Required</h3>
                <p className="empty-state-message">Please log in or create an account to create a post.</p>
            </div>
        );
    }

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
            setTitle("");
            setContent("");
            onClose();
            navigate(`/topics/${topic_id}/posts`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "post creation failed");
        }
    };

    
    return (
        <div className="form-section">
            <h3 className="form-section-title">Create a New Post</h3>
            <form onSubmit={handleCreate}>
                <div className="form-group">
                    <label htmlFor="post-title">Post Title</label>
                    <input 
                        id="post-title"
                        className="form-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="post-content">Post Content</label>
                    <textarea
                        id="post-content"
                        className="form-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here"
                    />
                </div>
                {error && <p className="form-error">{error}</p>}
                <div className="form-actions">
                    <button className="action-button success" type="submit">Create Post</button>
                    <button className="action-button secondary" type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

const CreatePostButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button className="action-button primary" onClick={() => setShow(true)}>
                Create Post
            </button>

            {show && (
                <div className="modal-overlay show" onClick={() => setShow(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShow(false)}>×</button>
                        <CreatePost onClose={() => setShow(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default CreatePostButton;