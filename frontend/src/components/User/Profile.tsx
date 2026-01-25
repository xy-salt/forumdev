import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import UpdateUserButton from "./UpdateUser";
import DeleteUser from "./DeleteUser";
import { getValidUserID } from "../utils/Auth";
import "./user-profile.css";
import "../Post/post-topic.css";


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
    const location = useLocation();
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
    }, [location.key]);

    const authUserID = getValidUserID();

    return user == null
        ? (
            <div className="empty-state">
                <h3 className="empty-state-title">User Not Found</h3>
                <p className="empty-state-message">This user does not exist.</p>
            </div>
        ) 
        : (
            <div>
                <div className="profile-container">
                    <div className="profile-header">
                        <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
                        <h1 className="profile-username">{user.username}</h1>
                        <div className="profile-info">
                            <div className="profile-info-item">
                                <span className="profile-info-label">Member since:</span> {new Date(user.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="profile-actions">
                            {authUserID == userID && <UpdateUserButton />}
                            {authUserID == userID && <DeleteUser />}
                        </div>
                    </div>
                </div>

                <div className="profile-container" style={{marginTop: '24px'}}>
                    <h2 className="profile-section-title">Posts by {user.username}</h2>
                    {user.posts == null || user.posts.length === 0 ? (
                        <div className="no-comments">No posts yet.</div>
                    ) : (
                        <div className="container">
                            {user.posts.map(p => (
                                <div key={p.post_id} className="card post-item">

                                    <div className="top-left">
                                        <Link to={`/topics/${p.topic_id}`}>
                                            topics/{p.topic_name}
                                        </Link>
                                    </div>

                                    <div className="main">
                                        <Link to={`/topics/${p.topic_id}/posts/${p.post_id}`}>
                                            {p.title}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
}

export default Profile;