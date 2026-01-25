import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import "../Post/post-topic.css";
import "../utils/buttons.css";

interface UpdateTopicProp {
    onClose: () => void
}

const UpdateTopic: React.FC<UpdateTopicProp> = ({ onClose }) => {
    interface Topic {
        topic_id: number;
        user_id: number;
        topic_name: string;
        description: string;
        username: string;
        created_at: string;
    }

    const [topic, setTopic] = useState<Topic | null>(null);
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { topic_id } = useParams<{ topic_id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        async function fetchTopic() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}`);
                const data = await res.json();
                setTopic(data);
            } catch (err: any) {
                console.log("failed to fetch topic details for update");
                setError(err.message || "topic does not exist");
            }
        }

        fetchTopic();
    }, [topic_id]);

    useEffect(() => {
        if (topic) {
            setDescription(topic.description);
        }
    }, [topic])

    if (!token) {
        return null;
    }

    if (!topic && !error) {
        return (
            <div className="empty-state">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-error">
                <p>Unable to update topic: {error}</p>
            </div>
        );
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ description }),
            });
            
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "topic update failed")
            }
            onClose();
            navigate(`/topics/${topic_id}`);
        } catch (err: any) {
            console.log(err, "failed to update topic");
            setError(err.message || "topic update failed");
        }
    }

    return (
        <div className="form-section">
            <h3 className="form-section-title">Edit Topic</h3>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label htmlFor="topic-desc">Topic Description</label>
                    <textarea 
                        id="topic-desc"
                        className="form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                {error && <p className="form-error">{error}</p>}
                <div className="form-actions">
                    <button className="action-button success" type="submit">Update Topic</button>
                    <button className="action-button secondary" type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

const UpdateTopicButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button className="action-button secondary" onClick={() => setShow(true)}>
                Edit Topic
            </button>

            {show && (
                <div className="modal-overlay show" onClick={() => setShow(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShow(false)}>×</button>
                        <UpdateTopic onClose={() => setShow(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdateTopicButton;