import hashData from "utils/hash"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { data, algorithm } = req.body;

    if (!data || !algorithm) {
      return res.status(400).json({ error: "Missing data or algorithm" });
    }

    const supportedAlgorithms = [
      "md5",
      "sha1",
      "sha224",
      "sha256",
      "sha384",
      "sha512",
      "blake3",
    ];
    if (!supportedAlgorithms.includes(algorithm)) {
      return res.status(400).json({ error: "Unsupported algorithm type" });
    }

    try {
      const hashedData = hashData(data, algorithm);
      return res.status(200).json({ hashedData });
    } catch (error) {
      return res.status(500).json({ error: "Error hashing data" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
