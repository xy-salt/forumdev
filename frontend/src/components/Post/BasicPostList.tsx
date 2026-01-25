import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./post-topic.css";

const BasicPostList: React.FC = () => {
    interface Post {
        post_id: number;
        topic_id: number;
        creator_id: number;
        title: string;
        topic_name: string;
        username: string;
    }
    const [posts, setPosts] = useState<Array<Post> | null>(null);
    const location = useLocation();

    useEffect(() => {
        async function fetchPosts() {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/`);
            const data: Post[] = await res.json();
            setPosts(data);
        }
    
        fetchPosts();
    }, [location.key]);


    return posts == null 
        ?(
            <div className="empty-state">
                <h3 className="empty-state-title">Forum is Empty</h3>
                <p className="empty-state-message">No posts yet. Start the discussion!</p>
            </div>
        )
        :(
            <div className='container'>
                {posts.map(p => (
                    <div key={p.post_id} className='card post-item'>

                        <div className='top-left'>
                            <Link to={`/topics/${p.topic_id}`}>
                                topics/{p.topic_name}
                            </Link>
                        </div>

                        <div className='top-right'>
                            <Link to={`/users/${p.creator_id}`}>
                                {p.username}
                            </Link>
                        </div>

                        <div className='main'>
                            <Link to={`/topics/${p.topic_id}/posts/${p.post_id}`}>
                                {p.title}
                            </Link>
                        </div>
                        
                    </div>
                ))}
            </div>
        );
}

export default BasicPostList;