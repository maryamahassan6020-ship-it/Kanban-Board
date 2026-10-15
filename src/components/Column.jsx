import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard.jsx";
import { useBoardStore } from "../store/useBoardStore.js";
import { useUIStore } from "../store/useUIStore.js";

const ACCENTS = ["#7c3aed", "#f43f5e", "#f59e0b", "#10b981", "#0ea5e9"];
export default function Column({ column, index = 0 })  {
  const tasks = useBoardStore((s) => s.tasks);
  const renameColumn = useBoardStore((s) => s.renameColumn);
  const deleteColumn = useBoardStore((s) => s.deleteColumn);
  const { search, priority, openModal } = useUIStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(column.title);

  const filtering = search.trim() !== "" || priority !== "all";
  const q = search.trim().toLowerCase();

  const matches = (t) =>
    (priority === "all" || t.priority === priority) &&
    (!q || t.title.toLowerCase().includes(q) || t.labels.some((l) => l.toLowerCase().includes(q)));

  const saveName = () => {
    if (name.trim()) renameColumn(column.id, name.trim());
    else setName(column.title);
    setEditing(false);
  };

  return (
    <section className="column" style={{ "--col": ACCENTS[index % ACCENTS.length] }}>
      <div className="column-head">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            aria-label="Column name"
          />
        ) : (
          <h2 onDoubleClick={() => setEditing(true)} title="Double-click to rename">
            {column.title} <span className="count">{column.taskIds.length}</span>
          </h2>
        )}
        <button
          className="icon-btn"
          aria-label={`Delete column ${column.title}`}
          onClick={() =>
            confirm(`Delete "${column.title}" and its ${column.taskIds.length} task(s)?`) &&
            deleteColumn(column.id)
          }
        >
          Delete
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`task-list ${snapshot.isDraggingOver ? "over" : ""}`}
          >
            {column.taskIds.map((id, index) => {
              const task = tasks[id];
              if (!task) return null;
              // Hidden tasks stay mounted so drag indexes stay correct.
              return (
                <TaskCard
                  key={id}
                  task={task}
                  index={index}
                  hidden={!matches(task)}
                  dragDisabled={filtering}
                  done={column.id === "done"}
                />
              );
            })}
            {provided.placeholder}
            {column.taskIds.length === 0 && <p className="empty">No tasks yet. Add the first one.</p>}
          </div>
        )}
      </Droppable>

      <button className="btn ghost add" onClick={() => openModal({ columnId: column.id })}>
        Add task
      </button>
    </section>
  );
}
