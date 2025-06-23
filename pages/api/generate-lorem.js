// pages/api/generate-lorem.js

import { generateLoremIpsum } from "../../utils/generateLorem";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { paragraphCount, avgWordsPerSentence, avgSentencesPerParagraph } = req.body;

    const output = generateLoremIpsum(
      paragraphCount || 1,
      avgWordsPerSentence || 10,
      avgSentencesPerParagraph || 5
    );

    res.status(200).json({ text: output });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
