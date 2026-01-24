import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface UpdatePostProp {
    onClose: () => void;
}

const UpdatePost: React.FC<UpdatePostProp> = ({ onClose }) => {
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
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { topic_id, post_id } = useParams<{ topic_id: string, post_id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPostDetails() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${post_id}`);
                const data: PostDetails = await res.json();
                setPost(data);
            }
            catch (err: any) {
                console.log("failed to get post details")
                setError(err.message || "post does not exist");
            }
        }

        fetchPostDetails();
    }, [topic_id, post_id]);

    let isComment: boolean = true;

    useEffect(() => {
        if (post) {
            if (post.title) {
                isComment = false;
                setTitle(post.title);
            }
            setContent(post.content);
        }
    }, [post])

    const token = localStorage.getItem("token");
    if (!token) {
        return (
            <div>
                <h5>Only Post Creator can update post</h5>
                <h6>Login to verify your identidy</h6>
            </div>
        )
    }

    if (!post && !error) {
        return (
            <div>
                <h5>Loading...</h5>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <h5>Unable to update post</h5>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        )
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${post_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Post Update failed");
            }
            alert("Post Updated");
            onClose();
            navigate(`/topics/${topic_id}/posts/${post_id}`);
        } catch (err: any) {
            console.error(err, "failed to update post");
            setError(err.message || "post update failed");
        }
    };

    
    return isComment
        ? (
            <div>
                <form onSubmit={handleUpdate}>
                    <label>Update Comment</label>
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Update Comment</button>
                </form>
            </div>
        ) : (
            <div>
                <form onSubmit={handleUpdate}>
                    <label>Update Post</label>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}    
                    />
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Update Post</button>
                </form>
            </div>
        );
}

const UpdatePostButton: React.FC = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}>
                Update Post
            </button>

            {show && <UpdatePost onClose={() => setShow(false)} />}
        </>
    )
}

export default UpdatePostButton;