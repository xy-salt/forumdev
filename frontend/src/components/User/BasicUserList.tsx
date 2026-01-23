import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
            <div>
                <h4>{"Forum has no users"}</h4>
            </div>
        )
        :(
            <div>
                <ul>
                    {users.map(u => (
                        <li key={u.user_id}>
                            <Link to={`/users/${u.user_id}`}>{u.username}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
}

export default BasicUserList;