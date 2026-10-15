# Tasklane: Kanban Board

Tasklane is a front-end task manager built with **React**, **Vite** and **Zustand**. Tasks live on a Kanban board with draggable cards, and a programmer-jokes banner (loaded from a public API) keeps the work day lighter.

All data is stored in the browser, so the project needs no backend.

## Features

**Board**
- Add, rename (double-click the title) and delete columns
- Drag and drop tasks between columns and inside a column
- Task count on every column

**Tasks**
- Add, edit and delete tasks
- Title, description, priority (low, medium, high), due date and labels
- Colour-coded priority on each card
- Overdue tasks are highlighted in red (unless they are in the "Done" column)

**Search and filter**
- Search by task title or label
- Filter by priority
- Dragging is paused while a filter is active so the order is never changed by mistake

**Programmer jokes (API)**
- Jokes are fetched from [JokeAPI](https://v2.jokeapi.dev) (`Programming` category, with NSFW, religious, political, racist, sexist and explicit jokes filtered out)
- Two-part jokes show the setup first, then a "Show punchline" button
- "New joke" button loads another joke
- If the API is unreachable, the app falls back to a small built-in list so it never breaks

**Interface**
- Light and dark mode
- Responsive layout (works on mobile)
- Keyboard focus styles and reduced-motion support
- Data is saved in `localStorage`, so it survives a page refresh
- "Reset board" returns the board to the sample data

## Tech stack

| Tool | Purpose |
| --- | --- |
| React 18 | UI components |
| Vite | Development server and build |
| Zustand | Global state management |
| Zustand `persist` middleware | Saving state to `localStorage` |
| @hello-pangea/dnd | Drag and drop |
| JokeAPI | Programmer jokes |
| Plain CSS (custom properties) | Styling and theming |

## Getting started

Requirements: [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the link shown in the terminal (usually `http://localhost:5173`).

Other commands:

```bash
npm run build     # production build in /dist
npm run preview   # preview the production build
```

## Project structure

```
src/
├── components/
│   ├── Navbar.jsx       # title, search, priority filter, theme toggle, reset
│   ├── JokeBanner.jsx   # programmer joke card
│   ├── Board.jsx        # drag-and-drop context and "add column" form
│   ├── Column.jsx       # one column, its tasks and its actions
│   ├── TaskCard.jsx     # one draggable task
│   └── TaskModal.jsx    # add / edit task form
├── store/
│   ├── useBoardStore.js # columns, tasks and all board actions
│   └── useUIStore.js    # theme, search, filter, modal and joke state
├── App.jsx
├── main.jsx
└── index.css
```

## How state management works

The app uses two Zustand stores.

**`useBoardStore`** holds the data:
- `columns`: an ordered list, each with an `id`, a `title` and a list of `taskIds`
- `tasks`: an object keyed by task id
- actions: `addTask`, `updateTask`, `deleteTask`, `moveTask`, `addColumn`, `renameColumn`, `deleteColumn`, `resetBoard`

Keeping tasks in an object and only storing ids inside columns makes moving a task cheap: only the id is removed from one list and inserted into another. The whole store is saved to `localStorage` with the `persist` middleware.

**`useUIStore`** holds interface state:
- theme (the only value that is persisted), search text, priority filter and which modal is open
- joke state and the `fetchJoke` action, which calls the API and falls back to local jokes on failure

## Possible improvements

- Multiple boards with React Router
- Reordering columns by drag and drop
- Saving favourite jokes
- Unit tests for the Zustand actions
- Backend with user accounts so boards sync across devices