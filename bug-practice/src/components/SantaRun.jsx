import { useEffect, useRef, useState } from "react";
import "./SantaRun.css";

const SPARKLE_COUNT = 6;

function SantaRunner() {
  const [done, setDone] = useState(false);
  const runnerRef = useRef(null);

  // Native listener instead of onAnimationEnd: React maps that prop to a
  // vendor-prefixed event when AnimationEvent is missing (e.g. jsdom).
  useEffect(() => {
    const runner = runnerRef.current;
    if (!runner) return;
    // Only the runner's own "run" animation ends the show; sparkle animations
    // bubble animationend too, so ignore events from children.
    const handleAnimationEnd = (event) => {
      if (event.target === runner) setDone(true);
    };
    runner.addEventListener("animationend", handleAnimationEnd);
    return () => runner.removeEventListener("animationend", handleAnimationEnd);
  }, []);

  if (done) return null;

  return (
    <div className="santa-run" data-testid="santa-run" aria-hidden="true">
      <div
        ref={runnerRef}
        className="santa-run__runner"
        data-testid="santa-runner"
      >
        <span className="santa-run__trail">
          {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
            <span
              key={i}
              className="santa-run__sparkle"
              data-testid="santa-sparkle"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              ✨
            </span>
          ))}
        </span>
        <span className="santa-run__santa">🎅</span>
        <span className="santa-run__present">🎁</span>
      </div>
    </div>
  );
}

// Plays a Santa-with-presents run across the screen each time `runId` changes.
// A falsy runId (e.g. count reset to 0) shows nothing.
export function SantaRun({ runId }) {
  if (!runId) return null;
  return <SantaRunner key={runId} />;
}
