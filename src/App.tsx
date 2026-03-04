import { Routes, Route } from 'react-router';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import AgentsPage from './pages/AgentsPage';

export default function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route index element={<HomePage />} />
				<Route path="chat/:key" element={<ChatPage />} />
				<Route path="agents" element={<AgentsPage />} />
			</Route>
		</Routes>
	);
}
