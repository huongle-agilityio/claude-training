import { useRef, useState } from "react";
import { MAX_GOAL, MIN_GOAL, getProgress, parseGoal } from "../utils/goal";

const ERROR_TEXT = `Enter a whole number from ${MIN_GOAL} to ${MAX_GOAL}`;

// The goal lives in the parent; the input text and error are local, so a
// remount (tab switch) starts from the current goal with no error.
export const GoalPanel = ({ goal, count = 0, onSetGoal, onClearGoal }) => {
  const [text, setText] = useState(goal === null ? "" : String(goal));
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef(null);

  // Progress values, each computed once. The bar and aria-valuenow stop at the
  // goal; the text keeps the real count (e.g. "12 / 10").
  const reached = Math.min(count, goal);
  const progressText = `${count} / ${goal}`;
  const fillWidth = `${getProgress(count, goal) * 100}%`;

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
          placeholder={`${MIN_GOAL}–${MAX_GOAL}`}
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
          <p className="goal-progress-text">{progressText}</p>
          <div
            className="goal-progress"
            role="progressbar"
            aria-label="Goal progress"
            aria-valuemin="0"
            aria-valuemax={goal}
            aria-valuenow={reached}
            aria-valuetext={progressText}
          >
            <div className="goal-progress-fill" style={{ width: fillWidth }} />
          </div>
          <button type="button" className="counter" onClick={handleClear}>
            Clear goal
          </button>
        </>
      )}
    </form>
  );
};
