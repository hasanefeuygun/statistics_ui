# Statistics UI

NextJs UI based on WebSocket(via Socket.io Library)for Statistics Project

‼️**This frontend must run together with Statistics Backend(NestJs API).Repo name -> statistics_backend.**

## 📦 Installation

```bash
npm install
```

---

## 🔐 Environment Variables (Required)

### Create `.env` (or `.env.local`)

Create **one** of these files in the frontend root folder, take a look at `.env.example`:

- `.env` OR `.env.local`

Put this inside:

```env
NEXT_PUBLIC_API_URL=http://localhost:{Choose Port}
```

## ▶️ Run Frontend

```bash
npm run dev
```

Frontend will be available at:

- http://localhost:3000

---

## 🔗 Backend Connection

WebSocket namespace is

- `NEXT_PUBLIC_API_URL/`

Example:

- http://localhost:8080

A WebSocket connection is initialized when the frontend application boots.So make sure the backend is running first.

---

### 📊 Statistics Chart

- Displays the **percentage distribution** of incoming random numbers.
- Each bar represents how often a specific number appears relative to the total count.
- Updates in real-time as new data arrives through WebSocket.

## 🔌 WebSocket Connection Lifecycle

The WebSocket connection is managed using `useEffect` and is tightly coupled to the lifecycle of each page.

### 🏠 Home Page

- When the Home page is mounted, a WebSocket connection is established.
- The connection is created inside a `useEffect` hook.
- A cleanup function checks whether the component is unmounted.
- If the component is unmounted, the WebSocket connection is gracefully closed.

This ensures that the connection only exists while the Home page is active.

### 📊 Chart Page

- The same lifecycle logic applies to the Chart page.
- When navigating from Home to Chart:
  - The WebSocket connection created on the Home page is closed.
  - A new WebSocket connection is established on the Chart page.
- All of these operations are controlled via `useEffect` hooks and their cleanup functions.

### ✅ Result

- Only one active WebSocket connection exists at any given time.
- Connections are created and destroyed based on page lifecycle.
- Prevents duplicate connections and unnecessary resource usage.
- Ensures predictable and maintainable real-time data flow.

## 🔄 Real-Time Data Flow Control

The frontend is connected to an API that contains a service responsible for generating a random number every 5 seconds.

### 🎛 Start / Stop Data Flow (Home Page)

- The Home page contains a **Start Data Flow** and **Stop Data Flow** button.
- These buttons control whether the backend service should actively generate data.

### 🔁 How It Works

- When **Start Data Flow** is clicked:
  - The frontend sends a `subscribe` event to the API's Event Gateway.
  - The backend service begins generating a random number every 5 seconds.
  - Generated numbers are streamed to the frontend through WebSocket.

- When **Stop Data Flow** is clicked:
  - The frontend sends an `unsubscribe` event to the API's Event Gateway.
  - The backend service stops generating numbers.
  - No further data is pushed to the client.

### ✅ Result

- Data production is fully controlled from the frontend.
- The backend only produces data when at least one client explicitly subscribes.
- Prevents unnecessary background processing.
- Keeps the real-time pipeline efficient and event-driven.

## 🛠 Tech Stack

- Next.js
- TypeScript
- Socket.io-client
- Tailwind CSS
- Chart Library (Recharts / Chart.js / etc.)

## 🧱 Architecture

```
Frontend (Next.js)
|
| WebSocket
|
Backend (NestJS Gateway)
|
| Event
|
Random Number Service
```
