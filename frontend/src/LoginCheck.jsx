import { Navigate } from "react-router-dom";

function LoginCheck({ children }) {
  const token = localStorage.getItem("currentUser");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default LoginCheck;
