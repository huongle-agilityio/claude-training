import { useRef, useLayoutEffect, useCallback } from "react";

// FLIP: First (old position) → Last (new position) → Invert (jump back) → Play (slide)
export const useFlipAnimation = (items) => {
  const nodes = useRef(new Map());
  const prevTops = useRef(new Map());

  useLayoutEffect(() => {
    nodes.current.forEach((el, id) => {
      // offsetTop ignores scroll and transforms, so it is the real layout position
      const nextTop = el.offsetTop;
      const prevTop = prevTops.current.get(id);
      prevTops.current.set(id, nextTop);

      const deltaY = prevTop === undefined ? 0 : prevTop - nextTop;
      if (deltaY === 0) return;

      // Invert: put the element back where it was, without a transition
      el.style.transition = "none";
      el.style.transform = `translateY(${deltaY}px)`;
      // Force a reflow so the browser applies the inverted position first
      void el.offsetHeight;

      // Play: drop the inline styles so the CSS transform transition slides it home
      requestAnimationFrame(() => {
        el.style.transition = "";
        el.style.transform = "";
      });
    });
  }, [items]);

  // Cache one ref callback per id: a new callback each render would make React
  // detach/re-attach the ref and wipe the saved position before we can use it
  const refCallbacks = useRef(new Map());

  return useCallback((id) => {
    if (!refCallbacks.current.has(id)) {
      refCallbacks.current.set(id, (el) => {
        if (el) {
          nodes.current.set(id, el);
        } else {
          nodes.current.delete(id);
          prevTops.current.delete(id);
          refCallbacks.current.delete(id);
        }
      });
    }
    return refCallbacks.current.get(id);
  }, []);
};
