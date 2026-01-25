import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import UpdateTopicButton from "./UpdateTopic";
import { getValidUserID } from "../utils/Auth";
import "../Post/post-topic.css";

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
    const location = useLocation();

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
    }, [location.key]);

    if (topic == null) {
        return (
            <div className="empty-state">
                <h3 className="empty-state-title">Topic Not Found</h3>
                <p className="empty-state-message">This topic does not exist.</p>
            </div>
        );
    }

    const authUserID = getValidUserID();

    return (
        <div>
            <div className="topic-details">
                <div className="topic-header">
                    <h1 className="topic-title">{topic.topic_name}</h1>
                    <p className="topic-description">{topic.description}</p>
                    <div className="topic-meta">
                        <span>Created by <Link to={`/users/${topic.user_id}`}>{topic.username}</Link></span>
                        <span>on {new Date(topic.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="topic-actions">
                    {authUserID == topic.user_id && <UpdateTopicButton />}
                    <button className="action-button primary" onClick={() => navigate(`/topics/${topic_id}/posts`)}>
                        View Posts
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TopicDetails;