import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RequireStaff({ children }: { children: React.ReactNode }) {
  const { isStaff, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isStaff) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}
