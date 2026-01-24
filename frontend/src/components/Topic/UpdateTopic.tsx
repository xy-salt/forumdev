import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

    const token = localStorage.getItem("token");
    if (!token) {
        return (
            <div>
                <h5>Only Topic Creator can update topic</h5>
                <h6>Login to verify your identidy</h6>
            </div>
        )
    }

    if (!topic && !error) {
        return (
            <div>
                <h5>Loading...</h5>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <h5>Unable to update topic</h5>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        )
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
            alert("topic updated");
            onClose();
            navigate(`/topics/${topic_id}`);
        } catch (err: any) {
            console.log(err, "failed to update topic");
            setError(err.message || "topic update failed");
        }
    }

    return (
        <div>
            <form onSubmit={handleUpdate}>
                <label>Update Topic</label>
                <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Update topic</button>
            </form>
        </div>
    )
}

const UpdateTopicButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}>
                Update Topic
            </button>

            {show && <UpdateTopic onClose={() => setShow(false)} />}
        </>
    );
}

export default UpdateTopicButton;