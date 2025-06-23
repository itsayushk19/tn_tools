// pages/api/convert-color.js
import convertColor from "../../utils/convertColor";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { color } = req.body;
  if (!color) return res.status(400).json({ error: "Missing color input" });

  const result = convertColor(color);
  if (result.error) return res.status(400).json(result);

  return res.status(200).json(result);
}
