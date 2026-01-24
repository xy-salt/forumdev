import { useState } from "react";
import getValidUserID from "../utils/Auth";
import { useNavigate } from "react-router-dom";

interface CreateTopicProp {
    onClose: () => void;
}

const CreateTopic: React.FC<CreateTopicProp> = ({ onClose }) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const user_id = getValidUserID();
    if (!user_id) {
        return (
            <div>
                <h4>Login or create an account to create a topic</h4>
            </div>
        );
    }

    const token = localStorage.getItem("token");

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
            alert("Topic Created");
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
        <div>
            <form onSubmit={handleCreate}>
                <label>Topic:</label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}    
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Create Topic</button>
            </form>
        </div>
    );
}

const CreateTopicButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}>
                Create Topic
            </button>

            {show && <CreateTopic onClose={() => setShow(false)} />}
        </>
    );
}

export default CreateTopicButton;