import BasicUserList from '../../components/User/BasicUserList';
import "../../components/User/user-profile.css";

const Users: React.FC = () => {
    return (
        <div>
            <h2 style={{margin: '0 0 24px 0', fontSize: '28px', fontWeight: '700', color: '#1c1e21'}}>
                Community Members
            </h2>
            <BasicUserList />
        </div>
    );
};

export default Users;