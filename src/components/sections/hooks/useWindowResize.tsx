import { useEffect } from "react";

const useWindowResize = (callback: () => void): void => {
  useEffect(() => {
    window.addEventListener("resize", callback);
    return () => {
      window.removeEventListener("resize", callback);
    };
  }, [callback]);
};

export default useWindowResize;
