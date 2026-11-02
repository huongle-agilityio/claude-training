import { useRef, useState } from "react";
import { MAX_GOAL, MIN_GOAL, getProgress, parseGoal } from "../utils/goal";

const ERROR_TEXT = `Enter a whole number from ${MIN_GOAL} to ${MAX_GOAL}`;

// The goal lives in the parent; the input text and error are local, so a
// remount (tab switch) starts from the current goal with no error.
export const GoalPanel = ({ goal, count = 0, onSetGoal, onClearGoal }) => {
  const [text, setText] = useState(goal === null ? "" : String(goal));
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef(null);

  // Progress values, computed only when a goal exists. The bar and
  // aria-valuenow stop at the goal; the text keeps the real count ("12 / 10").
  const progress =
    goal === null
      ? null
      : {
          reached: Math.min(count, goal),
          text: `${count} / ${goal}`,
          fillWidth: `${getProgress(count, goal) * 100}%`,
        };

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
      {progress !== null && (
        <>
          <p className="goal-progress-text">{progress.text}</p>
          <div
            className="goal-progress"
            role="progressbar"
            aria-label="Goal progress"
            aria-valuemin="0"
            aria-valuemax={goal}
            aria-valuenow={progress.reached}
            aria-valuetext={progress.text}
          >
            <div
              className="goal-progress-fill"
              style={{ width: progress.fillWidth }}
            />
          </div>
          <button type="button" className="counter" onClick={handleClear}>
            Clear goal
          </button>
        </>
      )}
    </form>
  );
};
