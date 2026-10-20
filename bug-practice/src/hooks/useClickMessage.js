import { useState, useEffect } from "react";

export function useClickMessage(count) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (count === 0) return;
    const timer = setTimeout(() => {
      setMessage(`You clicked ${count} time${count !== 1 ? "s" : ""}`);
    }, 2000);
    return () => clearTimeout(timer);
  }, [count]);

  return message;
}
