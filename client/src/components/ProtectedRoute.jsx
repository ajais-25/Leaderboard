import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated by looking for user data in localStorage
  const user = localStorage.getItem("user");

  // If no user is found in localStorage, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
