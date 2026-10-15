import { useEffect, useState } from "react";
import { useUIStore } from "../store/useUIStore.js";

export default function JokeBanner() {
  const { joke, jokeLoading, fetchJoke } = useUIStore();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    fetchJoke();
  }, [fetchJoke]);

  useEffect(() => setRevealed(false), [joke]);

  return (
    <section className="joke" aria-live="polite">
      <div className="joke-text">
        <p className="joke-line">{jokeLoading && !joke ? "Loading a joke..." : joke?.text}</p>
        {joke?.punchline &&
          (revealed ? (
            <p className="joke-punch">{joke.punchline}</p>
          ) : (
            <button className="link-btn" onClick={() => setRevealed(true)}>Show punchline</button>
          ))}
      </div>
      <button className="btn joke-btn" onClick={fetchJoke} disabled={jokeLoading}>
        {jokeLoading ? "Fetching..." : "New joke"}
      </button>
    </section>
  );
}