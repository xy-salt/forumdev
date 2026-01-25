import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import "./post-topic.css";
import "../utils/buttons.css";

interface UpdatePostProp {
    onClose: () => void;
}

const UpdatePost: React.FC<UpdatePostProp> = ({ onClose }) => {
    interface PostDetails {
        title: string;
        content: string;
        topic_name: string;
        user_id: number;
        username: string;
        is_deleted: boolean;
        comments: comment[]
    }
    interface comment {
        comment_id: number;
        topic_id: number;
        creator_id: number;
        content: string;
        username: string;
    }

    const [post, setPost] = useState<PostDetails | null>(null);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { topic_id, post_id } = useParams<{ topic_id: string, post_id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        async function fetchPostDetails() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${post_id}`);
                const data: PostDetails = await res.json();
                setPost(data);
            }
            catch (err: any) {
                console.log("failed to get post details")
                setError(err.message || "post does not exist");
            }
        }

        fetchPostDetails();
    }, [topic_id, post_id]);

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
        }
    }, [post])

    if (!token) {
        return null;
    }

    if (!post && !error) {
        return (
            <div className="empty-state">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-error">
                <p>Unable to update post: {error}</p>
            </div>
        );
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${post_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Post Update failed");
            }
            onClose();
            navigate(`/topics/${topic_id}/posts/${post_id}`);
        } catch (err: any) {
            console.error(err, "failed to update post");
            setError(err.message || "post update failed");
        }
    };

    
    return !post?.title
        ? (
            <div className="form-section">
                <h3 className="form-section-title">Edit Comment</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="comment-input">Comment Content</label>
                        <textarea
                            id="comment-input"
                            className="form-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-actions">
                        <button className="action-button success" type="submit">Update Comment</button>
                        <button className="action-button secondary" type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        ) : (
            <div className="form-section">
                <h3 className="form-section-title">Edit Post</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="post-title">Post Title</label>
                        <input 
                            id="post-title"
                            className="form-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="post-content">Post Content</label>
                        <textarea
                            id="post-content"
                            className="form-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-actions">
                        <button className="action-button success" type="submit">Update Post</button>
                        <button className="action-button secondary" type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        );
}

const UpdatePostButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button className="action-button secondary" onClick={() => setShow(true)}>
                Edit Post
            </button>

            {show && (
                <div className="modal-overlay show" onClick={() => setShow(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShow(false)}>×</button>
                        <UpdatePost onClose={() => setShow(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdatePostButton;