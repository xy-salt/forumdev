import { useNavigate } from "react-router-dom";

export function TopicListButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/topics")}>
            Explore Topics
        </button>
    );
}

export function HomeButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/")}>
            ForumDev
        </button>
    )
}

export function LoginButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/login")}>
            Login
        </button>
    )
}

export function RegisterButton() {
    const navigate = useNavigate();

    return <button onClick={() => navigate("/register")}>
        Register
    </button>
}

export function UserListButton() {
    const navigate = useNavigate();

    return <button onClick={() => navigate("/users")}>
        Find User
    </button>
}

export function LogOutButton() {
    return (
        <button onClick={() => { localStorage.removeItem("token") }}>
            Logout
        </button>      
    )
}