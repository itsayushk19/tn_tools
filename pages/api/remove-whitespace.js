import { cleanText } from "../../utils/whitespace";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, options } = req.body;

  if (typeof text !== "string" || typeof options !== "object") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const cleanedText = cleanText(text, options);
    res.status(200).json({ cleanedText });
  } catch (error) {
    res.status(500).json({ error: "Failed to clean text" });
  }
}
