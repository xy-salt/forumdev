import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getValidUserID from "../utils/Auth";

const CreateComment: React.FC = () => {
    const [comment, setComment] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { topic_id, post_id } = useParams<{ topic_id: string, post_id: string}>();
    const navigate = useNavigate();

    const user_id = getValidUserID();
    if (!user_id) {
        return (
            <div>
                <h4>Login or create an account to create a comment</h4>
            </div>
        )
    }

    const token = localStorage.getItem("token");

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/topics/${topic_id}/posts/${post_id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id, comment }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Comment Creation failed");
            }
            alert("Comment Created");
            setComment("");
            navigate(`/topics/${topic_id}/posts/${post_id}`);
        } catch (err: any) {
            console.error(err);
            setError(err);
        }
    };

    
    return (
        <div>
            <form onSubmit={handleCreate}>
                <label>Comment:</label>
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Create Comment</button>
            </form>
        </div>
    )
}

// const CreateCommentButton: React.FC = () => {
//     const [show, setShow] = useState(false);
//     return (
//         <>
//             <button onClick={() => setShow(true)}>
//                 Create Comment
//             </button>

//             {show && <CreateComment onClose={() => setShow(false)} />}
//         </>
//     )
// }

export default CreateComment;