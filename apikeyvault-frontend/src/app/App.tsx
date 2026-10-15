import { Routes, Route } from 'react-router';
import { ROUTE_PATHS } from '@/app/router/routes';
import { AuthProvider } from '@/features/auth';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { PublicOnlyRoute } from '@/app/router/PublicOnlyRoute';
import Login from '@/pages/login/ui/Login';
import WelcomePage from '@/pages/home/ui/WelcomePage';
import UserDashboardPage from '@/pages/dashboard/ui/UserDashboardPage';
import TeamDashboardPage from '@/pages/team-vault/ui/TeamDashboardPage';
import InviteLanding from '@/pages/invite/ui/InviteLanding';

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
