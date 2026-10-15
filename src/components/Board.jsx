import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column.jsx";
import { useBoardStore } from "../store/useBoardStore.js";

export default function Board() {
  const columns = useBoardStore((s) => s.columns);
  const moveTask = useBoardStore((s) => s.moveTask);
  const addColumn = useBoardStore((s) => s.addColumn);
  const [title, setTitle] = useState("");

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    moveTask(source.droppableId, source.index, destination.droppableId, destination.index);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addColumn(title.trim());
    setTitle("");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="board">
        {columns.map((col, i) => (
          <Column key={col.id} column={col} index={i} />
        ))}
        <form className="new-column" onSubmit={submit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New column name"
            aria-label="New column name"
          />
          <button className="btn primary" type="submit">Add column</button>
        </form>
      </main>
    </DragDropContext>
  );
}