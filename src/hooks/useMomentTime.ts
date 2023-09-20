import { useEffect, useState } from "react";

const useMomentTime = (next: () => any) => {
  let [momentDate, setMomentDate] = useState(next());
  useEffect(() => {
    const timer = setInterval(() => {
      setMomentDate(next());
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, [momentDate]);
  return [momentDate, setMomentDate];
};
export default useMomentTime;
