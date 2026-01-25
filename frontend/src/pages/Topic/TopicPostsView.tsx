import TopicListPost from '../../components/Post/TopicListPost';
import CreatePostButton from '../../components/Post/CreatePost';
import "../../components/Post/post-topic.css";

const TopicPostsView: React.FC = () => {
    return (
        <div>
            <div style={{marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'}}>
                <h2 style={{margin: '0', fontSize: '24px', fontWeight: '700', color: '#1c1e21'}}>Posts</h2>
                <CreatePostButton />
            </div>
            <TopicListPost />
        </div>
    );
};

export default TopicPostsView;