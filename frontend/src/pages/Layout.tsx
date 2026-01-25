import { Outlet } from "react-router-dom";
import { useAuth } from "../components/utils/Auth"
import { HomeButton, LoginButton, LogOutButton, ProfileButton, RegisterButton, TopicListButton, UserListButton } from "../components/utils/Buttons";


const Layout: React.FC = () => {
    const { token } = useAuth();
    return (
        <div> 
            <nav>
                <div className="nav-left">
                    <HomeButton />
                    <TopicListButton />
                    <UserListButton />
                </div>
                <div className="nav-right">
                    {token ? <ProfileButton /> : <RegisterButton />}
                    {token ? <LogOutButton /> : <LoginButton />}
                </div>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;