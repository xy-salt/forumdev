import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getValidUserID, useAuth } from "../utils/Auth";
import "../Post/post-topic.css";

interface CreateTopicProp {
    onClose: () => void;
}

const CreateTopic: React.FC<CreateTopicProp> = ({ onClose }) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { token } = useAuth();

    const user_id = getValidUserID();
    if (!user_id) {
        return (
            <div className="empty-state">
                <h3 className="empty-state-title">Login Required</h3>
                <p className="empty-state-message">Please log in or create an account to create a topic.</p>
            </div>
        );
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id, name, description }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Topic Creation failed");
            }
            setName("");
            setDescription("");
            onClose();
            navigate("/topics");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "topic creation failed");
            setName("");
        }
    };

    
    return (
        <div className="form-section">
            <h3 className="form-section-title">Create a New Topic</h3>
            <form onSubmit={handleCreate}>
                <div className="form-group">
                    <label htmlFor="topic-name">Topic Name</label>
                    <input 
                        id="topic-name"
                        className="form-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter topic name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="topic-desc">Description</label>
                    <textarea
                        id="topic-desc"
                        className="form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter topic description"
                    />
                </div>
                {error && <p className="form-error">{error}</p>}
                <div className="form-actions">
                    <button className="action-button success" type="submit">Create Topic</button>
                    <button className="action-button secondary" type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

const CreateTopicButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button className="action-button primary" onClick={() => setShow(true)}>
                Create Topic
            </button>

            {show && (
                <div className="modal-overlay show" onClick={() => setShow(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShow(false)}>×</button>
                        <CreateTopic onClose={() => setShow(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateTopicButton;