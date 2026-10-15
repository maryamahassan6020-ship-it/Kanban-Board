import { useUIStore } from "../store/useUIStore.js";
import { useBoardStore } from "../store/useBoardStore.js";

export default function Navbar() {
  const { theme, toggleTheme, search, setSearch, priority, setPriority } = useUIStore();
  const resetBoard = useBoardStore((s) => s.resetBoard);

  return (
    <header className="navbar">
      <h1 className="brand">Tasklane</h1>
      <div className="tools">
        <input
          type="search"
          placeholder="Search tasks or labels"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search tasks"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button className="btn ghost" onClick={toggleTheme}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        <button
          className="btn ghost"
          onClick={() => confirm("Reset the board to the sample data?") && resetBoard()}
        >
          Reset board
        </button>
      </div>
    </header>
  );
}
