import { getTextStats } from "../../utils/textStats";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body;

  if (typeof text !== "string") {
    return res.status(400).json({ error: "Invalid text input" });
  }

  const stats = getTextStats(text);
  res.status(200).json(stats);
}
