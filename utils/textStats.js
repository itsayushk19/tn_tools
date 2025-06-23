export function getTextStats(text) {
  const sentences = text.split(/[.!?]/).filter(Boolean).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const letters = text.replace(/\s/g, "").length;

  return { sentences, words, letters };
}
