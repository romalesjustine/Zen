"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const StudySessionContext = createContext({
  startSession: () => {},
  endSession: () => {},
  isStudying: false,
});

export const StudySessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isStudying, setIsStudying] = useState(false);
  const [, setSessionDuration] = useState(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);

  const THRESHOLD = 5000;
  const IDLE_TIMEOUT = 30000;
  const UPDATE_INTERVAL = 1000;

  // Function to start the session
  const startSession = () => {
    console.log("Starting session");
    setIsStudying(true);
  };

  // Function to end the session and record the study time
  const endSession = useCallback(async () => {
    console.log("Ending session");
    setIsStudying(false);
    clearInterval(intervalTimerRef.current!);
    intervalTimerRef.current = null;

    const totalDuration =
      parseFloat(localStorage.getItem("sessionDuration")!) / 60;
    console.log("TotalDuration: ", totalDuration);
    if (!totalDuration) return;

    try {
      // Make an API call instead of using Prisma directly
      const response = await fetch("/api/study-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: totalDuration,
          dateStopped: new Date(localStorage.getItem("currentDate")!),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save study session");
      }
    } catch (error) {
      console.error("Error saving study session:", error);
    }

    localStorage.setItem("sessionDuration", "0");
    setSessionDuration(0);
  }, []);

  // Function to reset the inactivity timer
  const resetInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimerRef.current!);
    inactivityTimerRef.current = setTimeout(endSession, IDLE_TIMEOUT); // 5 minutes of inactivity
    if (!intervalTimerRef.current) {
      console.log("here");
      intervalTimerRef.current = setInterval(() => {
        setSessionDuration((prevDuration) => {
          console.log(prevDuration + 1);
          localStorage.setItem(
            "sessionDuration",
            (prevDuration + 1).toString(),
          );
          return prevDuration + 1;
        });
        localStorage.setItem("currentDate", new Date().toString());
      }, UPDATE_INTERVAL);
    }
  }, [endSession]);

  useEffect(() => {
    startSession();

    const handleSession = async () => {
      const currentDate = localStorage.getItem("currentDate");
      if (currentDate) {
        const storedDate = new Date(currentDate).getTime();
        const now = Date.now();
        const timeDifference = Math.abs(now - storedDate);

        // Check if difference is less than 2 seconds (2000 milliseconds)
        if (timeDifference < THRESHOLD) {
          const savedSessionDuration = localStorage.getItem("sessionDuration");

          if (savedSessionDuration) {
            setSessionDuration(parseInt(savedSessionDuration));
          }
        } else {
          await endSession();
        }
      }
    };

    // Execute the async function
    handleSession().catch(console.error);

    intervalTimerRef.current = setInterval(() => {
      setSessionDuration((prevDuration) => {
        console.log(prevDuration + 1);
        localStorage.setItem("sessionDuration", (prevDuration + 1).toString());
        return prevDuration + 1;
      });
      localStorage.setItem("currentDate", new Date().toString());
    }, UPDATE_INTERVAL);

    inactivityTimerRef.current = setTimeout(endSession, IDLE_TIMEOUT); // 5 minutes of inactivity

    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keydown", resetInactivityTimer);

    return () => {
      endSession();
      document.removeEventListener("mousemove", resetInactivityTimer);
      document.removeEventListener("keydown", resetInactivityTimer);
    };
  }, [resetInactivityTimer, endSession]);

  return (
    <StudySessionContext.Provider
      value={{ startSession, endSession, isStudying }}
    >
      {children}
    </StudySessionContext.Provider>
  );
};

// Custom hook for easy access
export const useStudySession = () => useContext(StudySessionContext);
