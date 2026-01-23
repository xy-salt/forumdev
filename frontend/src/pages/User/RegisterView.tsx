import { HomeButton, LoginButton, TopicListButton, UserListButton } from "../../components/utils/Buttons"
import Register from "../../components/User/Register"

const RegisterView: React.FC = () => {
    return (
        <div>
            <HomeButton />
            <TopicListButton />
            <UserListButton />
            <h3>Register</h3>
            <Register />
            <p>Already have an account? Login now!!</p>
            <LoginButton />
        </div>
    );
};

export default RegisterView;