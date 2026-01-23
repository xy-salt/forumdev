
import TopicPage from "./pages/Topic/TopicPage";
import TopicPostsView from "./pages/Topic/TopicPostsView";
import PostPage from "./pages/Post/PostPage";
import CreateCommentPage from "./pages/Post/CreateCommentPage";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, orange } from "@mui/material/colors";
import Home from "./pages/Post/Home";
import LoginView from "./pages/User/LoginView";
import RegisterView from "./pages/User/RegisterView";
import Users from "./pages/User/Users";
import UserProfile from "./pages/User/UserProfile";
import Topics from "./pages/Topic/Topics";

const theme = createTheme({
    palette: {
        primary: blue,
        secondary: orange,
    },
});

const App: React.FC = () => {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/register" element={<RegisterView />} />
                        <Route path="/login" element={<LoginView />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/:user_id" element={<UserProfile />} />
                        <Route path="/topics" element={<Topics />}/>
                        <Route path="/topics/:topic_id" element={<TopicPage />} />
                        <Route path="/topics/:topic_id/posts" element={<TopicPostsView />} />
                        <Route path="/topics/:topic_id/posts/:post_id" element={<PostPage />} />
                        <Route path="/topics/:topic_id/posts/:post_id/comments" element={<CreateCommentPage />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
};

export default App;