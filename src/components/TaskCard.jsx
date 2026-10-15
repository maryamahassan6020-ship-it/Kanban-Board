import { Draggable } from "@hello-pangea/dnd";
import { useBoardStore } from "../store/useBoardStore.js";
import { useUIStore } from "../store/useUIStore.js";

const today = () => new Date().toISOString().slice(0, 10);

export default function TaskCard({ task, index, hidden, dragDisabled, done }) {
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const openModal = useUIStore((s) => s.openModal);
  const overdue = task.due && task.due < today() && !done;

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={dragDisabled}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card p-${task.priority} ${snapshot.isDragging ? "dragging" : ""}`}
          style={{ ...provided.draggableProps.style, display: hidden ? "none" : undefined }}
        >
          <h3 className={done ? "done-title" : ""}>{task.title}</h3>
          {task.description && <p className="desc">{task.description}</p>}

          <div className="meta">
            <span className={`badge ${task.priority}`}>{task.priority}</span>
            {task.due && (
              <span className={`due ${overdue ? "overdue" : ""}`}>
                {overdue ? "Overdue: " : "Due "}
                {task.due}
              </span>
            )}
          </div>

          {task.labels.length > 0 && (
            <div className="labels">
              {task.labels.map((l) => (
                <span key={l} className="label">{l}</span>
              ))}
            </div>
          )}

          <div className="card-actions">
            <button className="icon-btn" onClick={() => openModal({ columnId: null, taskId: task.id })}>
              Edit
            </button>
            <button className="icon-btn danger" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        </article>
      )}
    </Draggable>
  );
}
