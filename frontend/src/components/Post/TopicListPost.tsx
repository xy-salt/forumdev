import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

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
            <div>
                <h4>Topic has no post</h4>
            </div>
        );
    }


    return (
        <div>
            <ul>
                {posts.map(p => (
                    <li key={p.post_id}>
                        <Link to={`/users/${p.creator_id}`}>{p.username}</Link>
                        <Link to={`/topics/${topic_id}/posts/${p.post_id}`}>{p.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopicListPost;