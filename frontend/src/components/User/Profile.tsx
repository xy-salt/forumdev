import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Profile: React.FC = () => {
    interface UserProfile {
        user_id: number;
        username: string;
        created_at: string;
        posts: Post[];
    }
    interface Post {
        post_id: number;
        topic_id: number;
        title: string;
        topic_name: string;
    }

    const [user, setUser] = useState<UserProfile | null>(null);
    const { user_id } = useParams<{ user_id: string }>();
    if (!user_id) {
        return (
            <div>
                <h4>user not found</h4>
            </div>
        )
    }
    const userID = parseInt(user_id, 10);
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userID}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "failed to retrieve user profile")
                }
                const data: UserProfile = await res.json();
                setUser(data);
            } catch (err : any) {
                console.error(err);
            }
            
        }

        fetchProfile();
    }, [user_id]);

    

    return user == null
        ? (
            <div>
                <h4>{"user not found"}</h4>
            </div>
        ) 
        : (
            <div>
                <h4>{user.username}</h4>
                <h5>{user.created_at}</h5>
                {user.posts == null ? (
                    <h6>No post yet</h6>
                ) : (
                    <ul>
                        {user.posts.map(p => (
                            <li key={p.post_id}>
                                <Link to={`/topics/${p.topic_id}`}>{p.topic_name}</Link>
                                <Link to={`/topics/${p.topic_id}/posts/${p.post_id}`}>{p.title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
}

export default Profile;