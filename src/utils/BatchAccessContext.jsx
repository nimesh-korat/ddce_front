import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import UserContext from "./UserContex";

export const BatchAccessContext = createContext();

// visibility values
// 0 = locked  → visible in sidebar with lock icon, URL → redirect home
// 1 = enabled → fully accessible
// 2 = hidden  → completely removed from sidebar, URL → redirect home

export const BatchAccessProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [accessMap, setAccessMap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.Role !== 0) {
      setAccessMap(null);
      return;
    }

    const fetchAccess = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const api = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${api}/api/batchAccess`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.success) {
          const map = {};
          response.data.data.forEach((f) => {
            map[f.key] = f.visibility;
          });
          setAccessMap(map);
        }
      } catch (err) {
        console.error("BatchAccess fetch error:", err.message);
        setAccessMap({});
      } finally {
        setLoading(false);
      }
    };

    fetchAccess();
  }, [user]);

  const getVisibility = (key) => {
    if (!accessMap) return 0;
    return accessMap[key] !== undefined ? accessMap[key] : 0;
  };

  const isEnabled = (key) => getVisibility(key) === 1;
  const isLocked = (key) => getVisibility(key) === 0;
  const isHidden = (key) => getVisibility(key) === 2;

  return (
    <BatchAccessContext.Provider
      value={{
        accessMap,
        loading,
        getVisibility,
        isEnabled,
        isLocked,
        isHidden,
      }}
    >
      {children}
    </BatchAccessContext.Provider>
  );
};

export const useBatchAccess = () => useContext(BatchAccessContext);

export default BatchAccessContext;
