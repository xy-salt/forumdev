
import BasicTopicList from '../../components/Topic/BasicTopicList';
import {TopicListButton, HomeButton, LoginButton, RegisterButton, UserListButton } from '../../components/utils/Buttons'
import CreateTopicButton from '../../components/Topic/CreateTopic';

const Topics: React.FC = () => {
    return (
        <div>
            <h3>
                {"Explore a wide range of different topics"}
            </h3>
            <br />
            <HomeButton />
            <TopicListButton />
            <LoginButton />
            <RegisterButton />
            <UserListButton />
            <CreateTopicButton />
            <BasicTopicList />
        </div>
    );
};

export default Topics;