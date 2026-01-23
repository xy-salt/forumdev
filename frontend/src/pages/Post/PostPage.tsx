import {TopicListButton, HomeButton, LoginButton, RegisterButton, UserListButton } from '../../components/utils/Buttons'
import Post from '../../components/Post/Post';

const PostPage: React.FC = () => {
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
            <UserListButton />
            <Post />
        </div>
    );
};

export default PostPage;