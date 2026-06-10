# App Graph Builder UI

A polished take-home implementation of a dark App Graph Builder with a ReactFlow canvas, app selector, service node inspector, and a Node.js mock API.

## Stack

- React + Vite + TypeScript
- ReactFlow / `@xyflow/react`
- Tailwind CSS with shadcn-style local UI primitives
- TanStack Query for server state
- Zustand for UI selection and panel state
- Node.js + Express + TypeScript mock backend
- In-memory data by default, no MongoDB required

## Setup on MacBook M1

Use Node.js 20 LTS or newer.

```bash
npm install
npm run dev
```

The root `dev` script starts both apps:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Scripts

Root:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

Frontend:

```bash
npm run dev -w client
npm run build -w client
npm run preview -w client
npm run lint -w client
npm run typecheck -w client
```

Backend:

```bash
npm run dev -w server
npm run build -w server
npm run start -w server
npm run typecheck -w server
```

## Environment Variables

Frontend:

- `VITE_API_BASE_URL`: optional API base URL. Leave unset during local Vite development so `/api` is proxied to the backend.

Backend:

- `PORT`: optional backend port, defaults to `4000`.
- `CLIENT_ORIGIN`: optional CORS origin, defaults to `http://localhost:5173`.

## API

The mock backend provides:

- `GET /api/health`
- `GET /api/apps`
- `GET /api/apps/:appId/graph`
- `GET /api/apps/:appId/graph?error=true`

Graph responses include service/database/cache nodes, edges, provider details, status, metrics, positions, and simulated latency.

## Architecture

Frontend code is split by responsibility:

- `src/components/layout`: top bar and left rail
- `src/components/panels`: app list and node inspector
- `src/components/canvas`: ReactFlow canvas and custom node cards
- `src/hooks`: TanStack Query hooks
- `src/store`: Zustand UI state
- `src/api`: typed API client
- `src/types`: shared frontend types

Backend code is intentionally small:

- `server/src/index.ts`: Express app bootstrap
- `server/src/routes/apps.ts`: app and graph routes
- `server/src/data/mockData.ts`: in-memory mock data

## Key Decisions

- ReactFlow owns node/edge interactions while Zustand owns global UI state such as selected app, selected node, panel state, and inspector tab.
- TanStack Query caches backend graph responses; edited graph state is also kept per app in the frontend for the active session.
- The UI uses local shadcn-style primitives instead of generated shadcn files to keep the project lightweight and easy to review.
- MongoDB is not required, keeping the assignment runnable without services or Docker.

## Feature Checklist

- Dark dotted graph canvas
- Top bar with logo, selected app, fit view, panel toggle, action icons, avatar
- Left icon rail
- App selector with search, loading state, error state, and retry
- Mock API with latency and optional error simulation
- ReactFlow pan/zoom, draggable nodes, edges, minimap, controls
- Custom node cards with status badges, metrics, provider label, and resource slider display
- Select node on click
- Delete selected node with Delete or Backspace
- Add Node button
- Fit View button and `F` keyboard shortcut
- Toggle panel with `P` keyboard shortcut
- Node inspector with Config and Runtime tabs
- Editable name, description, and synced slider/number control
- Responsive mobile slide-over panel

## Known Limitations

- Changes are stored in browser memory only and reset on reload.
- The provider logo is represented as text to avoid extra asset dependencies.
- The backend is a mock API and does not persist to MongoDB.

## Demo Steps

1. Run `npm install`.
2. Run `npm run dev`.
3. Open `http://localhost:5173`.
4. Search/select a different app from the panel.
5. Select a node, edit its config, and observe the card update.
6. Press `F` to fit the graph, `P` to toggle the panel, or Delete/Backspace to remove a selected node.
