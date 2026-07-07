import { Navigate } from "react-router-dom";
import { useBatchAccess } from "./BatchAccessContext";

// Wraps a student route — redirects to "/" if feature is locked(0) or hidden(2)
// Usage: <Route path="/practice" element={<AccessGuard feature="practice"><Practice /></AccessGuard>} />
const AccessGuard = ({ feature, children }) => {
  const { accessMap, isEnabled } = useBatchAccess();

  // While access config is loading, render nothing (avoids flash)
  if (accessMap === null) return null;

  // If not enabled (locked=0 or hidden=2) → redirect home silently
  if (!isEnabled(feature)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AccessGuard;
