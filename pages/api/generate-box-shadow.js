import { generateBoxShadowCSS } from "../../utils/generateBoxShadow";


export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { HorizOff, VertOff, Blur, Spread, thirdColor, inset } = req.body;

  if (
    [HorizOff, VertOff, Blur, Spread].some((v) => isNaN(Number(v))) ||
    typeof thirdColor !== "string" ||
    typeof inset !== "boolean"
  ) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  const css = generateBoxShadowCSS({
    HorizOff,
    VertOff,
    Blur,
    Spread,
    thirdColor,
    inset,
  });

  res.status(200).json({ css });
}
