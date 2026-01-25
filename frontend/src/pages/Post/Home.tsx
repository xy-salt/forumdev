import BasicPostList from "../../components/Post/BasicPostList"
import "../../components/Post/post-topic.css"

const Home: React.FC = () => {
    return (
        <div>
            <h2 style={{margin: '0 0 24px 0', fontSize: '28px', fontWeight: '700', color: '#1c1e21'}}>Recent Posts</h2>
            <BasicPostList />
        </div>
    );
};

export default Home;