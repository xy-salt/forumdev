
import BasicTopicList from '../../components/Topic/BasicTopicList';
import CreateTopicButton from '../../components/Topic/CreateTopic';
import "../../components/Post/post-topic.css";

const Topics: React.FC = () => {
    return (
        <div>
            <div style={{marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'}}>
                <h2 style={{margin: '0', fontSize: '28px', fontWeight: '700', color: '#1c1e21'}}>Topics</h2>
                <CreateTopicButton />
            </div>
            <BasicTopicList />
        </div>
    );
};

export default Topics;