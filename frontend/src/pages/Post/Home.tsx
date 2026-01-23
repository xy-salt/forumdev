import BasicPostList from "../../components/Post/BasicPostList"
import {TopicListButton, HomeButton, LoginButton, RegisterButton, UserListButton, LogOutButton } from '../../components/utils/Buttons'

const Home: React.FC = () => {
    return (
        <div>
            <h3>
                {"Welcome to Forumdev"}
            </h3>
            <br />
            <HomeButton />
            <TopicListButton />
            <LoginButton />
            <RegisterButton />
            <LogOutButton />
            <UserListButton />
            <BasicPostList />
        </div>
    );
};

export default Home;