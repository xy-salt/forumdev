import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import DeletePost from "./DeletePost";
import UpdatePostButton from "./UpdatePost";
import { getValidUserID } from "../utils/Auth";
import CreateCommentButton from "./CreateComment";
import "./post-topic.css";

const Post: React.FC = () => {
    interface PostDetails {
        title: string;
        content: string;
        topic_name: string;
        topic_creator_id: number,
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

    if (post == null || post.is_deleted) {
        return (
            <div className="empty-state">
                <h3 className="empty-state-title">Post Not Found</h3>
                <p className="empty-state-message">This post does not exist or has been deleted.</p>
            </div>
        );
    }

    const authUserID = getValidUserID();

    return (
        <div>
            <div className="post-details">
                <div className="post-header">
                    <div className="post-breadcrumb">
                        <Link to={`/topics/${topic_id}`}>{post.topic_name}</Link>
                    </div>
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <span>by <Link to={`/users/${post.user_id}`}>{post.username}</Link></span>
                    </div>
                </div>
                <div className="post-content">{post.content}</div>
                <div className="post-actions">
                    {(authUserID == post.user_id || authUserID == post.topic_creator_id) && <DeletePost />}
                    {authUserID == post.user_id && <UpdatePostButton />}
                    <CreateCommentButton />
                </div>
            </div>

            <div className="comments-section">
                <h2 className="comments-title">Comments</h2>
                {post.comments == null || post.comments.length === 0 ? (
                    <div className="no-comments">No comments yet. Be the first to comment!</div>
                ) : (
                    <div className="comments-list">
                        {post.comments.map(c => (
                            <div key={c.comment_id} className="comment">
                                <div className="comment-meta">
                                    <span className="comment-author">
                                        <Link to={`/users/${c.creator_id}`}>{c.username}</Link>
                                    </span>
                                    {(authUserID == c.creator_id || authUserID == post.topic_creator_id) && 
                                        <DeletePost isComment={true} commentId={c.comment_id} onDelete={() => window.location.reload()} />
                                    }
                                </div>
                                <div className="comment-content">
                                    <Link to={`/topics/${c.topic_id}/posts/${c.comment_id}`}>{c.content}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Post;