import { useEffect, useState } from "react";

export function AnimatedCounter({ value }) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // Duration of the animation in ms
    const increment = Math.ceil(value / (duration / 30)); // Adjust increment per frame
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCounter(value); // Ensure it doesn't exceed the value
        clearInterval(interval);
      } else {
        setCounter(start);
      }
    }, 30);

    return () => clearInterval(interval); // Cleanup
  }, [value]);

  return (
    <h1 className="subject-accuracy">
      <b>{counter}%</b>
    </h1>
  );
}
