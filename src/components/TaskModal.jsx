import { useState, useEffect } from "react";
import { useBoardStore } from "../store/useBoardStore.js";
import { useUIStore } from "../store/useUIStore.js";

export default function TaskModal() {
  const { modal, closeModal } = useUIStore();
  const tasks = useBoardStore((s) => s.tasks);
  const addTask = useBoardStore((s) => s.addTask);
  const updateTask = useBoardStore((s) => s.updateTask);

  const editing = modal.taskId ? tasks[modal.taskId] : null;
  const [form, setForm] = useState({
    title: editing?.title ?? "",
    description: editing?.description ?? "",
    priority: editing?.priority ?? "medium",
    due: editing?.due ?? "",
    labels: editing?.labels.join(", ") ?? "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Give the task a title.");
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      due: form.due,
      labels: form.labels.split(",").map((l) => l.trim()).filter(Boolean),
    };
    editing ? updateTask(editing.id, data) : addTask(modal.columnId, data);
    closeModal();
  };

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-label="Task form">
        <h2>{editing ? "Edit task" : "New task"}</h2>

        <label>
          Title
          <input autoFocus value={form.title} onChange={set("title")} />
        </label>
        {error && <p className="error">{error}</p>}

        <label>
          Description
          <textarea rows="3" value={form.description} onChange={set("description")} />
        </label>

        <div className="row">
          <label>
            Priority
            <select value={form.priority} onChange={set("priority")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            Due date
            <input type="date" value={form.due} onChange={set("due")} />
          </label>
        </div>

        <label>
          Labels (separate with commas)
          <input value={form.labels} onChange={set("labels")} placeholder="design, bug" />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn primary">{editing ? "Save changes" : "Add task"}</button>
        </div>
      </form>
    </div>
  );
}
