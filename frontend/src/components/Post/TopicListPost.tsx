import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import "./post-topic.css";

const TopicListPost: React.FC = () => {
    interface Post {
        post_id: number;
        creator_id: number;
        title: string;
        username: string;
    }
    const [posts, setPosts] = useState<Array<Post> | null>(null);
    const { topic_id } = useParams<{ topic_id: string }>();
    const location = useLocation();

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts`);
                const data: Post[] = await res.json();
                setPosts(data);
            } catch {
                console.log("failed to fetchPosts in topic");
            }
        }
    
        fetchPosts();
    }, [topic_id, location.key]);

    if (posts == null) {
        return (
            <div className="empty-state">
                <h3 className="empty-state-title">No Posts</h3>
                <p className="empty-state-message">This topic has no posts yet.</p>
            </div>
        );
    }


    return (
        <div className='container'>
            {posts.map(p => (
                <div key={p.post_id} className='card post-item'>
                    
                    <div className='top-right'>
                        <Link to={`/users/${p.creator_id}`}>
                            {p.username}
                        </Link>
                    </div>

                    <div className='main'>
                        <Link to={`/topics/${topic_id}/posts/${p.post_id}`}>
                            {p.title}
                        </Link>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default TopicListPost;