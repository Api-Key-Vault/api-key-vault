import { Routes, Route } from 'react-router';
import { ROUTE_PATHS } from '@/shared/config/routes';
import { AuthProvider } from '@/features/auth';
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth';
import Login from '@/Login';

function App() {	
	return <>
	
	<AuthProvider>	
		<Routes>
			<Route path={ROUTE_PATHS.HOME} element={<PublicOnlyRoute>{ }</PublicOnlyRoute>} />
			<Route path={ROUTE_PATHS.LOGIN} element={<PublicOnlyRoute>{<Login />}</PublicOnlyRoute>} />
			<Route path={ROUTE_PATHS.DASHBOARD} element={<ProtectedRoute>{ }</ProtectedRoute>} />
			<Route path={ROUTE_PATHS.TEAM} element={<ProtectedRoute>{ }</ProtectedRoute>} /> 
			{/* <Route path={ROUTE_PATHS.INVITE} element={ } />  */}
		</Routes>
	</AuthProvider>
	</>;
}

export default App;
