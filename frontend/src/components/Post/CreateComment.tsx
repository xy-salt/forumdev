import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getValidUserID } from "../utils/Auth";
import { useAuth } from "../utils/Auth"
import "./post-topic.css";

interface CreateCommentProp {
    onClose: () => void,
}

const CreateComment: React.FC<CreateCommentProp> = ({ onClose }) => {
    const [comment, setComment] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { topic_id, post_id } = useParams<{ topic_id: string, post_id: string}>();
    const navigate = useNavigate();
    const { token } = useAuth();

    const user_id = getValidUserID();
    if (!user_id) {
        return (
            <div className="empty-state">
                <h3 className="empty-state-title">Login Required</h3>
                <p className="empty-state-message">Please log in or create an account to post a comment.</p>
            </div>
        );
    }

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${post_id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id, comment }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Comment Creation failed");
            }
            setComment("");
            navigate(`/topics/${topic_id}/posts/${post_id}`);
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err);
        }
    };

    
    return (
        <div className="form-section">
            <h3 className="form-section-title">Add a Comment</h3>
            <form onSubmit={handleCreate}>
                <div className="form-group">
                    <label htmlFor="comment-input">Your Comment</label>
                    <textarea
                        id="comment-input"
                        className="form-textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        required
                    />
                </div>
                {error && <p className="form-error">{error}</p>}
                <div className="form-actions">
                    <button className="action-button success" type="submit">Post Comment</button>
                    <button className="action-button secondary" type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

const CreateCommentButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button className="action-button primary" onClick={() => setShow(true)}>
                Add Comment
            </button>

            {show && (
                <div className="modal-overlay show" onClick={() => setShow(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShow(false)}>×</button>
                        <CreateComment onClose={() => setShow(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateCommentButton;