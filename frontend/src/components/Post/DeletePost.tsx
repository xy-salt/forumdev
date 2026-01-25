import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import "./post-topic.css";
import "../utils/buttons.css";

interface DeletePostProps {
    isComment?: boolean;
    commentId?: number;
    onDelete?: () => void;
}

const DeletePost: React.FC<DeletePostProps> = ({ isComment = false, commentId, onDelete }) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>();
    const [showConfirm, setShowConfirm] = useState(false);
    const { topic_id, post_id } = useParams<{ topic_id: string, post_id: string}>();
    const { token } = useAuth();

    if (!token) {
        return null;
    }

    const handleDelete = async () => {
        try {
            const deleteId = isComment ? commentId : post_id;
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${deleteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `${isComment ? "Comment" : "Post"} deletion failed`);
            }
            
            if (isComment && onDelete) {
                onDelete();
            } else {
                navigate(`/topics/${topic_id}/posts`);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || `failed to delete ${isComment ? "comment" : "post"}`);
        }
    }
    
    if (isComment) {
        return (
            <>
                <button className="comment-delete-btn" onClick={() => setShowConfirm(true)} title="Delete comment">
                    ✕
                </button>
                {error && <p className="form-error">{error}</p>}
                
                {showConfirm && (
                    <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Delete Comment</h3>
                            <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
                            <div className="modal-actions">
                                <button className="action-button danger" onClick={() => { handleDelete(); setShowConfirm(false); }}>
                                    Delete
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
    
    return (
        <>
            <button className="action-button danger" onClick={() => setShowConfirm(true)}>
                Delete Post
            </button>
            {error && <p className="form-error">{error}</p>}
            
            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="action-button danger" onClick={() => { handleDelete(); setShowConfirm(false); }}>
                                Delete
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

export default DeletePost;