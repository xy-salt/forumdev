
import TopicPage from "./pages/Topic/TopicPage";
import TopicPostsView from "./pages/Topic/TopicPostsView";
import PostPage from "./pages/Post/PostPage";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Post/Home";
import LoginView from "./pages/User/LoginView";
import RegisterView from "./pages/User/RegisterView";
import Users from "./pages/User/Users";
import UserProfile from "./pages/User/UserProfile";
import Topics from "./pages/Topic/Topics";
import Layout from "./pages/Layout";

const App: React.FC = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />} >
                        <Route path="/register" element={<RegisterView />} />
                        <Route path="/login" element={<LoginView />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/:user_id" element={<UserProfile />} />
                        <Route path="/topics" element={<Topics />}/>
                        <Route path="/topics/:topic_id" element={<TopicPage />} />
                        <Route path="/topics/:topic_id/posts" element={<TopicPostsView />} />
                        <Route path="/topics/:topic_id/posts/:post_id" element={<PostPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;