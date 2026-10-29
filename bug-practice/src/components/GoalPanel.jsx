import { useRef, useState } from "react";
import { parseGoal } from "../utils/goal";

const ERROR_TEXT = "Enter a whole number from 1 to 999";

// The goal lives in the parent; the input text and error are local, so a
// remount (tab switch) starts from the current goal with no error.
export const GoalPanel = ({ goal, onSetGoal, onClearGoal }) => {
  const [text, setText] = useState(goal === null ? "" : String(goal));
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = parseGoal(text);
    if (value === null) {
      setHasError(true);
      return;
    }
    setHasError(false);
    onSetGoal(value);
  };

  const handleClear = () => {
    setText("");
    setHasError(false);
    onClearGoal();
    inputRef.current.focus();
  };

  return (
    <form className="goal-panel" onSubmit={handleSubmit} noValidate>
      <label htmlFor="goal-input">Your goal</label>
      <div>
        <input
          ref={inputRef}
          id="goal-input"
          type="text"
          inputMode="numeric"
          placeholder="1–999"
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={hasError ? "goal-error" : undefined}
        />
        <button type="submit" className="counter">
          Set goal
        </button>
      </div>
      {hasError && (
        <p id="goal-error" className="goal-error" role="alert">
          {ERROR_TEXT}
        </p>
      )}
      {goal !== null && (
        <>
          <p>{`Goal: ${goal}`}</p>
          <button type="button" className="counter" onClick={handleClear}>
            Clear goal
          </button>
        </>
      )}
    </form>
  );
};
