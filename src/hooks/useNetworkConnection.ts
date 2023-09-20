import { useState, useEffect } from "react";

const useNetworkConnection = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://www.google.com/", {
        mode: "no-cors",
      })
        .then(() => !isOnline && setIsOnline(true))
        .catch(() => isOnline && setIsOnline(false));
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline]);

  return { isOnline };
};

export default useNetworkConnection;
