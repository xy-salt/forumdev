import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./user-profile.css";

const BasicUserList: React.FC = () => {
    interface User {
        user_id: number;
        username: string;
    }
    const [users, setUsers] = useState<Array<User> | null>(null);
    const location = useLocation();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
                const data: User[] = await res.json();
                setUsers(data);
            } catch {
                console.log("failed to fetchUsers");
            }
        }
        fetchUsers();
    }, [location.key]);


    return users == null 
        ?(
            <div className="empty-state">
                <h3 className="empty-state-title">No Users</h3>
                <p className="empty-state-message">Be the first to join the forum!</p>
            </div>
        )
        :(
            <div className='user-list-container'>
                {users.map(u => (
                    <div key={u.user_id} className='user-item'>
                        <div className='user-header'>
                            <Link to={`/users/${u.user_id}`} className='user-name'>
                                {u.username}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        );
}

export default BasicUserList;