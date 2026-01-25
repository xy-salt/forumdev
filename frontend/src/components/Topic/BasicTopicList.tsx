import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../Post/post-topic.css";

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
            <div className="empty-state">
                <h3 className="empty-state-title">No Topics Yet</h3>
                <p className="empty-state-message">The forum hasn't any topics yet. Be the first to create one!</p>
            </div>
        );
    }


    return (
            <div className='container'>
                {topics.map(t => (
                    <div key={t.topic_id} className='card'>
                        
                        <div className='top-right'> 
                            <Link to={`/users/${t.user_id}`}>
                                {t.username}
                            </Link>
                        </div>

                        <div className='main'>
                            <Link to={`/topics/${t.topic_id}`}>
                                {t.topic_name}
                            </Link>
                        </div>

                    </div>
                ))}
            </div>
        );
}

export default BasicTopicList;