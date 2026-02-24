import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Assignments from './pages/Assignments/Assignments';
import AssignmentAttempt from './pages/AssignmentAttempt/AssignmentAttempt';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Assignments />} />
                <Route path="/assignment/:id" element={<AssignmentAttempt />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Layout>
    );
}

export default App;
