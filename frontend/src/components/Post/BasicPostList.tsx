import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
            <div>
                <h4>{"Forum is currently empty"}</h4>
            </div>
        )
        :(
            <div>
                <ul>
                    {posts.map(p => (
                        <li key={p.post_id}>
                            <Link to={`/users/${p.creator_id}`}>{p.username}</Link>
                            <Link to={`/topics/${p.topic_id}`}>{p.topic_name}</Link>
                            <Link to={`/topics/${p.topic_id}/posts/${p.post_id}`}>{p.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
}

export default BasicPostList;