import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BasicTopicList: React.FC = () => {
    interface Topic {
        topic_id: number;
        user_id: number;
        topic_name: string;
        username: string;
    }
    const [topics, setTopics] = useState<Array<Topic> | null>(null);
    const location = useLocation();

    useEffect(() => {
        async function fetchTopics() {
            try {
                 const res = await fetch(`${import.meta.env.VITE_API_URL}/topics`);
                const data: Topic[] = await res.json();
                setTopics(data);
            } catch {
                console.log("failed to get all topics");
            }
        }
    
        fetchTopics();
    }, [location.key]);

    if (topics == null) {
        return (
            <div>
                <h4>Forum has no topics</h4>
            </div>
        );
    }


    return (
            <div>
                <ul>
                    {topics.map(t => (
                        <li key={t.topic_id}>
                            <Link to={`/users/${t.user_id}`}>{t.username}</Link>
                            <Link to={`/topics/${t.topic_id}`}>{t.topic_name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
}

export default BasicTopicList;