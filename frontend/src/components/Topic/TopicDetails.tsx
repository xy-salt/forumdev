import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const TopicDetails: React.FC = () => {
    interface Topic {
        topic_id: number;
        user_id: number;
        topic_name: string;
        description: string;
        username: string;
        created_at: string;
    }

    const [topic, setTopic] = useState<Topic | null>(null);
    const { topic_id } = useParams<{ topic_id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTopic() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}`);
                const data: Topic = await res.json();
                setTopic(data);
            } catch {
                console.log("failed to fetch topic details")
            }
        }

        fetchTopic();
    }, [topic_id]);

    if (topic == null) {
        return (
            <div>
                <h4>{"topic not found"}</h4>
            </div>
        );
    }

    return (
        <div>
            <h4>{topic.topic_name}</h4>
            <h5>{topic.description}</h5>
            <p>
                created by{" "}
                    <Link to={`/users/${topic.user_id}`}>{ topic.username }</Link>{" "}
                at {topic.created_at}.
            </p>
            <button onClick={() => navigate(`/topics/${topic_id}/posts`)}>View Posts</button>
        </div>
    );
}

export default TopicDetails;