import { generatePassword } from "../../utils/passwordUtils";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { length, options } = req.body;

  if (typeof length !== "number" || typeof options !== "object") {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  const password = generatePassword(length, options);
  res.status(200).json({ password });
}
