import { create } from "zustand";
import { persist } from "zustand/middleware";

const FALLBACK_JOKES = [
  { text: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs." },
  { text: "There are 10 types of people in the world.", punchline: "Those who understand binary and those who don't." },
  { text: "A SQL query walks into a bar, walks up to two tables and asks:", punchline: "Can I join you?" },
  { text: "!false", punchline: "It's funny because it's true." },
  { text: "How many programmers does it take to change a light bulb?", punchline: "None, that's a hardware problem." },
];

export const useUIStore = create(
  persist(
    (set) => ({
      theme: "light",
      search: "",
      priority: "all",
      modal: null, // { columnId, taskId? } | null
      joke: null, // { text, punchline? }
      jokeLoading: false,

      fetchJoke: async () => {
        set({ jokeLoading: true });
        try {
          const res = await fetch(
            "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
          );
          const d = await res.json();
          if (d.error) throw new Error("No joke");
          set({
            joke: d.type === "single" ? { text: d.joke } : { text: d.setup, punchline: d.delivery },
            jokeLoading: false,
          });
        } catch {
          const j = FALLBACK_JOKES[Math.floor(Math.random() * FALLBACK_JOKES.length)];
          set({ joke: j, jokeLoading: false });
        }
      },

      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setSearch: (search) => set({ search }),
      setPriority: (priority) => set({ priority }),
      openModal: (modal) => set({ modal }),
      closeModal: () => set({ modal: null }),
    }),
    { name: "kanban-ui-storage", partialize: (s) => ({ theme: s.theme }) }
  )
);