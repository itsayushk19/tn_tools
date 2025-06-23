// pages/api/mix-colors.js

import { mixColors } from "../../utils/colorMixer";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startColor, endColor, steps } = req.body;

  if (!startColor || !endColor || typeof steps !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const colors = mixColors(startColor, endColor, steps);
  res.status(200).json({ colors });
}
