import { create } from "zustand";
import { persist } from "zustand/middleware";

const uid = () => crypto.randomUUID();

const seedTasks = [
  { id: "t1", title: "Design the landing page", description: "Sketch the hero and pricing sections.", priority: "high", due: "", labels: ["design"] },
  { id: "t2", title: "Set up the Zustand store", description: "Columns, tasks and persist middleware.", priority: "medium", due: "", labels: ["code"] },
  { id: "t3", title: "Write the README", description: "", priority: "low", due: "", labels: ["docs"] },
];

const initial = {
  columns: [
    { id: "todo", title: "To Do", taskIds: ["t1", "t3"] },
    { id: "doing", title: "Doing", taskIds: ["t2"] },
    { id: "done", title: "Done", taskIds: [] },
  ],
  tasks: Object.fromEntries(seedTasks.map((t) => [t.id, t])),
};

export const useBoardStore = create(
  persist(
    (set) => ({
      ...initial,

      addTask: (columnId, data) =>
        set((s) => {
          const id = uid();
          return {
            tasks: { ...s.tasks, [id]: { id, ...data } },
            columns: s.columns.map((c) =>
              c.id === columnId ? { ...c, taskIds: [...c.taskIds, id] } : c
            ),
          };
        }),

      updateTask: (id, data) =>
        set((s) => ({ tasks: { ...s.tasks, [id]: { ...s.tasks[id], ...data } } })),

      deleteTask: (id) =>
        set((s) => {
          const { [id]: _removed, ...tasks } = s.tasks;
          return {
            tasks,
            columns: s.columns.map((c) => ({
              ...c,
              taskIds: c.taskIds.filter((t) => t !== id),
            })),
          };
        }),

      moveTask: (srcCol, srcIndex, dstCol, dstIndex) =>
        set((s) => {
          const columns = s.columns.map((c) => ({ ...c, taskIds: [...c.taskIds] }));
          const from = columns.find((c) => c.id === srcCol);
          const to = columns.find((c) => c.id === dstCol);
          const [id] = from.taskIds.splice(srcIndex, 1);
          to.taskIds.splice(dstIndex, 0, id);
          return { columns };
        }),

      addColumn: (title) =>
        set((s) => ({ columns: [...s.columns, { id: uid(), title, taskIds: [] }] })),

      renameColumn: (id, title) =>
        set((s) => ({
          columns: s.columns.map((c) => (c.id === id ? { ...c, title } : c)),
        })),

      deleteColumn: (id) =>
        set((s) => {
          const col = s.columns.find((c) => c.id === id);
          const tasks = { ...s.tasks };
          col.taskIds.forEach((t) => delete tasks[t]);
          return { tasks, columns: s.columns.filter((c) => c.id !== id) };
        }),

      resetBoard: () => set(initial),
    }),
    { name: "kanban-board-storage" }
  )
);
