import { useState } from "react";

export function ClickHistory() {
  const [history, setHistory] = useState([]);

  const handleRecord = () => {
    setHistory(prev => [...prev, new Date().toLocaleTimeString()]);
  };

  return (
    <div className="history-screen">
      <h2>Click History</h2>
      <p>Record each click with a timestamp.</p>
      <button type="button" className="counter" onClick={handleRecord}>
        Record Click
      </button>
      {history.length === 0 ? (
        <p className="empty">No clicks recorded yet.</p>
      ) : (
        <ul>
          {history.map((time, i) => (
            <li key={i}>{time}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
