import { Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/features/auth";
import { ROUTE_PATHS } from "@/app/router/paths";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { PublicOnlyRoute } from "@/app/router/PublicOnlyRoute";
import { UserDashboardPage } from "@/pages/dashboard";
import { WelcomePage } from "@/pages/home";
import { InviteLandingPage } from "@/pages/invite";
import { TeamDashboardPage } from "@/pages/team-vault";
import { NotFoundPage } from "@/pages/404notfound";

function App() {
	return (
		<>
			<AuthProvider>
				<Routes>
					<Route
						path={ROUTE_PATHS.HOME}
						element={<PublicOnlyRoute>{<WelcomePage />}</PublicOnlyRoute>}
					/>
					<Route
						path={ROUTE_PATHS.DASHBOARD}
						element={<ProtectedRoute>{<UserDashboardPage />}</ProtectedRoute>}
					/>
					<Route
						path={ROUTE_PATHS.TEAM}
						element={<ProtectedRoute>{<TeamDashboardPage />}</ProtectedRoute>}
					/>
					<Route path={ROUTE_PATHS.INVITE} element={<InviteLandingPage />} />
					<Route path={ROUTE_PATHS.NOTFOUND} element={<NotFoundPage />} />
					<Route
						path="*"
						element={<Navigate to={ROUTE_PATHS.NOTFOUND} replace />}
					/>
				</Routes>
			</AuthProvider>
		</>
	);
}

export default App;
