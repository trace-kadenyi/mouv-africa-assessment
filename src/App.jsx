import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./pages/Auth";

function AppContent() {
  const { isAuthenticated, email, logout } = useAuth();

  if (!isAuthenticated) return <Auth />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg font-medium">✅ Logged in as {email}</p>
        <button onClick={logout} className="mt-4 text-sm text-red-600">
          Log out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}