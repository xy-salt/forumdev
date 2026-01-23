import BasicUserList from '../../components/User/BasicUserList';
import {TopicListButton, HomeButton, LoginButton, RegisterButton, UserListButton } from '../../components/utils/Buttons'

const Users: React.FC = () => {
    return (
        <div>
            <h3>
                {"All users"}
            </h3>
            <br />
            <HomeButton />
            <TopicListButton />
            <LoginButton />
            <RegisterButton />
            <UserListButton />
            <BasicUserList />
        </div>
    );
};

export default Users;