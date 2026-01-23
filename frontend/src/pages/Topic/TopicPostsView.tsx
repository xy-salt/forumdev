import TopicListPost from '../../components/Post/TopicListPost';
import {TopicListButton, HomeButton, LoginButton, RegisterButton, UserListButton } from '../../components/utils/Buttons'
import CreatePostButton from '../../components/Post/CreatePost';

const TopicPostsView: React.FC = () => {
    return (
        <div>
            <HomeButton />
            <TopicListButton />
            <LoginButton />
            <RegisterButton />
            <UserListButton />
            <CreatePostButton />
            <TopicListPost />
        </div>
    );
};

export default TopicPostsView;