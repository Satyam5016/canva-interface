const { apps, delay, getGraphForApp } = require("../../data");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await delay(650);

  if (req.query.error === "true") {
    res.status(503).json({ message: "Simulated graph API failure" });
    return;
  }

  const { appId } = req.query;
  const app = apps.find((item) => item.id === appId);

  if (!app) {
    res.status(404).json({ message: "App not found" });
    return;
  }

  res.status(200).json(getGraphForApp(appId));
};
