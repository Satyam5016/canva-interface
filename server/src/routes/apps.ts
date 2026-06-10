import { Router } from "express";
import { apps, getGraphForApp } from "../data/mockData.js";

const router = Router();
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/", async (_req, res) => {
  await delay(420);
  res.json(apps);
});

router.get("/:appId/graph", async (req, res) => {
  await delay(650);

  if (req.query.error === "true") {
    res.status(503).json({ message: "Simulated graph API failure" });
    return;
  }

  const app = apps.find((item) => item.id === req.params.appId);
  if (!app) {
    res.status(404).json({ message: "App not found" });
    return;
  }

  res.json(getGraphForApp(req.params.appId));
});

export default router;
