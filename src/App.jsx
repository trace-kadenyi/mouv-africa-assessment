import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function AppContent() {
  const { isAuthenticated, token, logout } = useAuth();
  return isAuthenticated ? (
    <Dashboard token={token} onLogout={logout} />
  ) : (
    <Auth />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
