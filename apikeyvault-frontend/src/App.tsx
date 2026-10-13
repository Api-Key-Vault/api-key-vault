import { Routes, Route } from 'react-router';
import { ROUTE_PATHS } from '@/shared/config/routes';
import { AuthProvider } from '@/features/auth';
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth';
import Login from '@/Login';
import WelcomePage from '@/WelcomePage';
import UserDashboardPage from '@/userDashboard/UserDashboardPage';
import TeamDashboardPage from './teamDashboard/TeamDashboardPage';
import InviteLanding from './InviteLanding';

function App() {	
	return <>
	
	<AuthProvider>	
		<Routes>
			<Route path={ROUTE_PATHS.HOME} element={<PublicOnlyRoute>{<WelcomePage />}</PublicOnlyRoute>} />
			<Route path={ROUTE_PATHS.LOGIN} element={<PublicOnlyRoute>{<Login />}</PublicOnlyRoute>} />
			<Route path={ROUTE_PATHS.DASHBOARD} element={<ProtectedRoute>{<UserDashboardPage /> }</ProtectedRoute>} />
			<Route path={ROUTE_PATHS.TEAM} element={<ProtectedRoute>{<TeamDashboardPage />}</ProtectedRoute>} /> 
			<Route path={ROUTE_PATHS.INVITE} element={<InviteLanding />} /> 
		</Routes>
	</AuthProvider>
	</>;
}

export default App;
