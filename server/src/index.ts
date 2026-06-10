import cors from "cors";
import express from "express";
import appsRouter from "./routes/apps.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "app-graph-builder-api" });
});

app.use("/api/apps", appsRouter);

app.listen(port, () => {
  console.log(`Mock API listening on http://localhost:${port}`);
});
