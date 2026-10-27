import { useState } from "react";

export const GreetingForm = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    setMessage(trimmed ? `Hello, ${trimmed}` : "Name is required");
  };

  return (
    <form className="greeting-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="greeting-name">Name</label>
      <input
        id="greeting-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit" className="counter">
        Submit
      </button>
      {message && <p role="status">{message}</p>}
    </form>
  );
};
