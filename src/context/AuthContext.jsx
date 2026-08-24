import { createContext, useContext, useState } from "react";
import { loginWithEmailPassword, signupWithEmailPassword } from "../api/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // login function
  async function login(emailInput, password) {
    setLoading(true);
    setError("");
    try {
      const idToken = await loginWithEmailPassword(emailInput, password);
      setToken(idToken);
      setEmail(emailInput);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // sign up function
  async function signup(emailInput, password) {
    setLoading(true);
    setError("");
    try {
      const idToken = await signupWithEmailPassword(emailInput, password);
      setToken(idToken);
      setEmail(emailInput);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, email, isAuthenticated: !!token, error, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}