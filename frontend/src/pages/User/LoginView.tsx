
import Login from "../../components/User/Login";
import { HomeButton, RegisterButton, TopicListButton, UserListButton } from "../../components/utils/Buttons";

const LoginView: React.FC = () => {

    return (
        <div>

            <HomeButton />
            <TopicListButton />
            <UserListButton />
            <h3>Login</h3>
            <Login />
            <p>Don't have an account? Register now!!</p>
            <RegisterButton />
        </div>
    )
}

export default LoginView;
