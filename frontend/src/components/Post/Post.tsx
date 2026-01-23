import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const Post: React.FC = () => {
    interface PostDetails {
        title: string;
        content: string;
        topic_name: string;
        user_id: number;
        username: string;
        is_deleted: boolean;
        comments: comment[]
    }
    interface comment {
        comment_id: number;
        topic_id: number;
        creator_id: number;
        content: string;
        username: string;
    }

    const [post, setPost] = useState<PostDetails | null>(null);
    const { topic_id, post_id} = useParams<{ topic_id: string, post_id: string}>();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function fetchPostDetails() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${post_id}`);
                const data: PostDetails = await res.json();
                setPost(data);
            }
            catch {
                console.log("failed to get post details")
            }
        }

        fetchPostDetails();
    }, [location.key]);

    if (post == null) {
        return (
            <div>
                <h4>{"Post does not exist"}</h4>
            </div>
        );
    }

    return (
        <div>
            <Link to={`/users/${post.user_id}`}>{post.username}</Link>
            <Link to={`/topics/${topic_id}`}>{post.topic_name}</Link>
            <h5>{post.title}</h5>
            <p>{post.content}</p>
            {post.comments == null ? (
                <h6>No comments yet</h6>
            ) : (
                <ul>
                    {post.comments.map(c => (
                        <li key={c.comment_id}>
                            <Link to={`/users/${c.creator_id}`}>{c.username}</Link>
                            <Link to={`/topics/${c.topic_id}/posts/${c.comment_id}`}>{c.content}</Link>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => navigate(`/topics/${topic_id}/posts/${post_id}/comments`)}>Comment</button>
           
        </div>
    );
}

export default Post;