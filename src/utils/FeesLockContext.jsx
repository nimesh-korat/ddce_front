import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFeesRemindersForStudent } from "../apis/apis";

function parseDate(str) {
  if (!str) return null;
  return new Date(str.replace(" ", "T"));
}

function isLocked(r) {
  if (r.is_paid) return false;
  if (r.lock_after_minutes === null || r.lock_after_minutes === undefined)
    return false;
  const dl = parseDate(r.deadline);
  if (!dl) return false;
  return Date.now() > dl.getTime() + r.lock_after_minutes * 60 * 1000;
}

const FeesLockContext = createContext({
  isLoading: false,
  locked: false,
  lockedReminders: [],
});

export function useFeesLock() {
  return useContext(FeesLockContext);
}

export function FeesLockContextProvider({ children }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const isStudent = user?.Role === 0;

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["feesRemindersStudent"],
    queryFn: getFeesRemindersForStudent,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    enabled: isStudent,
    retry: 1,
  });

  const reminders = data?.data || [];
  const lockedReminders = reminders.filter(isLocked);
  const locked = lockedReminders.length > 0;

  return (
    <FeesLockContext.Provider
      value={{
        isLoading: isStudent && isLoading,
        locked,
        lockedReminders,
      }}
    >
      {children}
    </FeesLockContext.Provider>
  );
}
