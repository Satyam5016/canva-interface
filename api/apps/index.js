const { apps, delay } = require("../data");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  await delay(420);
  res.status(200).json(apps);
};
