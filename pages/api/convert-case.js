import { convertCase } from "../../utils/textCaseConverter";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { text, type } = req.body;

  if (typeof text !== "string" || typeof type !== "string") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const converted = convertCase(text, type);
    res.status(200).json({ converted });
  } catch (err) {
    res.status(500).json({ error: "Conversion failed" });
  }
}
