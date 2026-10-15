import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import JokeBanner from "./components/JokeBanner.jsx";
import Board from "./components/Board.jsx";
import TaskModal from "./components/TaskModal.jsx";
import { useUIStore } from "./store/useUIStore.js";

export default function App() {
  const theme = useUIStore((s) => s.theme);
  const modal = useUIStore((s) => s.modal);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <Navbar />
      <JokeBanner />
      <Board />
      {modal && <TaskModal />}
    </>
  );
}